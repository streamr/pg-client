$('#add_content_buttons [data-url]').hammer().on('tap', function(event) {
    window.location = $(this).attr('data-url');
});
