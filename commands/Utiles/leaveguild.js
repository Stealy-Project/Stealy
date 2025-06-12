module.exports = {
    name: "leaveguild",
    run: async (client, message, args) => {
        const guild = client.guilds.get(args[0]) || message.guild
        if (!guild) return message.edit(client.language(`*Aucun serveur de trouvé pour \`${args[0] || "rien"}\`*`, `*No guild found for \`${args[0] || "rien"}\`*`))
        if (guild.ownerId === client.user.id) return message.edit(client.language('*Vous ne pouvez pas quitter votre serveur.*', '*Vous ne pouvez pas quitter votre serveur.*'))

        await message.delete().catch(() => false)
        guild.leave().catch(() => false)
    }
}