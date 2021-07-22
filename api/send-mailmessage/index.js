module.exports = async function (context, req) {
    if (req.body.email) {
        var email = {
            // from: {
            //     email: req.body.email
            // },
            "personalizations": [{ "to": [{ "email": "sendgrid@cory.manson.id.au" },{ "email": "cory@manson.id.au" }] }],
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
