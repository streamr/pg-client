(function ($, marvin) {
    "use strict";

    function addTextBlock() {
        var form = $('form');
        window.postMessage({
            'recipient': 'playback.html',
            'message': JSON.stringify({
                'type': 'create_entry',
                'entry': {
                    'title': form.find('[name="title"]').val(),
                    'content': form.find('[name="content"]').val()
                }
            })
        });
    }

    $('form').on('submit', function(event) {
        event.preventDefault();
        addTextBlock();
    });
    $('form [type="submit"]').hammer().on('tap', addTextBlock);

})(jQuery, marvin);
