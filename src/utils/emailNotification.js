const SibApiV3Sdk = require("@getbrevo/brevo");

async function sendEmailNotification(booking) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
        SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );

    const emailData = {
        sender: {
            name: "Helena Spa",
            email: "aselak30@gmail.com"        // ✅ <-- YOUR EMAIL
        },
        to: [{ email: process.env.ADMIN_EMAIL }],
        subject: "✅ New Booking Received",
        textContent: `
New Booking Details:
Name: ${booking?.name}
Phone: ${booking?.phone}
Service: ${booking?.service}
Date: ${booking?.date}
    `,
    };

    try {
        await apiInstance.sendTransacEmail(emailData);
        console.log("✅ Email notification sent!");
    } catch (error) {
        console.error("❌ Brevo email error:", error.response?.data || error.message);
    }
}

module.exports = { sendEmailNotification };
