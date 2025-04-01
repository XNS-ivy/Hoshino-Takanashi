import { makeWASocket, useMultiFileAuthState } from "baileys"
import p from "pino"
import { configDotenv } from "dotenv"
import chatParse from './handlers/parsingChat.js'
import connectionState from "./handlers/connectionState.js"
import initCommand from "./handlers/cmdInitiator.js"

configDotenv()

const authDirectoryName = process.env.WAAuth

export default async function startBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState(authDirectoryName)
    const sock = makeWASocket({
        auth: state,
        logger: p({ level: "info" }),
        browser: ["Hoshino", "1.0.0", "Linux"],
        syncDisplayName: true,
        shouldSyncHistoryMessage: false,
        emitOwnEvents: false,
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: true,
    })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on("connection.update", update => connectionState(update, sock))
    sock.ev.on('messages.upsert', async msg => {
        try {
            var messageBody = await chatParse(msg)
            await initCommand(messageBody?.text).then(command => {
                if (command == false) return
                else {
                    console.log(command)
                }
            })
        } catch (err) {
            console.error("Error parsing message:", err)
        }
    })
}