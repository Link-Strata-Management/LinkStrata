/* ---------------------------------------------
 Contact form
 --------------------------------------------- */

$('form').on('submit', function (e) {
    // Prevent the page from refreshing
    e.preventDefault();

    //get input field values
    var user_name = $('input[name=name]').val();
    var user_email = $('input[name=email]').val();
    var user_message = $('textarea[name=message]').val();
    var captcha = $('textarea[name=g-recaptcha-response]').val();

    //simple validation at client's end
    //we simply change border color to red if empty field using .css()
    var proceed = true;

    if (captcha == "") {
        output =
            output =
            `
        <div class="alert alert-info" role="alert">
        Please complete the CAPTCHA.
        </div>        
        `;
        document.getElementById('output').innerHTML = output;
        proceed = false;
    }

    function processResponse(response) {
        if (response.status === 200) {
            output =
                `
        <div class="alert alert-success" role="alert">
          Thanks, ${document.getElementById('name').value}! We'll be in touch soon!
        </div>        
        `;
            document.getElementById('output').innerHTML = output;

            //reset values in all input fields
            $('#contact_form input').val('');
            $('#contact_form textarea').val('');
            grecaptcha.reset()
        } else {
            output =
                `
        <div class="alert alert-danger" role="alert">
          An error has occured. Please try again or contact us directly.
        </div>        
        `;
            document.getElementById('output').innerHTML = output;
            grecaptcha.reset()
        }
    }

    //everything looks good! proceed...
    if (proceed) {
        let name = $('input[name=name]').val();
        let email = $('input[name=email]').val();
        let message = `Hi ${user_name}, Thanks for contacting us with your message. A member of our staff will be in contact shortly. \n\n\nHere's the details you've sent to us: \n\nName: ${user_name}  \nEmail: ${user_email} \nMessage: ${user_message}`;
        let captcha = $('textarea[name=g-recaptcha-response]').val();

        fetch('/api/send-mailmessage', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                captcha: captcha,
                type: 'contact'
            })
        })
            .then((res) => processResponse(res))
    }

    return false;
});