<script lang="ts">
    import type { PageData } from "./$types"
</script>

<svelte:head>
    <title>site@adabit.org ~/projects</title>
</svelte:head>

<div class="content">
    <h1>Projects</h1>
    <div class="para">
        <p>I do things sometimes!</p>
    </div>
</div>

<style lang="scss">
    .content {
        max-width: 800px;
        margin: 0 auto;
        padding: 2em;
    }

    h2 {
        color: #ffffff;
        padding-bottom: 0.5em;
    }

    .para {
        margin: 1em auto;
        line-height: 1.6;

        & p {
            margin-top: 0;
            margin-bottom: 1em;
        }

        & ul {
            margin-bottom: 1em;
            padding-left: 1.5em;
        }
    }
</style>
