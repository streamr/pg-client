// How long elements should have class "active"
// when tap event is fired (milliseconds)
var touchFeedbackDelay = 100;

function streamrInit() {
    var tap_event_attr_name = 'data-tap-url';

    $('[' + tap_event_attr_name + ']').hammer().on('tap', function(event) {
        var url = $(this).attr(tap_event_attr_name);

        // Check if link requires login
        if ( typeof( $(this).attr('data-require-login') ) != "undefined"
                && !getAuthToken() ) {

            // Redirect to account creation / login
            url = 'user_registration.html';
        }

        // Some links should be opened in same window
        if ( typeof( $(this).attr('data-same-window') ) != "undefined" ) {
            window.location = url;
        }

        // Normal behaviour is to push url in new window
        else {
            var webView = new steroids.views.WebView( url );
            steroids.layers.push(webView);
        }
    });

    $('button.back').hammer().on('tap', function(event) {
        steroids.layers.pop();
    });
}

function requireLogin(message, returnToUrl) {
    // TODO: use this function anytime the user requests a page that requires login.
    // User will only get to page if registered && logged in.
    // Otherwise redirect to account creation / login page
}

function setAuthToken(token) {
    localStorage.setItem("authToken", token);
}

function getAuthToken() {
    return localStorage.getItem("authToken");
}

function setUser(user) {
    localStorage.setItem("user", user);
}

function logoutUser() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
}
