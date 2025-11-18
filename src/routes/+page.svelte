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
    <title>site@adabit.org ~/home</title>
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

    <p class="separator p-note">professional nerd</p>
    <p class="p-note">sysadmin cosplayer<sup><a href="https://youtube.com/c/JeffGeerling">?</a></sup></p>
    <p class="p-note">FRC 1157 Team Captain 2024-</p>
    <p class="p-note">FRC 2036 Electrical lead 2023-2024</p>
    <p class="p-note p-gender-identity">she/her</p>

    <p class="separator">quick links</p>
    <p>
        <a href="https://github.com/cmdada" rel="me" class="text-rose u-url">GitHub</a>
        -&gt;
        <a href="https://sanctum.geek.nz/why-not-github.html" class="text-muted">Why not GitHub</a>
    </p>
    <p>@ -> <a href="mailto:me@adabit.org?subject=Hello!" class="u-email">me@adabit.org</a></p>

    <p class=separator>
      <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
      <img src="https://img.shields.io/badge/JavaScript-D92E8A?style=for-the-badge&logo=javascript&logoColor=white" />
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
      <img src="https://img.shields.io/badge/CSS3-0084ff?style=for-the-badge&logo=css3&logoColor=white" />
      <img src="https://img.shields.io/badge/C-b084ff?style=for-the-badge&logo=c&logoColor=white" />
      <img src="https://img.shields.io/badge/Svelte-04243f?style=for-the-badge&logo=svelte&logoColor=white" />
    </p>
<hr />
<div id="footer">
    <noscript>
        <div id="nojs">
            <p>JavaScript is currently not enabled or not supported, though this site should still work fine.</p>
            <p>If there are any accessibility issues, please do not hesitate to contact me at siteaccessibility@adabit.org</p>
        </div>
    </noscript>
</div>

    <p class="separator">trans rights are human rights</p>
</div>

<style lang="sass">
    p
        margin: 0
    .separator
        margin-top: 16px

    .u-photo
        border-radius: 50%
        height: 6em
        vertical-align: middle

    .inline-img
        vertical-align: middle
        height: 3rem
</style>
