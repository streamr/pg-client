// Need to poll for changes in localStorage..
// TODO: is there a better solution to this?
// Previously we used window.postMessage, but this
// caused problems for testing in web browser
var timerForNewEntries;
function checkForNewEntriesToAdd() {
    if ( localStorage.getItem('newItemToAdd') != null ) {
        var data = JSON.parse(localStorage.getItem('newItemToAdd'));

        localStorage.removeItem('newItemToAdd');

        data.entry_point_in_ms = entryPointInMs;

        marvin.entries.create(stream._links.createEntry,
            data,
            function(reply) {
                //steroids.layers.pop();
                showEntry(data);
            }
        );
    }
}

// Cache selectors
var innerViewport = $('#content #inner_viewport');

// Make sure elements in innerViewport fills whole screen vertically
innerViewport.css({
    'height': $(window).height() - ( $('#top_toolbar').outerHeight(true) +
                $('#bottom_toolbar').outerHeight(true) ) + 'px'
});

function showEntry(data) {
    var renderedHtml = marvin.templates.text_entry(data);
    innerViewport.append($(renderedHtml).css('width', $(window).width() + 'px'));

    innerViewport.css({
        // Make sure viewport is showing latest entry
        'right': (innerViewport.find('> div').length - 1) * $(window).width() + 'px'
    });
}

streamrInit();

// need some global reference
var startAt;
var entryPointInMs;

// TODO
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

        // Start listening for added content
        timerForNewEntries = window.setInterval(checkForNewEntriesToAdd, 100);
    });

    innerViewport.hammer().on('swiperight', function(event) {
        var el = $(this).find('> div');
        var currentRightPos = parseInt(el.css('right').replace('px', ''));
        el.css('right', currentRightPos - $(window).width() + 'px');
    });

    innerViewport.hammer().on('swipeleft', function(event) {
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
