export default async function chatParse(msg = Object) {
    if (!msg.messages) return

    const parse = msg.messages
        .map(m => {
            const message = m.message || {};
            const msgKeys = Object.keys(message).filter(key =>
                key !== "messageContextInfo" &&
                key !== "senderKeyDistributionMessage" &&
                key !== "protocolMessage"
            )

            if (msgKeys.length === 0) return null
            const msgType = msgKeys[0]
            const validMessage = message[msgType]
            const mediaMessage = message.imageMessage || message.videoMessage || message.documentMessage || null
            const caption = mediaMessage?.caption || ""

            const textContent = msgType === "conversation" 
                ? validMessage 
                : validMessage?.text || caption || ""

            return {
                key: m.key,
                messageTimestamp: m.messageTimestamp,
                pushName: m.pushName,
                broadcast: m.broadcast,
                type: msgType,
                text: textContent,
                contextInfo: validMessage?.contextInfo || mediaMessage?.contextInfo || null
            };
        })
        .filter(m => m !== null)
        .flat()

    if (parse.length > 0) {
        console.log(parse)
    }
}