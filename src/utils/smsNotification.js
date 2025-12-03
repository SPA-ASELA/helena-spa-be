const https = require('https');

async function sendSmsNotification(booking) {
    if (!process.env.TEXTLK_API_KEY) {
        console.error('❌ TEXTLK_API_KEY is not set in environment variables');
        return;
    }

    const recipientsRaw = process.env.TEXTLK_RECIPIENTS || '';
    const recipients = recipientsRaw
        .split(',')
        .map((phone) => phone.trim())
        .filter(Boolean);

    if (recipients.length === 0) {
        console.error('❌ TEXTLK_RECIPIENTS is not set. Unable to send SMS notification.');
        return;
    }

    const senderId = process.env.TEXTLK_SENDER_ID || 'HelenaSpa';

    const bookingData = booking?.toObject ? booking.toObject() : booking;
    if (!bookingData) {
        console.error('❌ Booking data missing. Cannot send SMS notification.');
        return;
    }

    const formattedDate = bookingData.date
        ? new Date(bookingData.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'Not provided';

    const message = [
        `New Helena Spa booking received.`,
        `Name: ${bookingData.name || 'N/A'}`,
        `Service: ${bookingData.service || 'N/A'}`,
        `Date: ${formattedDate}`,
        `Time: ${bookingData.time || 'N/A'}`,
        `Client Phone: ${bookingData.phone || 'N/A'}`,
        `Please follow up and let the client know we will contact them soon.`,
        `WhatsApp them via +94776699488 if needed.`,
    ].join('\n');

    const payload = {
        recipient: recipients.join(','),
        sender_id: senderId,
        type: 'plain',
        message,
    };

    try {
        const response = await sendTextLkRequest(payload);
        console.log('✅ SMS notification sent successfully!', response);
        return response;
    } catch (error) {
        console.error('❌ Failed to send SMS notification:', error.message);
        throw error;
    }
}

function sendTextLkRequest(payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);

        const options = {
            hostname: 'app.text.lk',
            port: 443,
            path: '/api/v3/sms/send',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.TEXTLK_API_KEY}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(body);
                        resolve(parsed);
                    } catch (error) {
                        resolve({ raw: body });
                    }
                } else {
                    reject(new Error(`TextLK API error (${res.statusCode}): ${body}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

module.exports = { sendSmsNotification };

