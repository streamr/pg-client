function streamrInit() {
    var tap_event_attr_name = 'data-tap-url';

    $('[' + tap_event_attr_name + ']').hammer().on('tap', function(event) {
        var webView = new steroids.views.WebView($(this).attr(tap_event_attr_name));
        steroids.layers.push(webView);
    });

    $('button.back').hammer().on('tap', function(event) {
        steroids.layers.pop();
    });

    $('#start_playing_button').hammer().on('tap', function(event) {
        var webView = new steroids.views.WebView("playback.html");
        steroids.layers.push(webView);
    });
}

