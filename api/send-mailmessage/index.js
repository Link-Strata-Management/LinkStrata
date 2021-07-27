const Grecaptcha = require('grecaptcha')
const client = new Grecaptcha('#{CAPTCHA_SECRET}#')

module.exports = async function (context, req) {

    if (await client.verify(req.body.captcha)) {
        var email = {
            "personalizations": [{ "to": [{ "email": "#{EMAIL_FROM}#" }, { "email": req.body.email }] }],
            subject: req.body.name + ": New website " + req.body.type + " submission",
            content: [{
                type: 'text/plain',
                value: req.body.message
            }]
        };

        return {
            res: {
                status: 200
            },
            message: email
        };
    } else {
        return {
            res: {
                status: 400
            }
        };
    }
};
