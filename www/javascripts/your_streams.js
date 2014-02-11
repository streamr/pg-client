// Update list of streams
// TODO

var $yourStreams = $('#your_streams');

marvin.streams.get(movie.href, function(data) {
    movieInfo = data.movie;
    var renderedHtml = marvin.templates.movie_streams(data.movie);

    $yourStreams.html(renderedHtml);

    // Unpublishing
    $yourStreams.find('button.btn-warning').hammer().on('tap', function() {
        // TODO
        marvin.streams.unpublish();
    });
    // Publishing
    $yourStreams.find('button.btn-success').hammer().on('tap', function() {
        // TODO
        marvin.streams.publish();
    });
    // Deleting
    $yourStreams.find('button.btn-danger').hammer().on('tap', function() {
        // TODO
        if ( confirm("Are you sure? The stream is gone forever after this.") ) {
            marvin.streams.remove();
        }
    });
});

