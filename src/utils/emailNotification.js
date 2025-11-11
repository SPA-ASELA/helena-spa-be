const SibApiV3Sdk = require("@getbrevo/brevo");

async function sendEmailNotification(booking) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
        SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );

    const emailData = {
        sender: { name: "Helena Spa", email: "notifications@brevo.com" },
        to: [{ email: process.env.ADMIN_EMAIL }],
        subject: "✅ New Booking Received",
        textContent: `
New Booking Details:
Name: ${booking?.name || "N/A"}
Phone: ${booking?.phone || "N/A"}
Service: ${booking?.service || "N/A"}
Date: ${booking?.date || "N/A"}
    `
    };

    try {
        await apiInstance.sendTransacEmail(emailData);
        console.log("✅ Email notification sent!");
    } catch (error) {
        console.error("❌ Email Error:", error);
    }
}

module.exports = { sendEmailNotification };
