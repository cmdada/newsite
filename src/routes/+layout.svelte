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
        initTiltEffects();
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

    function initTiltEffects() {
        if (!browser) return;
        const glassElements = document.querySelectorAll('nav, .glass-element');
        glassElements.forEach((element: Element) => {
            const el = element as HTMLElement;
            el.style.transformStyle = 'preserve-3d';
            el.style.transition = 'transform 0.1s ease-out';
            el.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                const rotateX = (mouseY / rect.height) * -10;
                const rotateY = (mouseX / rect.width) * 10;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.3s ease-out';
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
                setTimeout(() => {
                    el.style.transition = 'transform 0.1s ease-out';
                }, 300);
            });
        });
    }

    afterNavigate(() => {
        resetProgress();
        setTimeout(initTiltEffects, 100);
    });
</script>

<svelte:head>
    <link rel="icon" href="https://avatars.githubusercontent.com/u/79297197?v=4" />
</svelte:head>

<div id="loadingBar" style:width={`${navprogress}%`} class:active={showProgress} />

<nav class="sticky glass-nav" style="z-index:10">
    <div>
        <div id="header">
            <p id="site-name">adabit.org<sup>★</sup></p>
            <p id="time-display">
                {#if !browser}<abbr title="Rendered at">r=</abbr>{/if}{timeDisplay}
            </p>
            <button id="mobile-toggle" on:click={() => (mobileOpen = !mobileOpen)}>
                {#if mobileOpen}
                    <IconX />
                {:else}
                    <IconMenu />
                {/if}
            </button>
        </div>
        <div id="nav" class:open={mobileOpen}>
            <a href="/" class:current={$page.url.pathname == "/"} on:click={() => (mobileOpen = false)}>~/home</a>
            <a href="/art" class:current={$page.url.pathname == "/art"} on:click={() => (mobileOpen = false)}>~/art</a>
            <a href="/commissions" class:current={$page.url.pathname == "/commissions"} on:click={() => (mobileOpen = false)}>~/commissions</a>
            <a href="/blog" class:current={$page.url.pathname == "/blog"} on:click={() => (mobileOpen = false)}>~/blog</a>
            <a href="/services" class:current={$page.url.pathname == "/services"} on:click={() => (mobileOpen = false)}>~/services</a>
            <a href="/projects" class:current={$page.url.pathname == "/projects"} on:click={() => (mobileOpen = false)}>~/projects</a>
        </div>
        <hr />
    </div>
</nav>

<div use:twemoji>
    <slot />
</div>

<style lang="sass">
    #header
        display: flex
        justify-content: space-between
        align-items: center
        p
            margin: 0.75em 0.75em
    #time-display
        color: #5BCEFA
        moe
            color: #49A7CC
        #site-name
            color: #CC7E97
    #nav
        display: flex
        justify-content: start
        margin: 0 1rem
        a
            margin: 0 0.35rem
    #nav a
        text-decoration: none
    #nav.open
        display: flex
        flex-direction: column
    #mobile-toggle
        display: none
        background: none
        border: none
        cursor: pointer
        font-size: 1.5rem
        margin-right: 0.75rem
    .current
        color: var(--color-rose)
    #loadingBar
        position: fixed
        top: 0
        left: 0
        height: 0
        background-color: var(--color-love)
        transition-property: width, height
        transition-duration: 150ms
        z-index: 1
        &.active
            height: 0.2rem
    #footer
        margin: 0 1rem
        padding-bottom: 2rem
        p
            margin-top: 0.25rem
            margin-bottom: 0
    .webring
        padding: 0.2rem 0.5rem
        border-width: 2px
        border-radius: 30px
        border-style: solid
        border-color: var(--hl-med)
    #nojs
        margin: 0
        padding-top: 1em
        color: var(--color-pine)
        text-align: center
        p
            margin: 0
    nav
        background-color: var(--color-base)
        backdrop-filter: blur(10px)
        -webkit-backdrop-filter: blur(10px)
        border: 1px solid rgba(255, 255, 255, 0.1)
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
    .glass-nav
        background: rgba(255, 255, 255, 0.05)
        border-radius: 0 0 12px 12px
        transform-style: preserve-3d
        will-change: transform
    .sticky
        position: sticky
        top: 0
    :global(.glass-element)
        backdrop-filter: blur(10px)
        -webkit-backdrop-filter: blur(10px)
        background: rgba(255, 255, 255, 0.1)
        border: 1px solid rgba(255, 255, 255, 0.2)
        border-radius: 12px
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
        transform-style: preserve-3d
        will-change: transform
    @media (max-width: 768px)
        #nav
            display: none
            flex-direction: column
            margin: 0
            a
                margin: 0.5rem 0
                padding: 0.5rem 1rem
        #mobile-toggle
            display: block
</style>
