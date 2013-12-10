(function ($, marvin) {
    "use strict";

    streamrInit();

    function create_stream() {
        var form = $('#create_stream_form');

        var createStreamUrl = form.find('#create_stream_url').val();

        marvin.streams.create(createStreamUrl, {
            'name': form.find('[name="name"]').val()
        }, function(data) {

            // Show playback view
            var webView = new steroids.views.WebView("playback.html#" + data.stream.href);
            steroids.layers.push(webView);

        });
    }

    $('#create_stream_form').on('submit', function(event) {
        event.preventDefault();
        //create_stream();
    });

    $('#create_stream_form [type="submit"]').hammer().on('tap', function(event) {
        create_stream();
    });

})(jQuery, marvin);

