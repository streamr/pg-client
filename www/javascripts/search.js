(function ($, marvin) {
    "use strict";

    $('.movie-search').on('keyup', function () {
        var searchQuery = $(this).val();
        marvin.movies.search(searchQuery, function (response) {
            var renderedHtml = marvin.templates.movies(response);
            $('#search_results').html(renderedHtml);
        });
    });
})(jQuery, marvin);
