const nodemailer = require("nodemailer");

const sendMail = async (recipientEmail, subject, html) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.FROM_EMAIL,
        to: recipientEmail,
        subject: subject,
        html: html
    };

    return await transporter.sendMail(mailOptions);
}


module.exports = { sendMail };