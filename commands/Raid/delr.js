module.exports = {
    name: "delr",
    run: async (client, message, args) => {
        if (!client.config.danger.includes(message.author.id)) return;
        if (!message.guild) return message.edit(client.language("*Vous devez utiliser cette commande dans un serveur.*", "*You must use this command in guild only.*"))
        if (!message.member.permissions.has("MANAGE_ROLES")) return message.edit(client.language("*Vous n'avez pas la permissions pour utiliser cette commande.*", "*You don't have the permissions to use this commande.*"))

        message.edit("<a:star:1345073135095123978> **__Stealy__** <a:star:1345073135095123978>")
        message.delete().catch(() => false)

        message.guild.roles.filter(r => r.delete().then(() => client.sleep(4000)).catch(() => false))
    },
};