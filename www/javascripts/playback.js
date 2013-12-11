// Get the movie from localStorage
var movieInfo = JSON.parse(localStorage.getItem('playBackMovie'));
var renderedHtml = marvin.templates.playback(movieInfo.movie);
$('#container').html(renderedHtml);

// If we are creating a new stream
var newStream = JSON.parse(localStorage.getItem("playBackNewStream"));
if ( newStream != null ) {
    // Make sure we remove the stream in localStorage
    localStorage.removeItem("playBackNewStream");
}

streamrInit();

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

        marvin.entries.create(newStream._links.createEntry,
            data,
            function(reply) {
                //steroids.layers.pop();
                showEntry({
                    'streamName': newStream.name,
                    'entry': data
                });
            }
        );
    }
}

// need some global references
var startAt;
var entryPointInMs;

// Cache some selectors
var innerViewport = $('#content #inner_viewport');

// Fetch all the stream entries for each stream
var sortedEntries = [];

function addEntriesToSortedEntries(streamIndex, entries) {
    var sorted = [];

    var sortedEntriesIterator = 0;
    for ( var i = 0; i < entries.length; i ++ ) {

        while ( sortedEntriesIterator < sortedEntries.length
                && sortedEntries[sortedEntriesIterator].entry.entry_point_in_ms <= entries[i].entry_point_in_ms ) {
            sorted.push(sortedEntries[sortedEntriesIterator]);

            sortedEntriesIterator ++;
        }

        sorted.push({
            'streamIndex': streamIndex,
            'entry': entries[i]
        });
        
    }

    // Make sure to insert all entries from sortedEntries
    for ( ; sortedEntriesIterator < sortedEntries.length; sortedEntriesIterator ++ ) {
        sorted.push(sortedEntries[sortedEntriesIterator]);
    }

    sortedEntries = sorted;
}

for( var i = 0; i < movieInfo.selectedStreams.length; i ++ ) {
    
    var tmp = movieInfo.selectedStreams[i];

    (function (tmp, i) {
        marvin.entries.get(tmp._links.entries, function(data) {
            addEntriesToSortedEntries(i, data.entries);
         });

    })(tmp, i);
}

function getCurrentPlaybackPosition() {
    return new Date().getTime() - startAt;
}

// Show stream entries
function checkForStreamEntriesToShow() {
    var playbackPosition = getCurrentPlaybackPosition();

    for ( var i = 0; i < sortedEntries.length; i ++ ) {
        
        if ( sortedEntries[i].entry.entry_point_in_ms <= playbackPosition ) {
            var entry = sortedEntries.shift();
            showEntry({
                'streamName': movieInfo.selectedStreams[entry.streamIndex].name,
                'entry': entry.entry
            });
        }

        else {
            break;
        }
    }
}
setInterval(checkForStreamEntriesToShow, 500);

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

(function ($, marvin) {
    "use strict";

    startAt = new Date().getTime();

    $('#add_item_button').hammer().on('tap', function(event) {
        entryPointInMs = new Date().getTime() - startAt;

        // Start listening for added content
        timerForNewEntries = window.setInterval(checkForNewEntriesToAdd, 200);
    });

    innerViewport.parent().hammer({
        'swipe_velocity': 0.2
    }).on('swiperight', function(event) {
        var el = $(this).find('> div');
        var currentRightPos = parseInt(el.css('right').replace('px', ''));
        el.css('right', currentRightPos - $(window).width() + 'px');
    });

    innerViewport.parent().hammer({
        'swipe_velocity': 0.2
    }).on('swipeleft', function(event) {
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
