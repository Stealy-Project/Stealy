const { Worker } = require('worker_threads');
const colors  = require('gradient-string');
const config  = require('./config.json');
const fs      = require('node:fs');
const WebSocket = require('ws');
const workers = {};
let clients = [];

cross = '<:no:1319225868895260705>',
logs  = '<:plane:1271357981120008275>',
yes   = '<:yes:1202596415273041931>';

global.danger  = config.danger;
global.config  = config;
global.cross   = cross;
global.logs    = logs;
global.yes     = yes;

// Partie Selfbot
[...new Set(config.SenjuUsers)].forEach(token => loadSelfbot(token));
backup(`./backups/configs/config-${Date.now()}.json`)
setInterval(async () => await backup(`./backups/configs/config-${Date.now()}.json`), 1000 * 60 * 10);

// Api
const wss = new WebSocket.Server({ port: config.port });
wss.setMaxListeners(Infinity);

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let data;

        try { data = JSON.parse(message) } 
        catch (err) { return ws.send(JSON.stringify({ error: 'Format JSON invalide' })); }

        if (data.token !== config.password)
            return ws.send(JSON.stringify({ error: 'meow' }));

        switch (data.type) {
            case 'newClient':
                if (!data.payload || !data.payload.client) 
                    return ws.send(JSON.stringify({ error: 'Veuillez entrer un client valide' }));
                
                clients = clients.filter(c => c.user.id !== data.payload.client.user.id)
                clients.push(data.payload.client);
                ws.send(JSON.stringify({ message: 'Nouveau client sauvegardé' }));    
                break;

            case 'close':
                closeThread(data.payload.userId);
                ws.send(JSON.stringify({ message: 'Client éteint' }));
                break;

            case 'connect':
                loadSelfbot(data.payload.token);
                ws.send(JSON.stringify({ message: 'Client connecté à la machine' }));
                break;

            case 'restart':
                closeThread(data.payload.userId, true);
                ws.send(JSON.stringify({ message: 'Client redémarré' }));
                break;

            case 'getAllWorkers':
                ws.send(JSON.stringify({ workers }));
                break;

            case 'getClients':
                ws.send(JSON.stringify({ clients }));
                break;

            case 'sbl':
                ws.send(JSON.stringify({ sbl: require('./db/sbl.json') }))
                break;
                
            case 'ping':
                ws.send(JSON.stringify({ message: "Bienvenue sur le WebSocket de Stealy" }));
                break;

            default:
                ws.send(JSON.stringify({ error: 'Type de commande inconnu' }));
                break;
        }
    });
});

// Functions
function closeThread(token, restart = false) {
    console.log((token.includes('.') ? 'TOKEN: ': 'USERID: ') + token)

    const client = clients.find(c => token.includes(".") ? c.token !== token : c.user.id == token)
    clients = clients.filter(c => c.token !== (client?.token ?? token));
    if (!client?.token && !token.includes('.')) return false;

    config.SenjuUsers = config.SenjuUsers.filter(t => t !== (client?.token ?? token));
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

    const worker = workers[client?.token || token];
    if (worker) {
        worker.terminate();
        delete workers[client?.token || token];
    } 
    
    if (restart) setTimeout(() => loadSelfbot(client?.token || token), 2000);
}


function loadSelfbot(token){
    if (!config.SenjuUsers.includes(token)){
        config.SenjuUsers.push(token);
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    };

    if (workers[token]) return console.log('ca existe deja');

    const worker = new Worker('./structures/Client.js', { workerData: { token } });
    workers[token] = worker;
    worker.on('message', (message) => console.log(colors.cristal(`[${Buffer.from(token.split('.')[0], "base64").toString('utf-8')}] ${typeof message !== "object" ? message : ''}`)));
    worker.on('message', (message) => typeof message == 'object' ? console.log(message) : null);
    worker.on('exit', e => e.code == 0 ? closeThread(token, true) : false);
    worker.on('messageerror', e => console.log(colors.cristal(`[${Buffer.from(token.split('.')[0], "base64").toString('utf-8')}] ${e}`)));
    worker.on('error', errorWorker);

    function errorWorker(error){
        const errors = [ 40002 ];
        if (!errors.includes(error.code)) return console.error(colors.cristal(`[${Buffer.from(token.split('.')[0], "base64").toString('utf-8')}]`), console.log(error))
        else closeThread(token)
    }
}


async function backup(path){
    if (!fs.existsSync(`./backups/configs`)) await fs.promises.mkdir(`./backups/configs`)
    fs.writeFileSync(path, JSON.stringify(config, null, 2))
    return true;
}


async function errorHandler(error) {
    const errors = [ 0, 400, 10062, 10008, 50035, 40032, 50013,4002]
    if (errors.includes(error.code)) return;

    console.error(error)
};

process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);
process.on('warning', () => false);