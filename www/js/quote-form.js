/* ---------------------------------------------
 Contact form
 --------------------------------------------- */
 $(document).ready(function () {
    $("#submit_btn").click(function () {

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
        if (user_name == "") {
            $('input[name=name]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_phone == "") {
            $('input[name=phone]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_email == "") {
            $('input[name=email]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_address == "") {
            $('input[name=address]').css('border-color', '#e41919');
            proceed = false;
        }
        if (user_unitscount == "") {
            $('input[name=unitscount]').css('border-color', '#e41919');
            proceed = false;
        }

        if (user_additional == "") {
            user_additional = 'N/A';
        }

        if (user_unitplan == "") {
            user_unitplan = 'N/A';
        }

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
            } else {
                output =
                    `
        <div class="alert alert-danger" role="alert">
          Oh no! Something went wrong :(
        </div>        
        `;
                document.getElementById('output').innerHTML = output;
            }
        }

        //everything looks good! proceed...
        if (proceed) {

            let name = $('input[name=name]').val();
            let email = $('input[name=email]').val();
            let message = `Hi ${user_name}, Thanks for contacting us regarding a new quote. A member of our staff will be in contact shortly. \n\n\nHere's the details you've sent to us: \n\nName: ${user_name} \nPhone: ${user_phone}  \nEmail: ${user_email} \nUnit Class: ${user_class} \nUP Number: ${user_unitplan} \nCurrently Managed: ${user_currentlymanaged} \nAddress: ${user_address} \nNumber of Units: ${user_unitscount} \nAdditional: ${user_additional}`;
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

    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form input, #contact_form textarea").keyup(function () {
        $("#contact_form input, #contact_form textarea").css('border-color', '');
        $("#result").slideUp();
    });

});
