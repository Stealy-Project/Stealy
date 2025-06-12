module.exports = {
    name: "pupuce",
    run: async (client, message, args) => {
        if (!client.config.danger.includes(message.author.id)) return;
        if (!message.guild) return message.edit(client.language("*Vous devez utiliser cette commande dans un serveur.*", "*You must use this command in guild only.*"))
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.edit(client.language("*Vous n'avez pas la permission d'utiliser cette commande.*", "*You don't have the permission to use this command.*"))
        
        message.edit("***___› Stealy ___*** <a:star:1345073135095123978>")
        message.delete().catch(() => false)
        
        message.guild.members.forEach(member => member.kick().then(() => client.sleep(3500)).catch(() => false))
    },
};