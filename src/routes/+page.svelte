<script lang="ts">
    // export let data;
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import duration from "dayjs/plugin/duration";
    dayjs.extend(relativeTime)
    dayjs.extend(duration)

    const birthday = dayjs("2008-03-11T00:00:00+08:00");
    const birthdayThisYear = birthday.year(dayjs().year())
    export let now = dayjs();
    export let age = now.diff(birthday, "years", true)
    export let daysLeft = dayjs.duration(now.diff(birthdayThisYear))
    export const fumo = ["cheers.webp", "lamp.jpg"][Math.floor(Math.random() * 2)]

    setInterval(() => {
        now = dayjs();
        age = now.diff(birthday, "years", true)
        daysLeft = dayjs.duration(now.diff(birthdayThisYear))
    }, 550);
</script>

<svelte:head>
    <title>site@adabit.org ~/Home</title>
</svelte:head>

<div class="content h-card">
    <p class="separator">
        <p>
            <img
                class="u-photo"
                src="https://avatars.githubusercontent.com/u/79297197?v=4"
                alt="my pfp"
            />
        </p>
        <span class="p-name text-gold">cmdada</span>
        <span class="p-name text-love">ada t</span>
        <span class="p-name text-iris">glowink</span>

    
    <a style="display: none" class="u-url u-uid" href="https://adabit.org">adabit.org</a>
    <!-- least cursed leap year detection -->
    <p>{String((Math.round(age * 10000000) / 10000000)).padEnd(10, "0")} years old</p>
    {#if daysLeft.asDays() >= -31 && daysLeft.asSeconds() < 0}
        <p>can you believe it folks‽ birthday! just {(daysLeft).humanize()} away‼</p>
    {/if}

    <p class="separator p-note">professional nerd</p>
    <p class="p-note">sysadmin cosplayer<sup><a href="https://youtube.com/c/JeffGeerling">?</a></sup></p>
    <p class="p-note">big 2036 (frc) fan</p>
    <p class="p-note p-gender-identity">she/her</p>

    <p class="separator">quick links</p>
    <p>
        <a href="https://github.com/cmdada" rel="me" class="text-rose u-url">GitHub</a>
        -&gt;
        <a href="https://sanctum.geek.nz/why-not-github.html" class="text-muted">Why not GitHub</a>
    </p>
    <p>@ -> <a href="mailto:me@adabit.org?subject=Hello!" class="u-email">me@adabit.org</a></p>

    <p class="separator">trans rights are human rights</p>
</div>

<style lang="sass">
    p
        margin: 0
    .separator
        margin-top: 16px

    .u-photo
        border-radius: 50%
        height: 2em
        vertical-align: middle

    .inline-img
        vertical-align: middle
        height: 3rem
</style>
