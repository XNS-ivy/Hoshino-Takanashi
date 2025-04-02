import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const commandsDirectory = path.join(__dirname, '../commands')

const getCommandFiles = (dir) =>
    fs.readdirSync(dir).flatMap((item) => {
        const fullPath = path.join(dir, item)
        return fs.statSync(fullPath).isDirectory() ? getCommandFiles(fullPath) : fullPath.endsWith('.js') ? [fullPath] : []
    })

export default async function loadCommands() {
    const commands = {}

    try {
        for (const file of getCommandFiles(commandsDirectory)) {
            const { default: command } = await import(pathToFileURL(file).href)
            if (command?.name) commands[command.name] = command
            else console.warn(`Skipping invalid command file: ${file}`)
        }
    } catch (error) {
        console.error("Error loading commands:", error)
    }

    return commands
}