/* ---------------------------------------------
 Contact form
 --------------------------------------------- */
$(document).ready(function () {
    $("#submit_btn").click(function () {

        //get input field values
        var user_name = $('input[name=name]').val();
        var user_phone = $('input[name=phone]').val();
        var user_email = $('input[name=email]').val();
        var user_class = $('input[name=class]').val();
        var user_unitplan = $('input[name=unitplan]').val();
        var user_currentlymanaged = $('input[name=currentlymanaged]').val();
        var user_address = $('input[name=address]').val();
        var user_unitscount = $('input[name=unitscount]').val();
        var user_additional = $('textarea[name=additional]').val();

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
            user_additional = 'N/A'
            proceed = true;
        }

        if (user_unitplan == "") {
            user_unitplan = 'N/A'
            proceed = true;
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
            let message = `A new quote has been requested. \n\nName: ${user_name} \nPhone: ${user_phone}  \nEmail: ${user_email} \nUnit Class: ${user_class} \nUP Number: ${user_unitplan} \nCurrently Managed: ${user_currentlymanaged} \nAddress: ${user_address} \nNumber of Units: ${user_unitscount} \nAdditional: ${user_additional}`

            fetch('/api/send-mailmessage', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
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
