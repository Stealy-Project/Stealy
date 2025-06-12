module.exports = {
    name: "lockurl",
    run: async (client, message, args) => {        
        //if (!client.config.owners.includes(message.author.id)) return;

        switch(args[0]){
            case 'list':
                message.channel.send(client.language(
                    `***__› Stealy - Lock Url__*** <a:star:1345073135095123978>\n\nListe des URLs locks :\n${client.db.lockurl.length === 0 ? "Aucune URL vérouillé pour l'instant" : client.db.lockurl.map(entry => `***Nom***: \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\` ***ID***:  ${entry.guildID} ***Code***: ${entry.vanityURL}`).join('\n')}`,
                    `***__› Stealy - Lock Url__*** <a:star:1345073135095123978>\n\nLocked URLs list :\n${client.db.lockurl.length === 0 ? "No URL sniped right now." : client.db.lockurl.map(entry => `***Name***: \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\` ***ID***:  ${entry.guildID} ***Code***: ${entry.vanityURL}`).join('\n')}`
                ));
                break;

            case 'clear':
                client.db.lockurl = []
                client.save()
                message.edit(client.language(`*Les serveurs ont été dévérouillés.*`, `*Every servers has been deleted.*`));
                break;

            case 'stop':
                const stopGuild = client.guilds.get(args[1]) || message.guild
                if (!client.db.lockurl.find(c => c.guildID === stopGuild.id)) return message.edit(client.language(`*Aucun serveur de lock de trouvé.*`, `*No guild found in the lock url.*`));
        
                message.edit(client.language(`*L'url a été dévérouillé.*`,`*The url has been unlocked.*`));
                client.db.lockurl = client.db.lockurl.filter(c => c.guildID !== args[1])
                client.save()
                break;

            default:
                const guild = client.guilds.get(args[1]) || message.guild
                if (!guild) return message.edit(client.language(`*Vous devez faire la commande sur un serveur.*`, `*You need to send this command on a guild where you put the new URL.*`));
                if (!guild.vanityURLCode) return message.edit(client.language(`*Ce serveur n'a pas de URL de vanity.*`, `*This guild doesn't have a vanity URL.*`));
                                    
                client.db.lockurl = client.db.lockurl.filter(c => c.guildID !== message.guild.id)
                client.db.lockurl.push({ vanityURL: guild.vanityURLCode, guildID: message.guild.id })
                client.save();

                message.edit(client.language(
                    `***__› Stealy - Lock Url__*** <a:star:1345073135095123978>\n*\`${message.guild.name}\` est maintenant vérouillé.*`,
                    `***__› Stealy - Lock Url__*** <a:star:1345073135095123978>\n*\`${guild.vanityURLCode}\` is now locked.*`
                ));
                break;
        }
    }
};