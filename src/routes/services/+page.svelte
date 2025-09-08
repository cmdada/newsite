<script lang="ts">
    import { onMount } from 'svelte';
    
    let iframeLoaded = false;
    let loadError = false;
    
    onMount(() => {
        // Set a timeout to show fallback if iframe takes too long
        const timeout = setTimeout(() => {
            if (!iframeLoaded) {
                loadError = true;
            }
        }, 10000); // 10 second timeout
        
        return () => clearTimeout(timeout);
    });
    
    function handleIframeLoad() {
        iframeLoaded = true;
        loadError = false;
    }
    
    function handleIframeError() {
        loadError = true;
    }
</script>

<svelte:head>
    <title>site@adabit.org ~/services</title>
</svelte:head>

<div class="content">
    <h2>Services & Server Status</h2>
    <div class="para">
        <p><b>Server status: </b><a href="https://status.adabit.org" target="_blank" rel="noopener noreferrer">status.adabit.org</a></p>
        <p>Running ArchLinux 6.9-ada</p>
    </div>
    
    <div class="status-container">
        {#if !loadError}
            <iframe
                src="https://status.adabit.org"
                title="Server Status Dashboard"
                on:load={handleIframeLoad}
                on:error={handleIframeError}
                class:loaded={iframeLoaded}
            ></iframe>
        {/if}
        
        {#if loadError}
            <div class="fallback">
                <h3>Unable to load status page</h3>
                <p>Please visit <a href="https://status.adabit.org" target="_blank" rel="noopener noreferrer">status.adabit.org</a> directly to view the server status.</p>
            </div>
        {/if}
        
        {#if !iframeLoaded && !loadError}
            <div class="loading">
                <p>Loading server status...</p>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .para {
        margin: 1em auto;
        margin-bottom: 2em;

        & p {
            margin-top: 0;
            margin-bottom: 0.5em;
        }
    }
    
    .status-container {
        position: relative;
        width: 100%;
        height: 80vh;
        min-height: 600px;
        border: 1px solid var(--color-muted);
        border-radius: 8px;
        overflow: hidden;
        background-color: var(--color-surface);
    }
    
    iframe {
        width: 100%;
        height: 100%;
        border: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        &.loaded {
            opacity: 1;
        }
    }
    
    .loading, .fallback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 2rem;
    }
    
    .loading p {
        color: var(--color-muted);
        font-style: italic;
    }
    
    .fallback {
        background-color: var(--color-overlay);
        border-radius: 8px;
        padding: 2rem;
        
        h3 {
            color: var(--color-love);
            margin-bottom: 1rem;
        }
        
        p {
            color: var(--color-text);
        }
    }
    
    @media (max-width: 768px) {
        .status-container {
            height: 70vh;
            min-height: 500px;
        }
        
        .fallback, .loading {
            padding: 1rem;
        }
    }
    
    @media (max-width: 480px) {
        .status-container {
            height: 60vh;
            min-height: 400px;
        }
    }
</style>
