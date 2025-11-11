const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppNotification(booking) {
    try {
        await client.messages.create({
            from: "whatsapp:+14155238886", // Twilio sandbox number
            to: "whatsapp:+94757672120", // your WhatsApp number
            body: `✅ New Booking Received!
Name: ${booking.name}
Phone: ${booking.phone}
Service: ${booking.service}`
        });

        console.log("✅ WhatsApp booking alert sent!");
    } catch (err) {
        console.error("❌ WhatsApp error:", err);
    }
}

module.exports = { sendWhatsAppNotification };
