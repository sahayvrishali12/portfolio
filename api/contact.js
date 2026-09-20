const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { name, email, subject, message, honeypot } = req.body;

    // Spam protection (Honeypot)
    // If a bot (or autofill) fills this hidden field, return success but don't send the email.
    if (honeypot) {
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Configure Nodemailer using Vercel Environment Variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // SENDER MUST BE THE VERIFIED EMAIL_USER
        replyTo: email,               // VISITOR EMAIL SET AS REPLY-TO
        to: 'sahayvrishali@gmail.com', // DESTINATION
        subject: `Portfolio Contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ success: false, message: 'Something went wrong while sending your message. Please try again.' });
    }
};
