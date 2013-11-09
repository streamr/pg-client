$(document).ready(function($) {

    $('#search_results > div').hammer().on('tap', function(event) {
        window.location='playback.html';
        event.preventDefault();
        return false;
    });

    $('button.back').hammer().on('tap', function(event) {
        window.history.back();
        event.preventDefault();
        return false;
    });

});
