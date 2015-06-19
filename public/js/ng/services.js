'use strict';

/* Services */

// Define your services here if necessary
var appServices = angular.module('app.services', []);

// This is a factory function that will return a service (singleton object)
appServices.factory('AjaxServices', ['$http', '$q', function($http, $q) {
    return {
        register: function (user) {
            return $http.post('/access/register', user);
        },

        login: function (user) {
            return $http.post('/access/login', user);
        },

        logout: function() {
            return $http.get('/access/logout');
        },

        validate: function(data) {
            return $http.post('/access/validate', data);
        },

        session: function() {
            return $http.get('/access/session');
        },

        addEvent: function(obj) {
            return $http.post('/database/event', obj);
            /*
            console.log('service:', obj);
            var xhr = new XMLHttpRequest();

            xhr.open('POST', '/database/newevent');

            xhr.addEventListener('readystatechange', function() {
                if ( xhr.readyState === 4 ) {
                    console.log(xhr.responseText);
                }
            });

            xhr.send(obj);      */
        },

        getAllEvents: function() {
            return $http.get('/database/allevents');
        },

        /*
         Angular’s default transformRequest function will try to serialize our FormData object,
         so we override it with the identity function to leave the data intact.

         Angular’s default Content-Type header for POST and PUT requests is application/json,
         so we want to change this, too. By setting ‘Content-Type’: undefined,
         the browser sets the Content-Type to multipart/form-data for us and fills in the correct boundary.
         Manually setting ‘Content-Type’: multipart/form-data will fail to fill in the boundary parameter of the request.
         */

        uploadImage: function(obj) {
            return $http.post('/database/uploadImage', obj, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }
        /*
        uploadImage: function(obj) {
            return $q(function( resolve, reject ) {
                $http.post('/database/uploadImage', obj, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(data) {
                    resolve(data);
                }).error(function() {
                    reject();
                })
            })
        }       */
    }
}]);

appServices.factory('AuthServices', ['AjaxServices', function(AjaxServices) {
    var authUser = {};

    return {
        session: function() {
            AjaxServices.session().success(function(res) {
                //console.log('User: ', res);
                authUser.username = res.username;
                authUser.email = res.email;
                authUser.tel = res.tel;
            });
        },

        login: function() {
            AjaxServices.login(loginObj).success( function(res) {
                authUser.username = res.username;
                authUser.email = res.email;
                authUser.tel = res.tel;

            }).error(function(err) {
                authUser = {};
                authUser.msg = err;
            });
        },

        logout: function() {
            AjaxServices.logout().success(function() {
                authUser = {};
                authUser.msg = {status: 'Logout Success'}
            });
        },

        getAuthUser: function() {
            return authUser;
        }
    }
}]);

appServices.factory('MsgServices', function() {
    var msg = {};

    return {
        getMsg: function() {
            return msg;
        },

        setMsg: function(data) {
            msg = data;
        }
    }
});

appServices.factory('SearchServices', function() {
    var items = [
        {
            "name":"Cutie",
            "category":[
                "people"
            ],
            "src":"img/gallery/cuxi.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Mountains",
            "category":[
                "nature"
            ],
            "src":"img/gallery/1.jpg",
            "date":"10 mins"
        },
        {
            "name":"Empire State Pigeon",
            "category":[
                "people"
            ],
            "src":"img/gallery/2.jpg",
            "date":"1 hour",
            "like": true
        },
        {
            "name":"Big Lake",
            "category":[
                "nature"
            ],
            "src":"img/gallery/3.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Forest",
            "category":[
                "nature"
            ],
            "src":"img/gallery/4.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Smile",
            "category":[
                "people"
            ],
            "src":"img/gallery/5.jpg",
            "date":"2 mins"
        },
        {
            "name":"Beach",
            "category":[
                "nature"
            ],
            "src":"img/gallery/beach.jpg",
            "date":"2 mins"
        },
        {
            "name":"Smile",
            "category":[
                "people"
            ],
            "src":"img/gallery/6.jpg",
            "date":"1 hour",
            "like": true
        },
        {
            "name":"Fog",
            "category":[
                "nature"
            ],
            "src":"img/gallery/8.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Beach",
            "category":[
                "people"
            ],
            "src":"img/gallery/9.jpg",
            "date":"2 mins"
        },
        {
            "name":"Pause",
            "category":[
                "people"
            ],
            "src":"img/gallery/10.jpg",
            "date":"3 hour",
            "like": true
        },
        {
            "name":"Space",
            "category":[
                "space"
            ],
            "src":"img/gallery/11.jpg",
            "date":"3 hour",
            "like": true
        },
        {
            "name":"Shuttle",
            "category":[
                "space"
            ],
            "src":"img/gallery/13.jpg",
            "date":"35 mins",
            "like": true
        },
        {
            "name":"Sky",
            "category":[
                "space"
            ],
            "src":"img/gallery/14.jpg",
            "date":"2 mins"
        }
    ];

    var key = 'people';
    function filterByKey(obj) {
        if ( 'category' in obj ) {
            for ( var i = 0, len = obj.category.length; i < len; i++ ) {
                if (obj.category[i] == key) return true;
            }
        }

        return false;
    }

    return {
        search: function(item) {
            key = item;
            var results = items.filter(filterByKey);

            return results;
        }
    }
});

/**
 * Override default angular exception handler to log and alert info if debug mode
 */
appServices.factory('$exceptionHandler', function ($log) {
    return function (exception, cause) {
        var errors = JSON.parse(localStorage.getItem('sing-angular-errors')) || {};
        errors[new Date().getTime()] = arguments;
        localStorage.setItem('sing-angular-errors', JSON.stringify(errors));
        app.debug && $log.error.apply($log, arguments);
        app.debug && alert('check errors');
    };
});

/**
 * Sing Script loader. Loads script tags asynchronously and in order defined in a page
 */
appServices.factory('scriptLoader', ['$q', '$timeout', function($q, $timeout) {

    /**
     * Naming it processedScripts because there is no guarantee any of those have been actually loaded/executed
     * @type {Array}
     */
    var processedScripts = [];
    return {
        /**
         * Parses 'data' in order to find & execute script tags asynchronously as defined.
         * Called for partial views.
         * @param data
         * @returns {*} promise that will be resolved when all scripts are loaded
         */
        loadScriptTagsFromData: function(data) {
            var deferred = $q.defer();
            var $contents = $($.parseHTML(data, document, true)),
                $scripts = $contents.filter('script[data-src][type="text/javascript-lazy"]').add($contents.find('script[data-src][type="text/javascript-lazy"]')),
                scriptLoader = this;

            scriptLoader.loadScripts($scripts.map(function(){ return $(this).attr('data-src')}).get())
                .then(function(){
                    deferred.resolve(data);
                });

            return deferred.promise;
        },


        /**
         * Sequentially and asynchronously loads scripts (without blocking) if not already loaded
         * @param scripts an array of url to create script tags from
         * @returns {*} promise that will be resolved when all scripts are loaded
         */
        loadScripts: function(scripts) {
            var previousDefer = $q.defer();
            previousDefer.resolve();
            scripts.forEach(function(script){
                if (processedScripts[script]){
                    if (processedScripts[script].processing){
                        previousDefer = processedScripts[script];
                    }
                    return
                }

                var scriptTag = document.createElement('script'),
                    $scriptTag = $(scriptTag),
                    defer = $q.defer();
                scriptTag.src = script;
                defer.processing = true;

                $scriptTag.load(function(){
                    $timeout(function(){
                        defer.resolve();
                        defer.processing = false;
                        Pace.restart();
                    })
                });

                previousDefer.promise.then(function(){
                    document.body.appendChild(scriptTag);
                });

                processedScripts[script] = previousDefer = defer;
            });

            return previousDefer.promise;
        }
    }
}]);