(function ($, marvin) {
    "use strict";

    function addTextBlock() {
        var form = $('form');
        localStorage.setItem('newItemToAdd', JSON.stringify({
            'title': form.find('[name="title"]').val(),
            'content': form.find('[name="content"]').val()
        }));

        // Close this window
        steroids.layers.pop();
    }

    $('form').on('submit', function(event) {
        event.preventDefault();
        //addTextBlock();
    });
    $('form [type="submit"]').hammer().on('tap', addTextBlock);

})(jQuery, marvin);
