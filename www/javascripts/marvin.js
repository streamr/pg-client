/* exported marvin */
var marvin = (function ($) {
    "use strict";

    var baseUrl = 'http://marvin.thusoy.com';

    function errorHandler(errorText) {
        alert(errorText);
    }

    function setSearchResults(data){
        $('#searchResults').html(data);
    }

    var movies = (function () {
        var searchUrl = "http://www.omdbapi.com/";

        /*
        * Currently searches OMDb for data, should use our own api so that we can get the IDs
        */
        function search(searchTerm, callback) {
            $.ajax({
                url: searchUrl,
                data: {
                    's': searchTerm,
                },
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus) {
                    errorHandler(textStatus);
                }
            });
        }

        /*
        * Create a movie with the given data.
        * 
        */
        function create(data, callback){
            $.ajax({
                url: baseUrl + '/movies',
                type: 'POST',
                data: data,
                success: function (data) {
                    if (callback !== undefined) {
                        callback(data);
                    }
                },
                error: function (data, textStatus) {
                    errorHandler(textStatus);
                }
            });
        }


        function get(movieId, callback){
            $.ajax({
                url: baseUrl + '/movies/' + movieId,
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus) {
                    errorHandler(textStatus);
                }
            });
        }


        return {
            'search': search,
            'create': create,
        };

    })();

    var streams = (function () {

        function create(data, callback){
            $.ajax({
                url: baseUrl + '/streams',
                type: 'POST',
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus) {
                    errorHandler(textStatus);
                }
            });
        }

        function get(streamId, callback){
            $.ajax({
                url: baseUrl + '/streams/' + streamId,
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus) {
                    errorHandler(textStatus);
                }
            });
        }

        return {
            'create': create,
            'get': get,
        };

    })();

    return {
        'movies': movies,
        'streams': streams,
        'setMain': setSearchResults,
    };
})(jQuery);
