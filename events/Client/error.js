module.exports = {
    name: "error",
    run: async (error, client) => {
        if (error.code == 40002)
            return client.stealy.send(JSON.stringify({
                type: "close",
                token: client.config.password,
                payload: { userId: client.user.id }
            }));
    }
}