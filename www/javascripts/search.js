(function ($, marvin) {
    "use strict";

    var $searchField = $('.movie-search');

    $searchField.on('keyup', searchMovies);

    function searchMovies() {
        var searchQuery = $searchField.val();
        history.replaceState(null, null, '?search=' + searchQuery);
        marvin.movies.search(searchQuery, function (response) {
            var renderedHtml = marvin.templates.movies(response);
            $('#search_results').html(renderedHtml);
            scaleStreamCount();
            var search_results = {}; // we will save all results here, so we later reference it

            // Loop through all results and assign them in a dictionary
            for ( var i = 0; i < response.movies.length; i ++ ) {
                search_results[response.movies[i].href] = response.movies[i];
            }

            // When search result is tapped => show details about movie
            $('#search_results > div').hammer().on('tap', function(e) {
                var el = $(this);

                localStorage.setItem("movieDetailsMovie", JSON.stringify({
                    'movie': search_results[el.attr('data-movie-url')]
                }));

                var webView = new steroids.views.WebView("movie_details.html");
                steroids.layers.push(webView);
            });

        });
    }

    function scaleStreamCount() {
        var $elem = $('.movie-stream-count');
        var fontSize = 65;
        var ourText = $('span:visible:first', $elem);
        var maxHeight = $elem.height();
        var maxWidth = $elem.width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
    }

    // Onload stuff
    (function setSearchValFromUrl() {
        var search = $.url().param('search');
        if (search) {
            $searchField.val(search);
            searchMovies();
        }
    })();

    $(window).resize(scaleStreamCount);

    $(document).ready(function () {
        searchMovies();
    });

})(jQuery, marvin);
