var movie = JSON.parse(localStorage.getItem("movieDetailsMovie")).movie;

var renderedHtml = marvin.templates.movie_details(movie);
$('#main_container').html(renderedHtml);

streamrInit();

// Update list of streams
marvin.movies.get(movie.href, function(data) {
    var renderedHtml = marvin.templates.movie_streams(data.movie);
    $('#stream_list').html(renderedHtml);
});
