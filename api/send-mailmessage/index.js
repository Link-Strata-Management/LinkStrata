module.exports = async function (context, req) {

    // get the client's ip address
    const ip = args['__ow_headers']['x-client-ip']

    // build a POST request to verify the captcha
    var r = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'post',
        form: {
            secret: args['RECAPTCHA_SECRET'],
            response: req.recaptcha,
            remoteip: ip
        }
    }

    // make HTTP request to verify the captcha
    request(r, (err, response, body) => {
        // if reCaptcha succeeds
        if (response.success == true) {
            var email = {
                from: {
                    email: req.body.email
                },
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
                    status: response.error-codes
                }
            };
        }
    })
};