const SibApiV3Sdk = require("@getbrevo/brevo");

async function sendEmailNotification(booking) {
    // Validate environment variables
    if (!process.env.BREVO_API_KEY) {
        console.error("❌ BREVO_API_KEY is not set in environment variables");
        return;
    }

    if (!process.env.ADMIN_EMAIL) {
        console.error("❌ ADMIN_EMAIL is not set in environment variables");
        return;
    }

    // Convert Mongoose document to plain object if needed
    const bookingData = booking?.toObject ? booking.toObject() : booking;

    if (!bookingData) {
        console.error("❌ Booking data is missing");
        return;
    }

    console.log("📧 Attempting to send email notification for booking:", bookingData);

    try {
        // Initialize the API with the API key
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        // Format date for display
        const formattedDate = bookingData.date 
            ? new Date(bookingData.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : bookingData.date || 'Not specified';

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
            name: "Helena Spa",
            email: "aselak30@gmail.com"
        };
        sendSmtpEmail.to = [{ email: process.env.ADMIN_EMAIL }];
        sendSmtpEmail.subject = "✅ New Booking Received";
        sendSmtpEmail.textContent = `
New Booking Details:
Name: ${bookingData.name || 'Not provided'}
Email: ${bookingData.email || 'Not provided'}
Phone: ${bookingData.phone || 'Not provided'}
Service: ${bookingData.service || 'Not provided'}
Date: ${formattedDate}
Time: ${bookingData.time || 'Not provided'}
Status: ${bookingData.status || 'pending'}
        `.trim();

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email notification sent successfully!", {
            messageId: response.messageId,
            response: response
        });
        return response;
    } catch (error) {
        console.error("❌ Brevo email error:", {
            message: error.message,
            response: error.response?.body || error.response?.data,
            status: error.response?.statusCode || error.status,
            fullError: error
        });
        throw error; // Re-throw to allow caller to handle if needed
    }
}

module.exports = { sendEmailNotification };
