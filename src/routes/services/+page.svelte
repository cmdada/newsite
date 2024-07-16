<script lang="ts">
    import type { PageData } from "./$types"
    // import sites from "$lib/constants/sites";

    export let serviceList;
    export let data: PageData;
</script>

<svelte:head>
    <title>site@adabit.org ~/Services</title>
</svelte:head>

<div class="content">
    <h2>Services</h2>
    <div class="para">
        <p><b>Service status: </b><a href="//status.adabit.org">status.adabit.org</a></p>
        <p>Running {data.xnix} {data.kernel}</p>
    </div>
    <div class="service-list" bind:this={serviceList}>
        {#each data.services as service}
            {service}
            <!--
                component, showing
                <Service {service} />
            -->
        {/each}
    </div>
</div>

<style lang="scss">
    .para {
        margin: 1em auto;

        & p {
            margin-top: 0;
            margin-bottom: 0;
        }
    }
</style>
