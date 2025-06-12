module.exports = {
    name: "restart",
    run: async (client, message, args) => {
        await message.edit(client.language(`*Redémarrage terminé <t:${Math.round((Date.now() + 30000) / 1000)}:R>.*`, `*Restart finish ${Math.round((Date.now() + 30000) / 1000)}.*`))
        
        client.stealy.send(JSON.stringify({
            type: "restart",
            token: client.config.password,
            payload: { userId: user.id }
        }));
    }
}