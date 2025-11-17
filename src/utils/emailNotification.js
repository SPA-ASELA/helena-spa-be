const https = require('https');

async function sendEmailNotification(booking) {
    // Validate environment variables
    if (!process.env.BREVO_API_KEY) {
        console.error("❌ BREVO_API_KEY is not set in environment variables");
        return;
    }

    const adminEmailsRaw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
    const adminRecipients = adminEmailsRaw
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

    if (adminRecipients.length === 0) {
        console.error("❌ ADMIN_EMAIL/ADMIN_EMAILS is not set in environment variables");
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

        // Build admin notification email
        const adminEmailData = {
            sender: {
                name: "Helena Spa",
                email: "aselak30@gmail.com"
            },
            to: adminRecipients.map((email) => ({ email })),
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

        // Build client confirmation email
        const clientEmailData = bookingData.email
            ? {
                sender: {
                    name: "Helena Spa",
                    email: "aselak30@gmail.com",
                },
                to: [{ email: bookingData.email }],
                subject: "✅ Helena Spa Booking Received",
                textContent: `
Hi ${bookingData.name || "there"},

Thank you for booking an appointment at Helena Spa!

Here are your booking details:
- Service: ${bookingData.service || "Not provided"}
- Date: ${formattedDate}
- Time: ${bookingData.time || "Not provided"}
- Phone: ${bookingData.phone || "Not provided"}

Our team will review your request and contact you shortly. If you need to reach us sooner, feel free to WhatsApp us at +94776699488.

Warm regards,
Helena Spa Team
                  `.trim(),
            }
            : null;

        // Send emails (admin + client if available)
        const responses = [];
        const adminResponse = await sendBrevoEmailViaHTTP(adminEmailData);
        responses.push({ type: "admin", response: adminResponse });

        if (clientEmailData) {
            try {
                const clientResponse = await sendBrevoEmailViaHTTP(clientEmailData);
                responses.push({ type: "client", response: clientResponse });
            } catch (clientError) {
                console.error("⚠️ Failed to send client confirmation email:", clientError.message);
            }
        } else {
            console.warn("⚠️ Client email address missing; skipping customer confirmation email.");
        }

        console.log("✅ Email notifications sent successfully!", responses);
        return responses;
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

// Helper function to send email via direct HTTP request with retries and IPv4 lookup
function sendBrevoEmailViaHTTP(emailData, attempt = 1) {
    const MAX_ATTEMPTS = 3;
    const RETRYABLE_ERRORS = ['ECONNRESET', 'ETIMEDOUT', 'EPIPE'];

    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(emailData);

        const agent = new https.Agent({
            keepAlive: true,
            maxSockets: 5,
            timeout: 15000,
        });

        const options = {
            hostname: 'api.brevo.com',
            port: 443,
            path: '/v3/smtp/email',
            method: 'POST',
            agent,
            servername: 'api.brevo.com',
            headers: {
                accept: 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(postData),
                'user-agent': 'helena-spa-be/1.0',
            },
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
            if (RETRYABLE_ERRORS.includes(error.code) && attempt < MAX_ATTEMPTS) {
                console.warn(`⚠️ Brevo request failed (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying...`, error.message);
                setTimeout(() => {
                    sendBrevoEmailViaHTTP(emailData, attempt + 1)
                        .then(resolve)
                        .catch(reject);
                }, attempt * 500);
                return;
            }
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

module.exports = { sendEmailNotification };
