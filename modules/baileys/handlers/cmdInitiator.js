import { configDotenv } from "dotenv"

configDotenv()
const prefix = process.env.prefix

export default async function initCommand(msg = '') {
    const args = msg?.trim().split(/\s+/)
    const commandName = args.shift()
    const isHitCommand = commandName?.startsWith(prefix)

    if (isHitCommand) {
        return {
            commandName: commandName.slice(prefix.length),
            subCommand: args[0] || null,
            arguments: args.slice(1),
        }
    } else {
        return false
    }
}