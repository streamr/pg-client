function messageReceived(event) {

    // check that the message is intended for us
    if ( event.data.recipient == "index.html"
        && event.data.message == "ready:movie_details.html" ) {

        window.postMessage(pendingPostMessage);
    }
}

window.addEventListener("message", messageReceived);

var pendingPostMessage;

(function ($, marvin) {
    "use strict";

    $('.movie-search').on('keyup', function () {
        var searchQuery = $(this).val();
        marvin.movies.search(searchQuery, function (response) {
            var renderedHtml = marvin.templates.movies(response);
            $('#search_results').html(renderedHtml);

            var search_results = {}; // we will save all results here, so we later reference it

            // Loop through all results and assign them in a dictionary
            for ( var i = 0; i < response.movies.length; i ++ ) {
                search_results[response.movies[i].href] = response.movies[i];
            }

            // When search result is tapped => show details about movie
            $('#search_results > div').hammer().on('tap', function(e) {
                var el = $(this);

                var webView = new steroids.views.WebView("movie_details.html");
                steroids.layers.push(webView);

                // We need to send some data to the movie_details.html webview
                pendingPostMessage = {
                    'recipient': 'movie_details.html',
                    'message': JSON.stringify({
                        'movie': search_results[el.attr('data-movie-url')]
                    })
                };

            });

        });
    });
})(jQuery, marvin);
