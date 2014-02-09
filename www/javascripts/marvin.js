/* exported marvin */
var marvin = (function ($) {
    "use strict";

    var baseUrl = 'https://marvin.thusoy.com';

    function errorHandler(errorText, errorThrown) {
        alert(errorText + ". " + errorThrown);
    }

    function setSearchResults(data){
        $('#searchResults').html(data);
    }

    var movies = (function () {
        var searchUrl = baseUrl + '/movies';

        /*
        * Currently searches OMDb for data, should use our own api so that we can get the IDs
        */
        function search(searchTerm, callback, searchRequest) {
            return $.ajax({
                url: searchUrl,
                beforeSend: function() {
                    // Abort previous request
                    if ( searchRequest != null ) {
                        searchRequest.abort();
                    }
                },
                data: {
                    'q': searchTerm,
                },
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus, errorThrown) {
                    if ( errorThrown != "abort" ) {
                        errorHandler(textStatus, errorThrown);
                    }
                }
            });
        }

        function get(url, callback){
            $.ajax({
                url: url,
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        return {
            'search': search,
            'get': get
        };

    })();

    var entries = (function () {

        function create(url, data, callback) {
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                headers: {
                    'Authorization': 'Token ' + getAuthToken()
                },
                success: function (data) {
                    if (callback !== undefined) {
                        callback(data);
                    }
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        function remove(url, callback) {
            $.ajax({
                url: url,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Token ' + getAuthToken()
                },
                success: function (data) {
                    if (callback !== undefined) {
                        callback(data);
                    }
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        function edit(url, data, callback) {
            $.ajax({
                url: url,
                type: 'PUT',
                data: data,
                headers: {
                    'Authorization': 'Token ' + getAuthToken()
                },
                success: function (data) {
                    if (callback !== undefined) {
                        callback(data);
                    }
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
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
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
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

        function create(url, data, callback){
            $.ajax({
                url: url,
                data: data,
                type: 'POST',
                headers: {
                    'Authorization': 'Token ' + getAuthToken()
                },
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        function get(url, callback){
            $.ajax({
                url: url,
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        function entries(url, callback) {
            $.ajax({
                url: url + '/entries',
                success: function (data) {
                    if (callback !== undefined) {
                        callback(data);
                    }
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        return {
            'create': create,
            'get': get,
            'entries': entries
        };

    })();

    var users = (function () {

        function create(data, callback){
            $.ajax({
                url: baseUrl + '/users',
                data: data,
                type: 'POST',
                success: function (data) {
                    if (callback !== undefined) {
                        callback(data);
                    }
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        function login(data, callback){
            $.ajax({
                url: baseUrl + '/login',
                data: data,
                type: 'POST',
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        function get(userId, callback){
            $.ajax({
                url: baseUrl + '/users/' + userId,
                success: function (data) {
                    callback(data);
                },
                error: function (data, textStatus, errorThrown) {
                    errorHandler(textStatus, errorThrown);
                }
            });
        }

        return {
            'create': create,
            'login': login,
            'get': get,
        };

    })();

    return {
        'movies': movies,
        'entries': entries,
        'streams': streams,
        'setMain': setSearchResults,
        'users': users
    };
})(jQuery);
