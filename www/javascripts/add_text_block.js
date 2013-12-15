(function ($, marvin) {
    "use strict";

    function addTextBlock() {
        var form = $('form');
        localStorage.setItem('newItemToAdd', JSON.stringify({
            'title': form.find('[name="title"]').val(),
            'content_type': 'text',
            'content': {
                'text': form.find('[name="content"]').val()
            },
            'popups_to_close': 1
        }));
    }

    $('form').on('submit', function(event) {
        event.preventDefault();
        //addTextBlock();
    });
    $('form [type="submit"]').hammer().on('tap', addTextBlock);

})(jQuery, marvin);
