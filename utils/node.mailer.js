const nodemailer = require('nodemailer');
const { config } = require('../config/index');

const sendMail = async (to, code) => {

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: 'softapps.io3@gmail.com',
            pass: config.NODE_MAILER_KEY
        }
    });

    let mailDetails = {
        from: 'softapps.io3@gmail.com',
        to: to,
        subject: 'Sea Explorer Recover Password Service',
        text: 'Your Code is:',
        html: `<h1>Otp Code</h1>
        <h2>${code}</h2>
        `
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs', err.message);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = {
    sendMail
}