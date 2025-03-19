import QRCode from "qrcode"
import { DisconnectReason } from "baileys"
import startBaileys from "../socket.js"

export default async function connectionState(update = Object, sock = Object) {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
        console.log(await QRCode.toString(qr, { type: "terminal", small: true }))
    }

    if (
        connection === "close" &&
        lastDisconnect?.error?.output?.statusCode === DisconnectReason.restartRequired
    ) {
        startBaileys()
    }
    if (connection === "open") {
        console.log(
            "Connected with: ", sock.user.name,
            "\nPhone number: ", sock.user.id.split(':')[0],)
    }
}