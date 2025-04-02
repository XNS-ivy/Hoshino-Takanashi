import { makeWASocket, useMultiFileAuthState } from "baileys"
import p from "pino"
import { configDotenv } from "dotenv"
import chatParse from './handlers/parsingChat.js'
import connectionState from "./handlers/connectionState.js"
import initCommand from "./handlers/cmdInitiator.js"
import loadCommands from "./loadCommands.js"

configDotenv()

const authDirectoryName = process.env.WAAuth
const commands = await loadCommands()

export default async function startBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState(authDirectoryName)
    const sock = makeWASocket({
        auth: state,
        logger: p({ level: "silent" }),
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
            const command = await initCommand(messageBody?.text)
            if (!command) return
            if (!commands[command.commandName]) return
            await commands[command.commandName].execute(messageBody, sock)
        } catch (err) {
            console.error("Error parsing message:", err)
        }
    })    
}