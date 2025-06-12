const { Guild, Client } = require("legend.js");
const { performance } = require("perf_hooks");
const { pendingVanityRequests, responseCallbacks, snipeStats } = require("../../structures/Sniper");

module.exports = {
    name: "guildUpdate",
    /**
     * @param {Guild} oldGuild
     * @param {Guild} newGuild
     * @param {Client} client
     */
    run: async (oldGuild, newGuild, client) => {
        const entry = client.db.snipeurl.find(e => newGuild.id === e.guildID);
        if (!entry || newGuild.vanityURLCode === entry.vanityURL) return;

        try {
            const requestId = `${newGuild.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const startTime = performance.now();

            pendingVanityRequests.set(requestId, {
                startTime,
                guildId: newGuild.id,
                guildName: newGuild.name,
                vanityCode: entry.vanityURL,
                timestamp: Date.now()
            });

            console.log(`🚀 Tentative de snipe vanity "${entry.vanityURL}" pour ${newGuild.name}...`);

            responseCallbacks.set(requestId, async (response) => {
                const endTime = performance.now();
                const duration = (endTime - startTime).toFixed(2);
                const statusLine = response.split("\r\n")[0];
                const isSuccess = statusLine.includes("HTTP/1.1 200") || statusLine.includes("HTTP/1.1 204");

                if (isSuccess) {
                    console.log(`✅ VANITY "${entry.vanityURL}" SNIPÉ en ${duration}ms`);
                } else {
                    console.log(`❌ ECHEC VANITY (${entry.vanityURL}) - ${statusLine} - ${duration}ms`);
                }

                snipeStats.total++;
                if (isSuccess) snipeStats.success++;
                else snipeStats.failed++;
                snipeStats.times.push(parseFloat(duration));
                if (snipeStats.times.length > 100) snipeStats.times.shift();
                snipeStats.bestTime = Math.min(snipeStats.bestTime, parseFloat(duration));
                snipeStats.worstTime = Math.max(snipeStats.worstTime, parseFloat(duration));
                snipeStats.lastSnipe = {
                    time: duration,
                    success: isSuccess,
                    vanity: entry.vanityURL,
                    guild: newGuild.name,
                    timestamp: Date.now()
                };

                await client.log(entry.webhookURL, {
                    embeds: [{
                        color: isSuccess ? 0x00ff00 : 0xff0000,
                        description: isSuccess
                            ? `***${client.language(`L'URL \`${entry.vanityURL}\` vous appartient`, `The URL \`${entry.vanityURL}\` is now yours`)}***`
                            : `**Tentative échouée de snipe \`${entry.vanityURL}\`**`,
                    }],
                    content: `${client.user}`,
                });

                if (isSuccess) {
                    client.db.snipecount++;
                    client.db.snipeurl = client.db.snipeurl.filter(o => o.guildID !== newGuild.id);
                    client.save();
                }

                pendingVanityRequests.delete(requestId);
                responseCallbacks.delete(requestId);
            });

            const payload = JSON.stringify({ code: entry.vanityURL });
            const request =
                `PATCH /api/v9/guilds/${newGuild.id}/vanity-url HTTP/1.1\r\n` +
                `Host: canary.discord.com\r\n` +
                `Accept: */*\r\n` +
                `X-Request-ID: ${requestId}\r\n` +
                `X-Super-Properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImhhc19jbGllbnRfbW9kcyI6ZmFsc2UsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEzMy4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEzMy4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTMzLjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==\r\n` +
                `X-Discord-Locale: en-US\r\n` +
                `X-Discord-Timezone: America/New_York\r\n` +
                `X-Debug-Options: bugReporterEnabled\r\n` +
                `Sec-Fetch-Dest: empty\r\n` +
                `Sec-Fetch-Mode: cors\r\n` +
                `Sec-Fetch-Site: same-origin\r\n` +
                `Sec-GPC: 1\r\n` +
                `Content-Type: application/json\r\n` +
                `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0\r\n` +
                `Authorization: ${client.token}\r\n` +
                `X-Discord-MFA-Authorization: ${client.mfaToken}\r\n` +
                `Content-Length: ${payload.length}\r\n` +
                `\r\n${payload}`;

            if (client.socket) {
                client.socket.write(request);
            } else {
                console.log("❌ Aucune socket active pour l'envoi.");
                pendingVanityRequests.delete(requestId);
                responseCallbacks.delete(requestId);
                return;
            }

            setTimeout(() => {
                if (pendingVanityRequests.has(requestId)) {
                    console.log(`⏰ Timeout pour snipe "${entry.vanityURL}" (${newGuild.name})`);
                    pendingVanityRequests.delete(requestId);
                    responseCallbacks.delete(requestId);
                    snipeStats.total++;
                    snipeStats.failed++;
                }
            }, 10000);

        } catch (e) {
            console.error("❌ Erreur dans guildUpdate:", e);
        }
    },
};
