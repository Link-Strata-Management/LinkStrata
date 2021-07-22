module.exports = async function (context, req) {

    // build a POST request to verify the captcha
    var captchaVerify = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'post',
        form: {
            secret: '6LdhyLIbAAAAAP5plHFoE6Qvv-hZVt7O07y1uzIf',
            response: req.captcha
        }
    }
    let response = await fetch(captchaVerify)
    if (response.ok) {
        let json = await response.json();
    }

    // if reCaptcha succeeds
    if (json.success == true) {
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
                status: 400
            }
        };
    }
};
