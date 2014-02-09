(function ($, marvin) {
    "use strict";

    streamrInit();

    $('#login_form').on('submit', function(event) {

        event.preventDefault();

    }).find('[type="submit"]').hammer().on('tap', function(event) {

        var form = $(this).parents('form:first');

        marvin.users.login({
            'identifier': form.find('[name="username"]').val(),
            'password': form.find('[name="password"]').val()
        }, function(data) {
            setAuthToken(data.auth_token);

            // Save username
            localStorage.setItem('username', form.find('[name="username"]').val());

            // Just close the login window
            steroids.layers.pop();

        });

    });

})(jQuery, marvin);


