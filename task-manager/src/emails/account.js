// const sendgridAPIKey = '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'

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {

    await sgMail.send({
        to: email,
        from: 'guojianglin123@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}, Let me know how you get along with the app.`
    });
}

const sendCancelationEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'guojianglin123@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}, I hope to see you back sometime soon.`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}