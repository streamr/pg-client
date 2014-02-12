(function ($, marvin) {
    "use strict";

    var movie = JSON.parse(localStorage.getItem("movieDetailsMovie")).movie;

    streamrInit();

    function create_stream() {
        var form = $('#create_stream_form');

        marvin.streams.create(movie._links.createStream, {
            'name': form.find('[name="name"]').val(),
            'description': form.find('[name="description"]').val()
        }, function(data) {

            localStorage.setItem("playBackNewStream", JSON.stringify(data.stream));

            // Show playback view
            var webView = new steroids.views.WebView("playback.html");
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

