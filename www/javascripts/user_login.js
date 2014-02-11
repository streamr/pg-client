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

            setUser(data.user);

            // Check if login redirect requested
            if ( localStorage.getItem("loginRedirect") ) {
                var loginRedirect = localStorage.getItem("loginRedirect");
                localStorage.removeItem("loginRedirect");
                window.location = loginRedirect;
            }

            // Just close the login window
            else {
                steroids.layers.pop();
            }

        });

    });

})(jQuery, marvin);


