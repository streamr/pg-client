// Update list of streams

if ( !requireLogin("You must login first!", "your_streams.html") ) {
    return;
}

streamrInit();

var user = getUser();
var $yourStreams = $('#your_streams');

marvin.users.get(user.href, function(data) {
    console.log(data);

    var renderedHtml = marvin.templates.your_streams({
        'streams': data.user.streams
    });

    $yourStreams.html(renderedHtml);

    // Playing stream
    $yourStreams.find('button.btn-warning').hammer().on('tap', function() {
        var el = $(this);
        var $streamEl = el.parents('.your_stream:first');
        var streamHref = $streamEl.attr('data-stream-url');
        var movieHref = $streamEl.attr('data-movie-url');

        startPlayback({
            'name': $streamEl.find('h2').html(),
            '_links': {
                'entries': 'TODO' // TODO
            }
        });
    });

    // Unpublishing
    $yourStreams.find('button.btn-warning').hammer().on('tap', function() {
        var el = $(this);
        var $streamEl = el.parents('.your_stream:first');
        $streamEl.addClass('loading');
        var streamHref = $streamEl.attr('data-stream-url');
        marvin.streams.unpublish(streamHref + "/unpublish", function(response) {
            $streamEl.removeClass('loading');
            $streamEl.removeClass('published').addClass('unpublished');
        });
    });

    // Publishing
    $yourStreams.find('button.btn-success').hammer().on('tap', function() {
        var el = $(this);
        var $streamEl = el.parents('.your_stream:first');
        $streamEl.addClass('loading');
        var streamHref = $streamEl.attr('data-stream-url');
        marvin.streams.publish(streamHref + "/publish", function(response) {
            $streamEl.removeClass('loading');
            $streamEl.removeClass('unpublished').addClass('published');
        });
    });

    // Deleting
    $yourStreams.find('button.btn-danger').hammer().on('tap', function() {
        if ( confirm("Are you sure? The stream is gone forever after this.") ) {
            var el = $(this);
            var $streamEl = el.parents('.your_stream:first');
            $streamEl.addClass('loading');
            var streamHref = $streamEl.attr('data-stream-url');
            marvin.streams.remove(streamHref, function(response) {
                // TODO
                console.log(response);
                $streamEl.fadeOut(function() {
                    $(this).remove();
                });
            });
        }
    });

});

