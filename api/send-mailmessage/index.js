const Grecaptcha = require('grecaptcha');
const { EmailClient } = require("@azure/communication-email");

const grecaptchaClient = new Grecaptcha('#{CAPTCHA_SECRET}#');
const connectionString = '#{COMMUNICATION_SERVICES_CONNECTION_STRING}#';
const emailClient = new EmailClient(connectionString);

module.exports = async function (context, req) {
    context.log('Processing email request');

    if (!req.body) {
        context.res = {
            status: 400,
            body: "Request body is missing"
        };
        return;
    }

    // Verify reCAPTCHA
    if (await grecaptchaClient.verify(req.body.captcha)) {
        try {
            const emailMessage = {
                senderAddress: '#{EMAIL_FROM}#', // e.g., "DoNotReply@<your-domain>.azurecomm.net"
                content: {
                    subject: `${req.body.name}: New ${req.body.type} submission`,
                    plainText: req.body.message,
                },
                recipients: {
                    to: [
                        { address: '#{EMAIL_TO}#' },
                        { address: req.body.email }
                    ]
                }
            };

            const poller = await emailClient.beginSend(emailMessage);
            const response = await poller.pollUntilDone();

            context.log('Email sent successfully:', response);

            context.res = {
                status: 200,
                body: {
                    message: "Email sent successfully",
                    id: response.id
                }
            };
        } catch (error) {
            context.log.error('Error sending email:', error);
            context.res = {
                status: 500,
                body: {
                    message: "Failed to send email",
                    error: error.message
                }
            };
        }
    } else {
        context.log('reCAPTCHA verification failed');
        context.res = {
            status: 400,
            body: "reCAPTCHA verification failed"
        };
    }
};
