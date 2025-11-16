const https = require('https');

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

        // Create email data
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

        // Use direct HTTP request to Brevo API to avoid SDK issues
        const response = await sendBrevoEmailViaHTTP(emailData);
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
        throw error;
    }
}

// Helper function to send email via direct HTTP request
function sendBrevoEmailViaHTTP(emailData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(emailData);

        const options = {
            hostname: 'api.brevo.com',
            port: 443,
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (e) {
                        resolve({ messageId: data });
                    }
                } else {
                    try {
                        const errorData = JSON.parse(data);
                        reject(new Error(`Brevo API error: ${errorData.message || data}`));
                    } catch (e) {
                        reject(new Error(`Brevo API error (${res.statusCode}): ${data}`));
                    }
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

module.exports = { sendEmailNotification };
