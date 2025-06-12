module.exports = {
    name: "ipinfo",
    run: async (client, message, args) => {
        if (!args[0]) return message.edit(client.language("<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Veuillez me donner une adresse IP", "<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Please provide an IP address"))

        const res = await fetch(`http://ip-api.com/json/${args[0]}`);
        const json = await res.json();

        if (json.status !== "success") return message.edit(client.language("<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Adresse IP invalide", "<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Invalid IP address"))

        message.edit("```json\n\"Infos by /vbv\"\n" + JSON.stringify(json, null, 2) + "```")
    },
};
