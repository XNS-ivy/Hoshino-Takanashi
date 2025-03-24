export default async function chatParse(msg = {}) {
    if (!Array.isArray(msg.messages) || msg.messages.length === 0) return null

    let result = null

    for (const m of msg.messages) {
        const message = m.message || {}
        const msgKeys = Object.keys(message).filter(key =>
            !["messageContextInfo", "senderKeyDistributionMessage", "protocolMessage"].includes(key)
        )

        if (msgKeys.length === 0) continue

        const msgType = msgKeys[0]
        const validMessage = message[msgType]
        const mediaMessage = message.imageMessage || message.videoMessage || message.documentMessage || null
        const caption = mediaMessage?.caption || ""

        const textContent = msgType === "conversation"
            ? validMessage
            : validMessage?.text || caption || ""

        const contextInfo = validMessage?.contextInfo || mediaMessage?.contextInfo || null
        const quoted = contextInfo?.quotedMessage || null
        let quotedData = null

        if (quoted) {
            const quotedKeys = Object.keys(quoted)
            const quotedType = quotedKeys.length > 0 ? quotedKeys[0] : null
            const quotedContent = quoted[quotedType] || {}

            quotedData = {
                id: contextInfo?.stanzaId || null,
                remoteJid: m.key.remoteJid || null,
                participant: contextInfo?.participant || null,
                pushName: m.pushName || null,
                text: quotedType === "conversation"
                    ? quotedContent
                    : quotedContent?.text || quotedContent?.caption || "",
                type: quotedType || null
            }
        }

        result = {
            id: m.key.id,
            remoteJid: m.key.remoteJid,
            participant: m.key.participant,
            pushName: m.pushName,
            text: textContent,
            type: msgType,
            dissapearChat: contextInfo?.expiration || 0,
            quotedMessage: quotedData,
            rawMessageObject: m
        }
    }

    return result
}