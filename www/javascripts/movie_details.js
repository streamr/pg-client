// We need to inform previous webview that this view is now ready
window.postMessage({
    'recipient': 'index.html',
    'message': 'ready:movie_details.html'
});

function messageReceived(event) {
    // check that the message is intended for us
    if (event.data.recipient == "movie_details.html") {
        var movie = JSON.parse(event.data.message).movie;

        var renderedHtml = marvin.templates.movie_details(movie);
        $('#main_container').html(renderedHtml);

        streamrInit();

        // Update list of streams
        marvin.movies.get(movie.href, function(data) {
            var renderedHtml = marvin.templates.movie_streams(data.movie);
            $('#stream_list').html(renderedHtml);
        });
    }
}

window.addEventListener("message", messageReceived);

(function ($, marvin) {
    "use strict";

})(jQuery, marvin);
