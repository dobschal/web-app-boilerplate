const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 */
function sendMail(to, subject, text) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) return reject(error);
            resolve(info);
        });
    });
}

module.exports = { sendMail };