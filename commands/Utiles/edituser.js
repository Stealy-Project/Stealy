module.exports = {
    name: "hypesquad",
    run: async (client, message, args) => {
        if (!args[0]) return message.edit(client.language(`*Commande invalide veuillez recommencer \`${client.db.prefix}hypesquad [ clear / balance / brillance / bravery ]\`*`,`*Invalid Command please try again \`${client.db.prefix}hypesquad [ clear / balance / brillance / bravery ]\`*`))

        switch (args[0]) {
            case "clear":
                client.user.removeHypesquadHouse()
                    .then(() => message.edit(client.language(`*Votre hypesquad a été supprimée.*`, `*Your hypesquad has been deleted.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être supprimée.*`, `*Your hypesquad cannot be deleted.*`)))
                break;
            case "bravery":
                client.user.setHypesquadHouse('bravery')
                    .then(() => message.edit(client.language(`*Votre hypesquad a été modifiée.*`, `*Your hypesquad has been edited.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être modifiée.*`, `*Your hypesquad cannot be edited.*`)))
                break;
            case "brillance":
                client.user.setHypesquadHouse('brillance')
                    .then(() => message.edit(client.language(`*Votre hypesquad a été modifiée.*`, `*Your hypesquad has been edited.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être modifiée.*`, `*Your hypesquad cannot be edited.*`)))
                break;
            case "balance":
                client.user.setHypesquadHouse('balance')
                    .then(() => message.edit(client.language(`*Votre hypesquad a été modifiée.*`, `*Your hypesquad has been edited.*`)))
                    .catch(() => message.edit(client.language(`*Votre hypesquad ne peut pas être modifiée.*`, `*Your hypesquad cannot be edited.*`)))
                break;
        }
    }
}