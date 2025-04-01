import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const commandsDirectory = path.join(__dirname, 'commands')

export default async function loadCommands() {
    const commandFiles = fs.readdirSync(commandsDirectory).filter(file => file.endsWith('.js'))
    const commands = {}

    for (const file of commandFiles) {
        const command = await import(path.join(commandsDirectory, file))
        const commandName = file.replace('.js', '')
        commands[commandName] = command.default
    }

    console.log(commands)
}