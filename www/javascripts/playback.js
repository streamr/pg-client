function messageReceived(event) {

    // check that the message is intended for us
    if ( event.data.recipient == "playback.html" ) {

        var data = JSON.parse(event.data.message);

        switch ( data.type ) {

            case 'create_entry':
                var entry_data = data.entry;
                entry_data.stream_url = streamUrl;
                entry_data.entry_point_in_ms = entryPointInMs;

                marvin.entries.create(entry_data, function(data) {
                    steroids.layers.pop();
                    showEntry(entry_data);
                });

                break;

        }   

    }
}
window.addEventListener("message", messageReceived);

function showEntry(data) {
    var renderedHtml = marvin.templates.text_entry(data);
    $('#content').append(renderedHtml);
}

streamr_init();

// need some global reference
var startAt;
var entryPointInMs;

(function ($, marvin) {
    "use strict";

    startAt = new Date().getTime();

    $('#add_item_button').hammer().on('tap', function(event) {
        entryPointInMs = new Date().getTime() - startAt; 
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
