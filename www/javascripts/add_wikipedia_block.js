streamrInit();

// Cache frequently accessed selector
var searchResultsEl = $('#search_results');

$('#keyword').on('keyup', function(event) {

    var keyword = $(this).val();

    $.ajax({
        'url': "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&namespace=0&suggest=",
        'dataType': 'jsonp',
        'data': {
            search: keyword
        },
        'success': function(data) {
            var results = data['1'];
            var renderedHtml = marvin.templates.wikipedia_search_results({
                'results': results
            });
            searchResultsEl.html( renderedHtml ).find('.search-result-wikipedia').hammer().on('tap', function(event) {
                var el = $(this);
                // Show preview
                localStorage.setItem("wikipediaArticleTitle", $.trim(el.html()));

                var webView = new steroids.views.WebView( "wikipedia_preview.html" );
                steroids.layers.push(webView);
            });
        }
    });

});

var articleTitle;
function showArticlePreview() {
    articleTitle = localStorage.getItem("wikipediaArticleTitle");

    // Fetch article from wikipedia
    $.ajax({
        'url': "http://en.wikipedia.org/w/api.php?action=parse&format=json",
        'dataType': 'jsonp',
        'data': {
            page: articleTitle,
            prop:"text",
            section:0
        },
        'success': function(data) {
            var tmpEl = $('<div />').html(data.parse.text['*']);

            var imageFound = false;
            if ( tmpEl.find('.infobox img:first').length > 0 ) {
                var src = tmpEl.find('.infobox img:first').attr('src');

                // Src without protocol doesn't work in phonegap
                if ( src.substring(0,2) == '//' ) {
                    src = 'http:' + src;
                }

                var img = $('<img />').attr('src', src);
                var imgContainer = $('<div class="img" />').html(img);
                imageFound = true;
            }

            // Some formatting
            tmpEl.find('> *:not(p)').remove();
            tmpEl.find('.reference').remove();
            tmpEl.find('.error').remove();
            tmpEl.find('sup').remove();

            // Remove links
            tmpEl.html( tmpEl.html().replace(/<a.*?>(.*?)<\/a>/g, "$1") )

            if ( imageFound ) {
                tmpEl.prepend(imgContainer);
            }

            $('#preview').html(tmpEl.html());

            // Show add btn
            $('#actions').show();
        }
    });

}

$('#add_story_btn').hammer().on('tap', function() {
    localStorage.setItem('newItemToAdd', JSON.stringify({
        'title': articleTitle,
        'content_type': 'wikipedia',
        'content': {
            'html': $('#preview').html()
        },
        'popups_to_close': 2
    }));
});
