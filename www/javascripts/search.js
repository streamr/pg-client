(function ($, marvin) {
    "use strict";

    alert("got here allright!");

    $('.movie-search').on('keyup', function () {
        var searchQuery = $(this).val();
        marvin.movies.search(searchQuery, function (movies) {
            var renderedHtml = marvin.templates.movies(movies);
            $('.js-insert-movies').html(renderedHtml);
        });
    });
})(jQuery, marvin);
