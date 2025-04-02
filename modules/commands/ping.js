import { configDotenv } from "dotenv"
import os from 'os'
import ping from 'ping'
import sendTextMessage from "../baileys/handlers/messageSender.js"

configDotenv()

export default {
    name: "ping",
    execute: async (msg, sock) => {
        const platform = os.platform()
        const arch = os.arch()
        const osType = os.type()
        const osRelease = os.release()

        const freeMemory = os.freemem() / 1024 / 1024
        const totalMemory = os.totalmem() / 1024 / 1024
        const cpus = os.cpus().length
        const hostname = os.hostname()

        try {
            const pingResult = await ping.promise.probe('google.com')
            const pingTime = pingResult.time
            const text = `OS: ${osType} ${osRelease}\nArch: ${arch}\nCPU Cores: ${cpus}\nFree Memory: ${freeMemory.toFixed(2)} MB\nTotal Memory: ${totalMemory.toFixed(2)} MB\nHostname: ${hostname}\nServer Delay: ${pingTime ? `${pingTime} ms` : 'Failed'}`
            await sendTextMessage(msg, text, sock)
        } catch (error) {
            console.error("Ping error:", error)
            const text = `Server Error.`
            await sendTextMessage(msg, text, sock)
        }
    }
}