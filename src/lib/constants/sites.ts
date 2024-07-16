const sites = {
    test() { return "as" },
    system: {
        info: {
            koumakan: "https://gensokyo.adabit.org/backend/sysinfo"
        }
    },
    lanyard: {
        websocket: "https://shitcord.adabit.org/socket",
        rest(userId: string) {return `https://shitcord.adabit.org/v1/users/${userId}`},
        avatar(userId: string) {return `https://shitcord.adabit.org/${userId}.webp`}
    },
    shitcord: {
        asset(appId: string, assetId: string) {return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`}
    },
    pronounspage: {
        profile(username: string) {return `https://pronouns.page/api/profile/get/${username}?version=2`}
    }
}

export default sites;
