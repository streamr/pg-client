(function ($, marvin) {
    "use strict";

    var data = JSON.parse(localStorage.getItem("userRegistrationData"));

    if ( data == null ) {
        data = {};
    }

    var renderedHtml = marvin.templates.user_registration(data);
    $('#content').html(renderedHtml);

    streamrInit();

    $('#registration_form').on('submit', function(event) {

        event.preventDefault();

    }).find('[type="submit"]').hammer().on('tap', function(event) {

        var form = $(this).parents('form:first');

        marvin.users.create({
            'email': form.find('[name="email"]').val(),
            'username': form.find('[name="username"]').val(),
            'password': form.find('[name="password"]').val()
        }, function(data) {
            setAuthToken(data.auth_token);
            localStorage.setItem("username", form.find('[name="username"]').val());
            setUser(data.user);

            alert("Account created successfully");

            // Close this window
            steroids.layers.pop();

        });

    });

})(jQuery, marvin);

