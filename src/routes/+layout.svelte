<script lang="ts">
    import "tippy.js/dist/tippy.css";
    import "../app.sass";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { browser } from "$app/environment";
    import { navigating, page } from "$app/stores";
    import { onMount } from "svelte";
    import IconShuffle from "~icons/ph/shuffle";
    import IconArrowLeft from "~icons/ph/arrow-left";
    import IconArrowRight from "~icons/ph/arrow-right";
    import IconMenu from "~icons/ph/list";
    import IconX from "~icons/ph/x";

    let navprogress = 30;
    let navInterval: number;
    let showProgress = false;
    export let timeDisplay: string = new Date().toLocaleString();
    let mobileOpen = false;
    let mouseX = 0;
    let mouseY = 0;

    setInterval(() => {
        timeDisplay = new Date().toLocaleString();
    }, 200);

    beforeNavigate(() => {
        navprogress = 5;
        showProgress = true;
        navInterval = window.setInterval(() => {
            navprogress += navprogress <= 90 ? 2.5 : navprogress < 95 ? 0.1 : 0;
        }, 500);
    });

    onMount(() => {
        setInterval(() => {
            if (!navigating) {
                if (showProgress) resetProgress();
            }
        }, 2000);
        initGlassEffects();
        initMouseTracking();
    });

    function resetProgress() {
        clearInterval(navInterval);
        navprogress = 100;
        setTimeout(() => {
            showProgress = false;
        }, 300);
        setTimeout(() => {
            navprogress = 0;
        }, 500);
    }

    function initMouseTracking() {
        if (!browser) return;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            //  properties for mouse position so it does the pointing thing
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }

    function initGlassEffects() {
        if (!browser) return;
        
        // again a now actually functional  3D tilt effect for the "glass" can you tell where i'm getting these ideas elements :3
        const glassElements = document.querySelectorAll('.glass-nav, .glass-card, .glass-element');
        
        glassElements.forEach((element: Element) => {
            const el = element as HTMLElement;
            
            // Set up 3D transform context
            el.style.transformStyle = 'preserve-3d';
            el.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
            
            el.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                // More subtle tilt effect
                const rotateX = (mouseY / rect.height) * -8;
                const rotateY = (mouseX / rect.width) * 8;
                const translateZ = 5;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
                
                // Add glow effect based on mouse proximity
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
                const glowIntensity = Math.max(0, 1 - (distance / maxDistance));
                
                el.style.setProperty('--glow-intensity', glowIntensity.toString());
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                el.style.removeProperty('--glow-intensity');
                
                setTimeout(() => {
                    el.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 400);
            });
        });
        
        // Add liquid glass morphing to special elements
        const morphingElements = document.querySelectorAll('[data-glass-morph]');
        morphingElements.forEach((el: Element) => {
            const element = el as HTMLElement;
            element.addEventListener('mouseenter', () => {
                element.style.animationDuration = '2s';
            });
            element.addEventListener('mouseleave', () => {
                element.style.animationDuration = '8s';
            });
        });
    }

    afterNavigate(() => {
        resetProgress();
        setTimeout(initGlassEffects, 100);
    });
</script>

<svelte:head>
    <link rel="icon" href="https://avatars.githubusercontent.com/u/79297197?v=4" />
</svelte:head>

<!-- Enhanced loading bar with glass effect -->
<div 
    id="loadingBar" 
    class="glass-loading-bar" 
    style:width={`${navprogress}%`} 
    class:active={showProgress} 
/>

<!-- Enhanced navigation with liquid glass -->
<nav class="glass-nav " style="z-index:10" data-glass-morph>
    <div class="nav-content">
        <div id="header">
            <div class="site-title-container">
                <p id="site-name" class="glass-shimmer">
                    adabit.org<sup class="text-rose">★</sup>
                </p>
                <div class="title-glow"></div>
            </div>
            
            <p id="time-display" class="glass-pulse">
                {#if !browser}<abbr title="Rendered at">r=</abbr>{/if}{timeDisplay}
            </p>
            
            <button id="mobile-toggle" class="glass-btn-secondary" on:click={() => (mobileOpen = !mobileOpen)}>
                {#if mobileOpen}
                    <IconX />
                {:else}
                    <IconMenu />
                {/if}
            </button>
        </div>
        
        <div id="nav" class:open={mobileOpen}>
            <a href="/" class="glass-nav-link" class:current={$page.url.pathname == "/"} on:click={() => (mobileOpen = false)}>~/home</a>
            <a href="/art" class="glass-nav-link" class:current={$page.url.pathname == "/art"} on:click={() => (mobileOpen = false)}>~/art</a>
            <a href="/commissions" class="glass-nav-link" class:current={$page.url.pathname == "/wires"} on:click={() => (mobileOpen = false)}>~/wires</a>
            <a href="/blog" class="glass-nav-link" class:current={$page.url.pathname == "/blog"} on:click={() => (mobileOpen = false)}>~/blog</a>
            <a href="/services" class="glass-nav-link" class:current={$page.url.pathname == "/services"} on:click={() => (mobileOpen = false)}>~/services</a>
            <a href="/projects" class="glass-nav-link" class:current={$page.url.pathname == "/projects"} on:click={() => (mobileOpen = false)}>~/projects</a>
        </div>
        <hr class="glass-divider" />
    </div>
</nav>

<!-- Main content with glass background -->
<div class="main-wrapper">
    <slot />
</div>

<style lang="sass">
    .glass-loading-bar
        position: fixed
        top: 0
        left: 0
        height: 0
        background: linear-gradient(90deg, rgba(156, 207, 216, 0.8), rgba(235, 111, 146, 0.6), rgba(196, 167, 231, 0.8))
        background-size: 200% 100%
        animation: glass-shimmer 2s ease-in-out infinite
        transition-property: width, height
        transition-duration: 150ms
        z-index: 1000
        border-radius: 0 0 4px 0
        box-shadow: 0 2px 8px rgba(156, 207, 216, 0.3)
        
        &.active
            height: 3px

    .nav-content
        position: relative
        z-index: 1

    #header
        display: flex
        justify-content: space-between
        align-items: center
        padding: 0.75rem 1.5rem
        p
            margin: 0

    .site-title-container
        position: relative
        display: inline-block
        
        .title-glow
            position: absolute
            top: -10px
            left: -10px
            right: -10px
            bottom: -10px
            background: radial-gradient(circle at center, rgba(204, 126, 151, 0.3) 0%, transparent 70%)
            border-radius: 50%
            opacity: 0
            transition: opacity 0.3s ease
            pointer-events: none
            z-index: -1
        
        &:hover .title-glow
            opacity: 1

    #site-name
        color: #CC7E97
        font-weight: 500
        letter-spacing: 0.5px
        position: relative
        
        sup
            font-size: 0.7em
            vertical-align: super

    #time-display
        color: #5BCEFA
        font-family: 'Fira Code VF', monospace
        font-size: 0.9em
        padding: 0.5rem 1rem
        border-radius: 8px
        background: rgba(91, 206, 250, 0.1)
        backdrop-filter: blur(8px)
        -webkit-backdrop-filter: blur(8px)
        border: 1px solid rgba(91, 206, 250, 0.2)

    #nav
        display: flex
        justify-content: flex-start
        gap: 0.5rem
        padding: 0 1.5rem 1rem
        flex-wrap: wrap
        border-radius: 0rem
        backdrop-filter: blur(10px);   
        &.open
            display: flex
            flex-direction: column
            gap: 0.75rem

    .glass-nav-link
        text-decoration: none
        padding: 0.6rem 1.2rem
        border-radius: 8px
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
        position: relative
        overflow: hidden
        font-weight: 500
        
        background: rgba(255, 255, 255, 0.05)
        backdrop-filter: blur(8px)
        -webkit-backdrop-filter: blur(8px)
        border: 1px solid rgba(255, 255, 255, 0.1)
        
        &::before
            content: ''
            position: absolute
            top: 0
            left: -100%
            width: 100%
            height: 100%
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)
            transition: left 0.5s ease
        
        &:hover
            background: rgba(255, 255, 255, 0.12)
            transform: translateY(-2px)
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
            
            &::before
                left: 100%
        
        &.current
            background: linear-gradient(135deg, rgba(235, 188, 186, 0.2) 0%, rgba(235, 188, 186, 0.1) 100%)
            color: var(--color-rose)
            border-color: rgba(235, 188, 186, 0.3)
            box-shadow: 0 0 0 1px rgba(235, 188, 186, 0.2), 0 4px 12px rgba(235, 188, 186, 0.1)

    #mobile-toggle
        display: none
        background: rgba(255, 255, 255, 0.1)
        border: 1px solid rgba(255, 255, 255, 0.2)
        border-radius: 8px
        cursor: pointer
        font-size: 1.2rem
        padding: 0.5rem
        color: var(--color-text)
        backdrop-filter: blur(8px)
        -webkit-backdrop-filter: blur(8px)
        transition: all 0.3s ease
        
        &:hover
            background: rgba(255, 255, 255, 0.15)
            transform: scale(1.05)

    .glass-divider
        margin: 0 1.5rem
        border: none
        height: 1px
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)

    .main-wrapper
        position: relative
        min-height: calc(100vh - 120px)
        
        &::before
            content: ''
            position: fixed
            top: 0
            left: 0
            width: 100vw
            height: 100vh
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                rgba(156, 207, 216, 0.03) 0%, 
                rgba(235, 111, 146, 0.02) 25%, 
                rgba(196, 167, 231, 0.02) 50%, 
                transparent 70%)
            pointer-events: none
            z-index: -1
            opacity: 0.6
            transition: opacity 0.3s ease

    // silly glass elements cause i really liked my phone's newest update
    :global(.glass-element)
        backdrop-filter: blur(12px)
        -webkit-backdrop-filter: blur(12px)
        background: rgba(255, 255, 255, 0.08)
        border: 1px solid rgba(255, 255, 255, 0.15)
        border-radius: 12px
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)
        transform-style: preserve-3d
        will-change: transform
        position: relative
        
        &::before
            content: ''
            position: absolute
            top: 0
            left: 0
            right: 0
            height: 1px
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)
            pointer-events: none

    // actually working animation haha this broken code was here so long
    @media (max-width: 768px)
        #nav
            display: none
            margin: 0
            padding: 1rem 1.5rem
            
            a
                margin: 0
                padding: 0.75rem 1rem
        
        #nav.open
            display: flex
            background: rgba(255, 255, 255, 0.05)
            backdrop-filter: blur(15px)
            -webkit-backdrop-filter: blur(15px)
            border-radius: 12px
            margin: 0 1rem
            border: 1px solid rgba(255, 255, 255, 0.1)
        
        #mobile-toggle
            display: flex
            align-items: center
            justify-content: center
        
        #header
            padding: 0.75rem 1rem
         
    // Animation keyframes (i should put these in the sass)
    @keyframes glass-shimmer
        0%
            background-position: -200% 0
        100%
            background-position: 200% 0

    @keyframes glass-pulse
        0%, 100%
            box-shadow: 0 0 0 0 rgba(156, 207, 216, 0.3)
        50%
            box-shadow: 0 0 0 8px rgba(156, 207, 216, 0)
</style>
