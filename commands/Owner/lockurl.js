module.exports = {
    name: "lockurl",
    run: async (client, message, args) => {        
        //if (!client.config.owners.includes(message.author.id)) return;

        if (args[0] === "list") return message.channel.send(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Liste des URLs locks :\n${client.db.lockurl.length === 0 ? "Aucune URL vérouillé pour l'instant" : client.db.lockurl.map(entry => `***Nom***: \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\` ***ID***:  ${entry.guildID} ***Code***: ${entry.vanityURL}`).join('\n')}`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Locked URLs list :\n${client.db.lockurl.length === 0 ? "No URL sniped right now." : client.db.lockurl.map(entry => `***Name***: \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\` ***ID***:  ${entry.guildID} ***Code***: ${entry.vanityURL}`).join('\n')}`));
        if (args[0] === "stop"){
            const guild = client.guilds.get(args[1]) || message.guild
            if (!client.db.lockurl.find(c => c.guildID === guild.id)) return message.edit(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Aucun serveur de lock de trouvé`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> No guild found in the lock url`));
        
            client.db.lockurl = client.db.lockurl.filter(c => c.guildID !== args[1])
            client.save()
            return message.edit(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> L'url a été dévérouillé`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> The url has been unlocked`));
        }
        if (args[0] === "clear"){
            client.db.lockurl = []
            client.save()
            return message.edit(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Les serveurs ont été dévérouillés`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Every servers has been deleted`));
        }

        const guild = client.guilds.get(args[0]) || message.guild
        if (!guild) return message.edit(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Vous devez faire la commande sur un serveur`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> You need to send this command on a guild where you put the new URL`));
        if (!guild.vanityURLCode) return message.edit(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Ce serveur n'a pas de URL de vanity.`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> This guild doesn't have a vanity URL`));
                              
        client.db.lockurl = client.db.lockurl.filter(c => c.guildID !== message.guild.id)
        client.db.lockurl.push({
            vanityURL: guild.vanityURLCode,
            guildID: message.guild.id
        })

        client.save();
        message.edit(client.language(`<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> \`${message.guild.name}\` est maintenant vérouillé`, `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Support : *[Discord](<https://discord.gg/vbv>)\n> \`${guild.vanityURLCode}\` is now locked`));
    }
};