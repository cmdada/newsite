<script lang="ts">
    import type { PageData } from "./$types"
</script>

<svelte:head>
    <title>site@adabit.org ~/commissions</title>
</svelte:head>

<div class="content">
    <h1>Commissions</h1>
    <div class="para">
        <p>My commissions are open! 🎨</p>

        <p>Interested? Contact me for pricing, examples, and availability either by <a href="mailto:art@adabit.org">email</a> or <a href="https://instagram.com/cmdada_art">@cmdada_art</a> on Instagram.</p>

        <h2>Art</h2>

        <p>Looking for unique, personalized pixel art? I specialize in:</p>
        <ul>
            <li>Human character designs</li>
            <li>Fantasy backgrounds</li>
            <li>Logos and Icons</li>
        </ul>

        <h2>Websites</h2>
		<p>I have experience with full-stack website development using html5, css, js, ts, svelte, vue, vite, and sql, and can host your site and manage your dns for you, or just provide you code, design,  and support</p>
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
