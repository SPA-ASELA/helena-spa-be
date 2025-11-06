const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBookingNotification() {
    try {
        await resend.emails.send({
            from: 'Helena Spa <noreply@helenaspa.lk>',
            to: 'aselak30@gmail.com',
            subject: 'New Booking Received',
            text: 'A new booking has been created on your Helena Spa website.'
        });

        console.log("✅ Resend email sent");
    } catch (error) {
        console.error("❌ Resend email error:", error);
    }
}

module.exports = { sendBookingNotification };
