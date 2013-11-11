(function ($, marvin) {
    "use strict";

    function create_stream() {
        var form = $('#create_stream_form');

        marvin.streams.create({
        }, function(data) {

        });
    }

    $('#create_stream_form').on('submit', function(event) {
        create_stream();
    });

    $('#create_stream_form [type="submit"]').hammer().on('tap', function(event) {
        create_stream();
    });

})(jQuery, marvin);

