<script lang="ts">
    import { page } from "$app/stores";
    export let pid: Number;
    function regeneratePID() {pid = Math.round( Math.random() * 1000000 )}

    page.subscribe(regeneratePID)
    regeneratePID()
</script>

<div id="main">
    <h1>
        {$page.status}
    </h1>
    {#if $page.status == 404}
        <p><code>site@adabit.org$ cd {$page.url.pathname}</code></p>
        <p><code>cd: no such file or directory: {$page.url.pathname}</code></p>
        <p><code>site@adabit.org [1]$ </code></p>
    {:else}
        <p><code>site@adabit.org$ cd {$page.url.pathname}</code></p>
        <p><code>site@adabit.org$ /home/ada/adabit.org/show</code></p>
        <pre>Trying to render page...
[1]   {pid}  segmentation fault (core dumped)  show</pre>
        <p><code>site@adabit.org [139]$ coredumpctl debug {pid} -A "--batch -ex bt" -q</code></p>
        <pre>[New LWP 214063]
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/usr/lib/libthread_db.so.1".
Core was generated by `/nix/store/b64...77n-adabit.org/show'.
Program terminated with signal SIGSEGV, Segmentation fault.

Error: {$page.error?.message}
    at ????????
</pre>
        <p><code>site@adabit.org$ </code></p>
    {/if}
</div>

<style lang="sass">
    h1
        margin: 0
        margin-bottom: 0.5rem

    #main
        margin: 0 1rem
</style>
