module.exports = async function (context, req) {

    // build a POST request to verify the captcha
    // var captchaVerify = {
    //     uri: 'https://www.google.com/recaptcha/api/siteverify',
    //     method: 'post',
    //     form: {
    //         secret: '6LdhyLIbAAAAAP5plHFoE6Qvv-hZVt7O07y1uzIf',
    //         response: req.captcha
    //     }
    // }

    var obj;
    const secret_key = '6LdhyLIbAAAAAP5plHFoE6Qvv-hZVt7O07y1uzIf';
    const token = req.captcha;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    fetch(url, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => obj = res.json({ google_response }))
        // .catch(error => res.json({ error }));

    // if reCaptcha succeeds
    if (obj.success == true) {
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
