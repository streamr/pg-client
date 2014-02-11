// How long elements should have class "active"
// when tap event is fired (milliseconds)
var touchFeedbackDelay = 100;

function streamrInit(element) {

    if ( element === undefined ) {
        element = $('body');
    }

    var tap_event_attr_name = 'data-tap-url';

    element.find('[' + tap_event_attr_name + ']').hammer().on('tap', function(event) {
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

    element.find('button.back').hammer().on('tap', function(event) {
        steroids.layers.pop();
    });
}

function requireLogin(message, returnToUrl) {
    // Use this function anytime the user requests a page that requires login.
    // User will only get to page if registered && logged in.
    // Otherwise redirect to account creation / login page

    if ( !getUser() ) {
        alert(message);
        localStorage.setItem("loginRedirect", returnToUrl);
        window.location = "user_registration.html";
        return false;
    }

    return true;
}

function setAuthToken(token) {
    localStorage.setItem("authToken", token);
}

function getAuthToken() {
    return localStorage.getItem("authToken");
}

function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
    return JSON.parse( localStorage.getItem("user") );
}

function logoutUser() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
}

function startPlayback( selectedStreams ) {
    if ( !$.isArray(selectedStreams) ) {
        selectedStreams = [selectedStreams];
    }

    // Save to localStorage info about the selected streams
    localStorage.setItem("selectedStreams", JSON.stringify(selectedStreams));

    // Load the playback view
    var webView = new steroids.views.WebView( "playback.html" );
    steroids.layers.push(webView);
}
