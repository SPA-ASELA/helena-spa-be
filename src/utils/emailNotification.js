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

        // Create email data object (plain object format)
        const emailData = {
            sender: {
                name: "Helena Spa",
                email: "aselak30@gmail.com"
            },
            to: [{ email: process.env.ADMIN_EMAIL }],
            subject: "✅ New Booking Received",
            textContent: `
New Booking Details:
Name: ${bookingData.name || 'Not provided'}
Email: ${bookingData.email || 'Not provided'}
Phone: ${bookingData.phone || 'Not provided'}
Service: ${bookingData.service || 'Not provided'}
Date: ${formattedDate}
Time: ${bookingData.time || 'Not provided'}
Status: ${bookingData.status || 'pending'}
            `.trim()
        };

        // Create API instance
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        
        // Set API key - use the most common method for @getbrevo/brevo
        // Try setApiKey with string identifier first (most compatible)
        if (typeof apiInstance.setApiKey === 'function') {
            apiInstance.setApiKey('api-key', process.env.BREVO_API_KEY);
        } else {
            // If setApiKey doesn't exist, log available methods for debugging
            console.error("❌ setApiKey method not found on apiInstance. Available methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(apiInstance)));
            throw new Error('setApiKey method is not available on TransactionalEmailsApi instance');
        }

        const response = await apiInstance.sendTransacEmail(emailData);
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
