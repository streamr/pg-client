function messageReceived(event) {

    // check that the message is intended for us
    if ( event.data.recipient == "playback.html" ) {

        var data = JSON.parse(event.data.message);

        switch ( data.type ) {

            case 'create_entry':
                var entry_data = data.entry;
                entry_data.entry_point_in_ms = entryPointInMs;

                marvin.entries.create(stream._links.createEntry,
                    entry_data,
                    function(data) {
                        steroids.layers.pop();
                        showEntry(entry_data);
                    }
                );

                break;

        }

    }
}
window.addEventListener("message", messageReceived);

function showEntry(data) {
    var renderedHtml = marvin.templates.text_entry(data);
    var innerViewport = $('#content #inner_viewport');
    innerViewport.append($(renderedHtml).css('width', $(window).width() + 'px'));

    // Make sure viewport is showing latest entry
    innerViewport.css('right', (innerViewport.find('> div').length - 1) * $(window).width() + 'px');
}

streamrInit();

// need some global reference
var startAt;
var entryPointInMs;

// Currently working only with one stream
// (need to fix this later for multiple streams)
var stream;
marvin.streams.get(streamUrl, function(data) {
    stream = data.stream;
});

(function ($, marvin) {
    "use strict";

    startAt = new Date().getTime();

    $('#add_item_button').hammer().on('tap', function(event) {
        entryPointInMs = new Date().getTime() - startAt;
    });

    $('#playback_row #content').hammer().on('swiperight', function(event) {
        var el = $(this).find('> div');
        var currentRightPos = parseInt(el.css('right').replace('px', ''));
        el.css('right', currentRightPos - $(window).width() + 'px');
    });

    $('#playback_row #content').hammer().on('swipeleft', function(event) {
        var el = $(this).find('> div');
        var currentRightPos = parseInt(el.css('right').replace('px', ''));
        el.css('right', currentRightPos + $(window).width() + 'px');
    });

    setInterval(function() {
        var diff = new Date().getTime() - startAt;

        var diff_in_seconds = Math.round(diff / 1000);

        var minutes = Math.floor(diff_in_seconds / 60) + '';

        var seconds = diff_in_seconds - ( minutes * 60 ) + '';

        if ( minutes.length == 1 ) {
            minutes = '0' + minutes;
        }
        if ( seconds.length == 1 ) {
            seconds = '0' + seconds;
        }

        $('#playback_time').html('' + minutes + ':' + seconds);

    }, 1000);

})(jQuery, marvin);
