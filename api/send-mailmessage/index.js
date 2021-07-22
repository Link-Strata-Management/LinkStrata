module.exports = async function (context, req) {
    const secret_key = '6LdhyLIbAAAAAP5plHFoE6Qvv-hZVt7O07y1uzIf';
    const token = req.captcha;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    fetch(url, {
        method: 'post'
    })
        .then((resp) => resp.json())
        .then(function (data) {
            let authors = data.results;
            if (data.success) {
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
            }
            else {
                return {
                    res: {
                        status: 400
                    }
                };
            }
        })
};
