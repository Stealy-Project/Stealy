const { Client, Message } = require("legend.js")

module.exports = {
    name: "antigroup",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        switch(args[0]){
            default: 
                message.edit(client.language(`<:star:1271065326242496611> __**Stealy - Antigroup**__ <:star:1271065326242496611>
        
                \`${client.db.prefix}antigroup <on/off> [texte]\`
                -# ➜ **Activer ou désactiver l'antigroup**
                \`${client.db.prefix}antigroup silent <on/off>\`
                -# ➜ **Activer ou désactiver l'antigroup silencieux**
                
                \`${client.db.prefix}wl <user_id>\`
                -# ➜ **Ajoute un utilisateur à la whitelist**
                \`${client.db.prefix}unwl <user_id>\`
                -# ➜ **Retire un utilisateur à la whitelist**
                `.replaceAll('  ', ''),
                `<:star:1271065326242496611> __**Stealy - Antigroup**__ <:star:1271065326242496611>
                
                \`${client.db.prefix}antigroup <on/off> [texte]\`
                -# ➜ **Enable or Disable antigroup**
                \`${client.db.prefix}antigroup silent <on/off>\`
                -# ➜ **Enable or Disable silent antigroup**
                
                \`${client.db.prefix}wl <user_id>\`
                -# ➜ **Add a user to the whitelist**
                \`${client.db.prefix}unwl <user_id>\`
                -# ➜ **Remove a user from the whitelist**`.replaceAll('  ', '')))
                break

            case 'wl':
                const user = message.mentions.users.first() || 
                             client.users.get(args[0]) || 
                             await client.fetchUser(args[0]).catch(() => false);

                if (!user || !args[0]) return message.edit(client.language('*Aucun utilisateur trouvé.*', '*No user found.*'));
                if (client.db.antigroup.whitelist.includes(user.id)) 
                    return message.edit(client.language(`*${user} est déjà whitelist.*`, `*${user} is already whitelist.*`));

                client.db.antigroup.whitelist.push(user.id);
                client.save();

                message.edit(client.language(`*${user} a été ajouté à la whitelist de l'anti groupe.*`, `*${user} has been added to the whitelist of the anti group.*`));
                break;

            case 'unwl':
                const user2 = message.mentions.users.first() || 
                             client.users.get(args[0]) || 
                             await client.fetchUser(args[0]).catch(() => false);

                if (!user2 || !args[0]) return message.edit(client.language('*Aucun utilisateur trouvé.*', '*No user found.*'));
                if (!client.db.antigroup.whitelist.includes(user2.id)) 
                    return message.edit(client.language(`*${user2} n'est pas whitelist.*`, `*${user} is not whitelist.*`));

                client.db.antigroup.whitelist = client.db.antigroup.whitelist.filter(r => r !== user.id);
                client.save();

                message.edit(client.language(`*${user} a été retiré de la whitelist de l'anti groupe.*`, `*${user} has been removed from the whitelist of the anti group.*`));
                break;
            case "silent":
                if (args[1] === "on"){
                    client.db.antigroup.silent = true;
                    client.save()
                    message.edit(client.language("*Tu vas quitter le groupe sans envoyer de signal.*", "*You're gonna leave the group without sending any message.*"))
                }
                if (args[1] === "off"){
                    client.db.antigroup.silent = false;
                    client.save()
                    message.edit(client.language("*Tu ne quitteras pas le groupe discrètement.*", "*You're gonna leave the group and sending the discord message.*"))
                }
                break

            case "on":
                client.db.antigroup.status = true;
                client.db.antigroup.textes = args[1] ? args.slice(1).join(' ') : null;

                client.save();
                message.edit(client.language(`*L'anti groupes a été activé${args[1] ? " avec un texte donné" : ""}.*`, `The anti groups has been activated${args[1] ? " with text" : ""}.*`))        
                break

            case "off":
                client.db.antigroup.status = false;
                client.save();
                message.edit(client.language("*L'anti groupes a été désactivé.*", "*The anti groups has been desactivated.*"))
                break
        }
    }
}