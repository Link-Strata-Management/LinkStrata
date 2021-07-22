module.exports = async function (context, req) {

    // build a POST request to verify the captcha
    var captchaVerify = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'post',
        form: {
            secret: '6LdhyLIbAAAAAP5plHFoE6Qvv-hZVt7O07y1uzIf',
            response: req.recaptcha
        }
    }

    // make HTTP request to verify the captcha
    request(captchaVerify, (err, response, body) => {
        // if reCaptcha succeeds
        if (captchaVerify.success == true) {
            var email = {
                subject: "New " + req.body.type + " form submission from: " + req.body.name,
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
                    status: captchaVerify.error-codes
                }
            };
        }
    })
};
