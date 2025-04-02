
export default async function sendTextMessage(message = {}, text = '', sock = {}) {
    sock.sendMessage(message.remoteJid, { text: text }, { quoted: message.rawMessageObject, ephemeralExpiration: message.dissapearChat })
}