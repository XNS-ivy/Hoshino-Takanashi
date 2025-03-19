import { makeWASocket, Browsers, useMultiFileAuthState } from "baileys"
import p from "pino"
import NodeCache from "node-cache"
import { configDotenv } from "dotenv"
import chatParse from './handlers/parsingChat.js'
import connectionState from "./handlers/connectionState.js"

configDotenv()

const groupCache = new NodeCache()
const authDirectoryName = process.env.WAAuth
export default async function startBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState(authDirectoryName)
    const sock = makeWASocket({
        auth: state,
        logger: p({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on("connection.update", async (update) => {
        await connectionState(update, sock)
    })
    sock.ev.on('messages.upsert', async (msg) => {
        await chatParse(msg)
    })
}
