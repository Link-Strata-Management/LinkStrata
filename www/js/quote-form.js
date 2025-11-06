/* ---------------------------------------------
 Quote form
 --------------------------------------------- */

// Enable submit button when reCAPTCHA is completed
function onRecaptchaSuccess() {
    document.getElementById('submit_btn').disabled = false;
}

// Disable submit button when reCAPTCHA expires
function onRecaptchaExpired() {
    document.getElementById('submit_btn').disabled = true;
}

// Track submission to prevent rapid resubmission
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 10000; // 10 seconds between submissions

$('form').on('submit', function (e) {
    // Prevent the page from refreshing
    e.preventDefault();
    
    // Check cooldown period
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
        const remainingSeconds = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
        output = `
        <div class="alert alert-warning" role="alert">
        Please wait ${remainingSeconds} seconds before submitting again.
        </div>        
        `;
        document.getElementById('output').innerHTML = output;
        return false;
    }

    //get input field values
    var user_name = $('input[name=name]').val();
    var user_phone = $('input[name=phone]').val();
    var user_email = $('input[name=email]').val();
    var user_class = $('select[name=class]').val();
    var user_unitplan = $('input[name=unitplan]').val();
    var user_currentlymanaged = $('select[name=currentlymanaged]').val();
    var user_address = $('input[name=address]').val();
    var user_unitscount = $('input[name=unitscount]').val();
    var user_additional = $('textarea[name=additional]').val();
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
            
            //reset reCAPTCHA
            grecaptcha.reset();
            document.getElementById('submit_btn').disabled = true;
        } else {
            output =
                `
        <div class="alert alert-danger" role="alert">
        An error has occured. Please try again or contact us directly.
        </div>        
        `;
            document.getElementById('output').innerHTML = output;
            
            //reset reCAPTCHA on error
            grecaptcha.reset();
            document.getElementById('submit_btn').disabled = true;
        }
    }

    //everything looks good! proceed...
    if (proceed) {
        // Disable button during submission
        document.getElementById('submit_btn').disabled = true;
        lastSubmitTime = Date.now();

        let name = $('input[name=name]').val();
        let email = $('input[name=email]').val();
        let message = `Hi ${user_name}, Thanks for contacting us regarding a new quote. A member of our staff will be in contact shortly. \n\nHere's the details you've sent to us: \n\nName: ${user_name} \nPhone: ${user_phone}  \nEmail: ${user_email} \nUnit Class: ${user_class} \nUP Number: ${user_unitplan} \nCurrently Managed: ${user_currentlymanaged} \nAddress: ${user_address} \nNumber of Units: ${user_unitscount} \nAdditional: ${user_additional}`;
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
                type: 'quote'
            })
        })
            .then((res) => processResponse(res))
    }

    return false;
});

