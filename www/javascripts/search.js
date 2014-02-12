(function ($, marvin) {
    "use strict";

    // Need to keep track of this, because otherwise
    // tapping a movie when the settings drawer is open
    // will cause the movie to be opened (when we only
    // wanted to close the drawer)
    var hideDrawerTouch = false;

    var $searchField = $('.movie-search');
    $searchField.on('keyup', searchMovies);

    var searchRequest = null;
    function searchMovies() {
        var searchQuery = $searchField.val();
        searchRequest = marvin.movies.search(searchQuery, function (response) {
            var renderedHtml = marvin.templates.movies(response);
            $('#search_results').html(renderedHtml);
            scaleStreamCount();
            var search_results = {}; // we will save all results here, so we later reference it

            // Loop through all results and assign them in a dictionary
            for ( var i = 0; i < response.movies.length; i ++ ) {
                search_results[response.movies[i].href] = response.movies[i];
            }

            // When search result is tapped => show details about movie
            $('#search_results > div').hammer().on('tap', function(e) {

                if ( hideDrawerTouch ) return;

                var el = $(this);

                // Check if drawer is open => just close it and do nothing else
                if ( drawerOpen ) {
                    hideDrawer();
                    return;
                }

                // Give touch feedback
                el.addClass('active');
                window.setTimeout(function() {
                    el.removeClass('active');
                }, touchFeedbackDelay);

                localStorage.setItem("movieDetailsMovie", JSON.stringify({
                    'movie': search_results[el.attr('data-movie-url')]
                }));

                var webView = new steroids.views.WebView("movie_details.html");
                steroids.layers.push(webView);
            });

        }, searchRequest);
    }

    function scaleStreamCount() {
        var $elem = $('.movie-stream-count');
        var fontSize = 65;
        var ourText = $('span:visible:first', $elem);
        var maxHeight = $elem.height();
        var maxWidth = $elem.width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
    }

    $(window).resize(scaleStreamCount);

    // Show most popular movies (in terms of number of streams) on startup
    $(document).ready(function () {
        searchMovies();
    });

    function refreshSettingsPage() {

        // Set content for settings page
        var renderedHtml = marvin.templates.settings({
            'user': getUser()
        });

        var $settingsBody = $('#settings_body');

        $settingsBody.html(renderedHtml).find('#logout_btn').hammer().on('tap', function() {
            logoutUser();
            refreshSettingsPage();
        });

        var notificationLevel = localStorage.getItem("notificationLevel") || "none";
        $settingsBody.find('#notificationLevel').val(notificationLevel).on('change', function(e) {
            localStorage.setItem("notificationLevel", $(this).val());
        });

        streamrInit($settingsBody);

    }
    refreshSettingsPage();

    // Show/hide settings page
    var mainContentEl = $('#main-content');
    var bodyEl = $('body');

    var drawerPosition = null;
    var drawerOpen = false;

    function showDrawer() {
        $('input').blur();

        if ( drawerPosition == null ) {
            var menuButton = $('#menu-button');
            drawerPosition = $(window).width() - (menuButton.offset().left + menuButton.width() + 40);
            $('#settings').width(drawerPosition - 1);
        }

        mainContentEl.css('transform', 'translate3d(' + drawerPosition + 'px,0,0)');
        drawerOpen = true;
    }

    function hideDrawer() {
        mainContentEl.css('transform', 'translate3d(0px,0,0)');
        drawerOpen = false;
    }

    $('#menu-button').on('touchstart', function(e) {
        // Otherwise the drawer is "double" closed
        e.preventDefault();
        e.stopPropagation();
    }).hammer({
        'prevent_default': true,
    }).on('tap', function(e) {
        if ( drawerOpen ) {
            hideDrawer();
        }
        else {
            showDrawer();
        }
    });

    mainContentEl.on('touchstart', function(e) {
        if ( drawerOpen ) {
            hideDrawer();
            hideDrawerTouch = true;
            setTimeout(function() {
                hideDrawerTouch = false;
            }, 200);
        }
    });

    $('#settings').on('touchmove', function(e) {
        e.preventDefault();
    });

    // Need to update page content when coming back from other pages
    document.addEventListener("visibilitychange", function() {
        if ( document.visibilityState == "visible" ) {
            refreshSettingsPage();
        }
    }, false);

})(jQuery, marvin);
