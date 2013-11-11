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
        var searchUrl = baseUrl + '/movies';

        /*
        * Currently searches OMDb for data, should use our own api so that we can get the IDs
        */
        function search(searchTerm, callback) {
            $.ajax({
                url: searchUrl,
                data: {
                    'q': searchTerm,
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

    var entries = (function () {

        function create(data, callback) {
            console.log("create");
            $.ajax({
                url: baseUrl + '/entries',
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

        function remove(url, callback) {
            $.ajax({
                url: url,
                type: 'DELETE',
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

        function edit(url, data, callback) {
            $.ajax({
                url: url,
                type: 'PUT',
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

        function get(url, callback) {
            $.ajax({
                url: url,
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

        return {
            'create': create,
            'remove': remove,
            'edit': edit,
            'get': get
        }

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

        function entries(streamId, callback) {
            $.ajax({
                url: baseUrl + '/streams/' + streamId + '/entries',
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

        return {
            'create': create,
            'get': get,
            'entries': entries
        };

    })();

    return {
        'movies': movies,
        'entries': entries,
        'streams': streams,
        'setMain': setSearchResults,
    };
})(jQuery);
