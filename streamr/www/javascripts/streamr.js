$(document).ready(function($) {

    $('#search_results > div').hammer().on('tap', function(event) {
        window.location='movie_details.html';
        event.preventDefault();
        return false;
    });

    $('button.back').hammer().on('tap', function(event) {
        window.history.back();
        event.preventDefault();
        return false;
    });

    $('#add_item_button').hammer().on('tap', function(event) {
        var webView = new steroids.views.WebView("add_item.html");
        //webView.preload();
        steroids.modal.show(webView);
    }); 

});
