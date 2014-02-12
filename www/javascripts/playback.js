// Get the movie from localStorage
var movie = JSON.parse(localStorage.getItem("movieDetailsMovie")).movie;
var selectedStreams = JSON.parse(localStorage.getItem('selectedStreams'));

// If we are creating a new stream
var newStream = JSON.parse(localStorage.getItem("playBackNewStream"));
if ( newStream != null ) {
    // Make sure we remove the stream in localStorage
    localStorage.removeItem("playBackNewStream");
}

var editStreamObject = null;

if ( newStream != null ) {
    var editStreamObject = newStream;
}
else if ( localStorage.getItem("streamEditMode") !== undefined ) {
    var editStreamObject = JSON.parse(localStorage.getItem("streamEditMode"));

    // Be sure to disable editmode by default for next playback
    localStorage.removeItem("streamEditMode");
}

var inEditMode = editStreamObject !== null;

// need some global references
var pauseAt = null;
var startAt = new Date().getTime();
var entryPointInMs;

// Keep track of which element is currently viewed
var currentEntryInViewport;

var renderedHtml = marvin.templates.playback({
    movie: movie,
    inEditMode: inEditMode
});

$('#container').html(renderedHtml);

streamrInit();

// Cache some selectors
var $content = $('#content');
var innerViewport = $('#inner_viewport');

// Make sure entries are always of correct size
var fixSizeOfEntriesTimeout = null;
$(window).on('resize', function(e) {

    // Prevent event from firing several times
    if ( fixSizeOfEntriesTimeout != null ) {
        clearTimeout(fixSizeOfEntriesTimeout);
    }

    fixSizeOfEntriesTimeout = setTimeout(fixSizeOfEntries, 100);
});

function fixSizeOfEntries(el) {

    if ( el ) {
        var entryElements = el;
    }

    else {

        // Make sure elements in innerViewport fills whole screen vertically
        innerViewport.css({
            'height': $(window).height() - ( $('#top_toolbar').outerHeight(true) +
                        $('#bottom_toolbar').outerHeight(true) ) + 'px'
        });

        var entryElements = innerViewport.find('> div');

    }

    var innerViewportCssHeight = innerViewport.css('height');
    var entryWidth = $content.width();

    entryElements.each(function() {
        var el = $(this);
        el.css({
            'width': entryWidth + 'px'
        });
    });

    if ( !el && entryElements.length > 0 ) {
        focusToEntry(currentEntryInViewport);
    }
}

// Do once on page load
fixSizeOfEntries();

// Need to poll for changes in localStorage..
// TODO: is there a better solution to this?
// Previously we used window.postMessage, but this
// caused problems for testing in web browser
var timerForNewEntries = null;
function checkForNewEntriesToAdd() {
    if ( localStorage.getItem('newItemToAdd') != null ) {
        var data = JSON.parse(localStorage.getItem('newItemToAdd'));

        localStorage.removeItem('newItemToAdd');

        // Check if we need to close popups that were opened when creating new entry
        if ( data.popups_to_close ) {
            for ( ; data.popups_to_close > 0; data.popups_to_close -- ) {
                steroids.layers.pop();
            }
            delete data.popups_to_close;
        }

        data.entry_point_in_ms = entryPointInMs;

        // Entry point can't be zero (problem with Marvin?)
        if ( data.entry_point_in_ms == 0 ) {
            data.entry_point_in_ms += 10;
        }

        data.content = JSON.stringify(data.content);

        marvin.entries.create(editStreamObject._links.createEntry,
            data,
            function(reply) {
                showEntry({
                    'streamName': editStreamObject.name,
                    'entry': reply.entry
                }, data.entry_point_in_ms);
            }
        );
    }
}

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

if ( newStream == null ) {
    for( var i = 0; i < selectedStreams.length; i ++ ) {

        var tmp = selectedStreams[i];

        (function (tmp, i) {
            marvin.entries.get(tmp._links.entries, function(data) {
                addEntriesToSortedEntries(i, data.entries);
            });
        })(tmp, i);
    }
}

function getCurrentPlaybackPosition() {
    return new Date().getTime() - startAt;
}

var lastNewEntry = 0;

// Show stream entries
function checkForStreamEntriesToShow( skipPauseCheck ) {

    if ( skipPauseCheck === undefined ) {

        // If video is paused => do nothing
        if ( pauseAt != null ) {
            return;
        }
    }

    playbackPosition = getCurrentPlaybackPosition();

    for ( var i = 0; i < sortedEntries.length; i ++ ) {

        if ( sortedEntries[i].entry.entry_point_in_ms <= playbackPosition ) {

            var entry = sortedEntries.shift();

            // Because we are shifting the array, need to decrease the counter
            i -= 1;

            showEntry({
                'streamName': selectedStreams[entry.streamIndex].name,
                'entry': entry.entry
            }, entry.entry.entry_point_in_ms, true);

            // Focus to latest entry if user didn't manually specify jump position
            if ( skipPauseCheck === undefined ) {
                focusToEntry("last");
            }
        }

        else {
            break;
        }
    }


    // Check if we have a new entry to show => focus to it
    var entries = innerViewport.find('> div');
    if ( entries.length > 0 ) {

        for ( var i = 0; i < entries.length; i ++ ) {
            var entryPointInMs = parseInt( $(entries[i]).attr('data-entrypoint') );

            if ( entryPointInMs > playbackPosition ) {
                if ( i < 0 ) {
                    i = 0;
                }
                else {
                    i -= 1;
                }

                if ( i != lastNewEntry ) {
                    lastNewEntry = i;
                    focusToEntry(i);
                }
                return;
            }
        }

        // Ensure we show correct entry if user manually jumped to specific point in video
        // Focus to latest entry if no other entry found
        if ( skipPauseCheck !== undefined ) {
            focusToEntry(entries.length - 1);
        }
    }
}
var entriesInterval = setInterval(checkForStreamEntriesToShow, 500);

function focusToEntry(index, suppressNotifications) {

    var lastEntryIndex = innerViewport.find('> div').length - 1;

    if ( index === "last" ) {
        index = lastEntryIndex;
    }

    // Check that we are not out of bounds
    if ( index < 0 ) {
        index = 0;
    }
    else if ( index > lastEntryIndex ) {
        index = lastEntryIndex;
    }

    if ( currentEntryInViewport != index ) {

        currentEntryInViewport = index;

        // Notifications
        if ( suppressNotifications === undefined ) {
            switch ( localStorage.getItem("notificationLevel") ) {

                case "vibrate":
                    navigator.notification.vibrate(500); // 500 ms
                    break;

                case "beep":
                    navigator.notification.beep(1);
                    break;

                case "vibrate_beep":
                    navigator.notification.vibrate(500); // 500 ms
                    navigator.notification.beep(1);
                    break;
            }
        }
    }

    // Focus viewport to the wanted entry
    var width = $content.width() + 30; // 30 from margin
    innerViewport.css({
        'transform': 'translate3d(' + ( - index * width ) + 'px,0,0)'
    });

}

function showEntry(data, entryInMs, nofocus) {

    if ( typeof data.entry.content != "object" ) {
        data.entry.content = JSON.parse(data.entry.content);
    }

    switch ( data.entry.content_type ) {
        case 'text':
        default:
            var renderedHtml = marvin.templates.text_entry(data);
            break;

        case 'wikipedia':
            var renderedHtml = marvin.templates.wikipedia_entry(data);
            break;

    }

    var el = $(renderedHtml);
    el.attr('data-entrypoint', "" + entryInMs);
    el.attr('data-entry-url', data.entry.href);

    // If in create/edit mode => show delete btn
    if ( inEditMode ) {
        var deleteBtn = $('<button class="btn btn-danger delete_entry"><i class="fa fa-trash-o"></i> Delete story</button>');
        deleteBtn.hammer().on('tap', function() {

            var $entryEl = $(this).parents('div.entry:first');
            var entryURL = $entryEl.attr('data-entry-url');

            $entryEl.fadeOut(function() {
                marvin.entries.remove(entryURL);

                $(this).remove();

                // Focus to previous entry
                focusToEntry(currentEntryInViewport - 1);
            });
        });

        // No need to show stream label in create/edit mode
        el.find('> span.label:first').remove();

        // Add the delete btn to DOM
        deleteBtn.prependTo(el);
    }

    // Make sure we insert the entry in correct position
    var allEntries = innerViewport.find('> div.entry');
    var elInjected = false;

    for ( var i = 0; i < allEntries.length; i ++ ) {
        var tmpEntry = $(allEntries[i]);
        var entryPointInMs = parseInt(tmpEntry.attr('data-entrypoint'));

        if ( entryPointInMs > entryInMs ) {
            el.insertBefore(tmpEntry);
            elInjected = true;
            break;
        }
    }

    if ( !elInjected ) {
        innerViewport.append(el);
    }

    // Ensure size of element is correct
    fixSizeOfEntries(el);

    if ( nofocus !== true ) {
        focusToEntry(i);
    }
}


$('#add_item_button').hammer().on('tap', function(event) {
    entryPointInMs = new Date().getTime() - startAt;

    // Check if video is paused => subtract the pause duration from entryPointInMs
    if ( pauseAt != null ) {
        var diff = new Date().getTime() - pauseAt;
        entryPointInMs -= diff;
    }

    // Start listening for added content
    if ( timerForNewEntries == null ) {
        timerForNewEntries = setInterval(checkForNewEntriesToAdd, 200);
    }
});

innerViewport.parent().hammer({
    'swipe_velocity': 0.1
}).on('swiperight', function(event) {
    event.gesture.preventDefault();
    event.gesture.stopPropagation();
    focusToEntry(currentEntryInViewport - 1, true);
});

innerViewport.parent().hammer({
    'swipe_velocity': 0.1
}).on('swipeleft', function(event) {
    event.gesture.preventDefault();
    event.gesture.stopPropagation();
    focusToEntry(currentEntryInViewport + 1, true);
});


// Playback timer
var intervalTimer = setInterval(function() {
    updatePlaybackTimer();
}, 1000);

function updatePlaybackTimer( skipPauseCheck ) {

    // If video is paused => do nothing
    if ( skipPauseCheck === undefined && pauseAt != null ) {
        return;
    }

    var diff = new Date().getTime() - startAt;

    var diff_in_seconds = Math.round(diff / 1000);

    // Check if movie has ended
    if ( movie.duration_in_s !== undefined && diff_in_seconds > movie.duration_in_s ) {

        clearInterval(intervalTimer);
        clearInterval(entriesInterval);

        // Show popup that movie ended
        $('.movie_ended').remove();
        var popup = $("<div class='popup movie_ended'>"
                        + "<p>The movie has ended</p>"
                        + "<button class='btn first goback'><i class='fa fa-angle-double-left'></i> Go back</button>"
                        + "<button class='btn closepopup'>Close</button>"
                        + "<button class='btn replay'><i class='fa fa-repeat'></i> Replay</button>"
                    + "</div>").appendTo('body');
        popup.css({
            'top': ($(window).height() - popup.height()) / 2 - 38 + 'px'
        }).addClass('active').find('.closepopup').hammer().on('tap', function() {
            popup.remove();
        });
        popup.find('.replay').hammer().on('tap', function() {
            location.reload();
        });
        popup.find('.goback').hammer().on('tap', function() {
            steroids.layers.pop();
        });

        return;
    }

    var hours   = Math.floor(diff_in_seconds / 60 / 60) + '';
    var minutes = Math.floor(diff_in_seconds / 60) - (hours * 60) + '';
    var seconds = diff_in_seconds - ( minutes * 60 ) - (hours * 60 * 60) + '';

    if ( hours.length == 1 ) {
        hours = '0' + hours;
    }
    if ( minutes.length == 1 ) {
        minutes = '0' + minutes;
    }
    if ( seconds.length == 1 ) {
        seconds = '0' + seconds;
    }

    $('#playback_time').html('' + hours + ':' + minutes + ':' + seconds);

}

$('#play_pause_button').hammer().on('tap', function(event) {
    var el = $(this);

    var isPlaying = el.hasClass('fa-pause');

    if ( isPlaying ) {
        pauseAt = new Date().getTime();
        el.removeClass('fa-pause').addClass('fa-play');
    }

    else {
        var diff = new Date().getTime() - pauseAt;
        startAt += diff;
        pauseAt = null;
        el.removeClass('fa-play').addClass('fa-pause');
    }
});

function jumpToPosition ( positionInSeconds ) {

    if ( positionInSeconds < 0 ) {
        positionInSeconds = 0;
    }
    else if ( movie.duration_in_s !== undefined && positionInSeconds > movie.duration_in_s ) {
        positionInSeconds = movie.duration_in_s;
    }

    var positionInMs = positionInSeconds * 1000;

    // Update the visible timer to show correct time
    var nowInMs = new Date().getTime();
    startAt = nowInMs - positionInMs;

    if ( pauseAt != null ) {
        pauseAt = nowInMs;
    }

    checkForStreamEntriesToShow( true );
    updatePlaybackTimer( true );

}

var $timePopup = null;
$('#timeseek_btn').hammer().on('tap', function(e) {

    if ( $timePopup == null ) {
        $timePopup = $('#time_seek_popup');
        $timePopup.find('.cancel').hammer().on('tap', function() {
            $timePopup.removeClass('active');
        });
        $timePopup.find('.jump-btn').hammer().on('tap', function() {
            $timePopup.removeClass('active');

            var hours = parseInt($timePopup.find('#hours').val()) || 0;
            var minutes = parseInt($timePopup.find('#mins').val()) || 0;
            var seconds = parseInt($timePopup.find('#secs').val()) || 0;
            var positionInSeconds = hours * 60 * 60 + minutes * 60 + seconds;

            jumpToPosition( positionInSeconds );

            // Clear inputs
            $timePopup.find('input').val('');
        });
    }

    $timePopup.addClass('active');
});
