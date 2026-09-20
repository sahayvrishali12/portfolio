const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, honeypot } = req.body;

    // Spam protection
    if (honeypot) {
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Configure Nodemailer
    // You MUST provide EMAIL_USER and EMAIL_PASS in your .env file
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: 'sahayvrishali@gmail.com',
        subject: `Portfolio Contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Portfolio server is running!`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
