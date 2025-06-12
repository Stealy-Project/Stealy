module.exports = {
    name: "platform",
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]);
        if (user === client.user) return message.edit(client.language("Vous ne pouvez pas voir vos propres platformes.", "You cannot see your own platform."));        
        if (!user) return message.edit(client.language("Veuillez mentionner un utilisateur valide.", "Please mention a valid user."));

        const statusObj = (user.presence || (user.presences?.values() ? [...user.presences.values()][0] : null))?.clientStatus;

        if (!statusObj || !Object.keys(statusObj).length)
            return message.edit(client.language("*Cet utilisateur n'a pas de platform.*", "*This user has no platform.*"));
 
        
        const emojis = {
            "desktop:idle": "<:idle_desktop:1361494858379821136>",
            "desktop:dnd": "<:online_desktop:1361494912373100805>",
            "desktop:online": "<:dnd_desktop:1361494888620884129>",
            "web:idle": "<:status_web_idle:1361495248924180511>",
            "web:dnd": "<:status_web_dnd:1361495282826739782>",
            "web:online": "<:status_web_online:1361495265999192156>",
            "embedded:idle": "<:embedded_idle:1361498033400975380>",
            "embedded:dnd": "<:embedded_dnd:1361498005131497482>",
            "embedded:online": "<:embedded_online:1361498048856985784>",
            "mobile:idle": "<:idle_mobile:1361695581579378748>",
            "mobile:dnd": "<:dnd_mobile:1361695552454131954>",
            "mobile:online": "<:online_mobile:1361695628505251931>"
        };
        
        const platformNames = {
            "desktop": "Pc",
            "mobile": client.language("Mobile", "Phone"),
            "embedded": "Console",
            "web": client.language("Navigateur", "Web")
        };
        
        message.edit(client.language(`**${user.username}** est connecté sur les platformes :\n\n${
            Object.entries(statusObj)
                .map(([platform, status]) => `${emojis[`${platform}:${status}`] || status} - \`${platformNames[platform] || platform}\``)
                .join('\n')
        }`, `**${user.username}** is connected to the platforms :\n\n${
            Object.entries(statusObj)
                .map(([platform, status]) => `${emojis[`${platform}:${status}`] || status} - \`${platformNames[platform] || platform}\``)
                .join('\n')
        }`));
    }
};