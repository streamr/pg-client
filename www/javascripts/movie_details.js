var movie = JSON.parse(localStorage.getItem("movieDetailsMovie")).movie;

var renderedHtml = marvin.templates.movie_details(movie);
$('#main_container').html(renderedHtml);

streamrInit();

var movieInfo;
var streamListEl = $('#stream_list');

// Update list of streams
marvin.movies.get(movie.href, function(data) {
    movieInfo = data.movie;
    var renderedHtml = marvin.templates.movie_streams(data.movie);

    streamListEl.html(renderedHtml);

    if ( data.movie.streams.length > 0 ) {
        // Make sure checkboxes are selected immediately
        streamListEl.find('input[type="checkbox"], label').on('click', function(e) {
            e.preventDefault();
        });
        streamListEl.find('> div').hammer().on('tap', function(event) {
            var input = $(this).find('input[type="checkbox"]').get(0);
            input.checked = !input.checked;
        });
    }
});


$('#start_playing_button').hammer().on('tap', function(event) {

    var selectedStreams = [];
    streamListEl.find('input:checked').each(function() {
        selectedStreams.push(movieInfo.streams[ $(this).parents('div:first').index() ]);
    });

    // Must select at least one stream before playback can start
    if ( selectedStreams.length == 0 ) {
        alert("You must select at least one stream to watch!");
        return;
    }

    // Save to localStorage info about the selected streams
    localStorage.setItem("selectedStreams", JSON.stringify(selectedStreams));

    // Load the playback view
    var webView = new steroids.views.WebView( "playback.html" );
    steroids.layers.push(webView);

});

