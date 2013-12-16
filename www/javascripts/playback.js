// Get the movie from localStorage
var movie = JSON.parse(localStorage.getItem("movieDetailsMovie")).movie;
var selectedStreams = JSON.parse(localStorage.getItem('selectedStreams'));

// If we are creating a new stream
var newStream = JSON.parse(localStorage.getItem("playBackNewStream"));
if ( newStream != null ) {
    // Make sure we remove the stream in localStorage
    localStorage.removeItem("playBackNewStream");
}

// need some global references
var pauseAt = null;
var startAt = new Date().getTime();
var entryPointInMs;

// Keep track of which element is currently viewed
var currentEntryInViewport;

var renderedHtml = marvin.templates.playback({
    movie: movie,
    newStream: newStream
});

$('#container').html(renderedHtml);

streamrInit();

// Cache some selectors
var innerViewport = $('#content #inner_viewport');

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
    var entryWidth = $(window).width() - 30; // -30 px because of padding of parent element

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
var timerForNewEntries;
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

        data.content = JSON.stringify(data.content);

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

// Show stream entries
function checkForStreamEntriesToShow() {

    // If video is paused => do nothing
    if ( pauseAt != null ) {
        return;
    }

    var playbackPosition = getCurrentPlaybackPosition();

    for ( var i = 0; i < sortedEntries.length; i ++ ) {

        if ( sortedEntries[i].entry.entry_point_in_ms <= playbackPosition ) {
            var entry = sortedEntries.shift();
            showEntry({
                'streamName': selectedStreams[entry.streamIndex].name,
                'entry': entry.entry
            });
        }

        else {
            break;
        }
    }
}
setInterval(checkForStreamEntriesToShow, 500);

function focusToEntry(index) {
    innerViewport.css({
        // Focus viewport to the wanted entry
        'right': index * $(window).width() + 'px'
    });
}

function showEntry(data) {

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
    innerViewport.append(el);
    // Ensure size of element is correct
    fixSizeOfEntries(el);

    currentEntryInViewport = innerViewport.find('> div').length - 1;

    focusToEntry(currentEntryInViewport);
}


$('#add_item_button').hammer().on('tap', function(event) {
    entryPointInMs = new Date().getTime() - startAt;

    // Start listening for added content
    timerForNewEntries = window.setInterval(checkForNewEntriesToAdd, 200);
});

innerViewport.parent().hammer({
    'swipe_velocity': 0.2
}).on('swiperight', function(event) {
    currentEntryInViewport --;
    focusToEntry(currentEntryInViewport);
});

innerViewport.parent().hammer({
    'swipe_velocity': 0.2
}).on('swipeleft', function(event) {
    currentEntryInViewport ++;
    focusToEntry(currentEntryInViewport);
});


// Playback timer
setInterval(function() {

    // If video is paused => do nothing
    if ( pauseAt != null ) {
        return;
    }

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
