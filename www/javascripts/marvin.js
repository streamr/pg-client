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
        function search(searchTerm, callback) {
            $.ajax({
                url: searchUrl,
                data: {
                    'q': searchTerm,
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

    return {
        'movies': movies,
        'entries': entries,
        'streams': streams,
        'setMain': setSearchResults,
    };
})(jQuery);
