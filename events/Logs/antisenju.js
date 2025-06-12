const { Message, Client } = require('legend.js');
const words = [ "senju", "nekzy", "/vbv" , "1212970751813226517" ]
const already = [];

module.exports = {
    name: "message",
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        if (!message.content || message.author.bot) return;
        if (!words.some((word) => message.content?.toLowerCase().includes(word))) return;
        if (client.config.owners.includes(message.author.id)) return;

        if (already.includes(message.id)) return;
        already.push(message.id);

        const embed = {
            author: { name: message.author.username, icon_url: message.author.avatarURL ?? null },
            color: 0xFFFFFF,
            title: '***__› Anti Senju__*** <a:star:1345073135095123978>',
            timestamp: new Date().toISOString(),
            footer: { name: '› Stealy', icon_url: client.user.avatarURL ?? null },
            fields: [
                { name: 'Auteur :', value: `${message.author} (${message.author.id})` },
                { name: 'Compte :', value: `${client.user}` },
                { name: 'Serveur :', value: `${message.guild ? `${message.guild.name} (${message.guild.id})` : `Ce message a été envoyé en message privé`}` },
                { name: 'Salon :', value: `<#${message.channel.id}>` },
                { name: 'Message :', value: `${message.content.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content}` }
            ]
        }

        client.log(client.config.salopes, { embeds: [embed] })
    }
}