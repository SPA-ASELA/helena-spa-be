const nodemailer = require("nodemailer");

async function sendBookingNotification() {
    // Configure Gmail transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "aselak30@gmail.com", // your Gmail
            pass: "arsx vulz ibjo dlba", // replace below with Gmail App Password
        },
    });

    // Define email options
    const mailOptions = {
        from: "aselak30@gmail.com",
        to: "aselak30@gmail.com",
        subject: "New Booking Received",
        text: "A new booking has been made on your Helena Spa website.",
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Booking notification email sent successfully");
    } catch (error) {
        console.error("Error sending booking email:", error);
    }
}

module.exports = { sendBookingNotification };
