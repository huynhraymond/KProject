'use strict';

var appControllers = angular.module('app.controllers', ['angularFileUpload']);

//settings and state
var app = {
    name: 'Kiddified',
    title: 'Kiddified',
    version: '1.0.0',
    /**
     * Whether to print and alert some log information
     */
    debug: true,
    /**
     * In-app constants
     */
    settings: {
        colors: {
            'white': '#fff',
            'black': '#000',
            'gray-light': '#999',
            'gray-lighter': '#eee',
            'gray': '#666',
            'gray-dark': '#343434',
            'gray-darker': '#222',
            'gray-semi-light': '#777',
            'gray-semi-lighter': '#ddd',
            'brand-primary': '#5d8fc2',
            'brand-success': '#64bd63',
            'brand-warning': '#f0b518',
            'brand-danger': '#dd5826',
            'brand-info': '#5dc4bf'
        },
        screens: {
            'xs-max': 767,
            'sm-min': 768,
            'sm-max': 991,
            'md-min': 992,
            'md-max': 1199,
            'lg-min': 1200
        },
        navCollapseTimeout: 2500
    },

    /**
     * Application state. May be changed when using.
     * Synced to Local Storage
     */
    state: {
        /**
         * whether navigation is static (prevent automatic collapsing)
         */
        'nav-static': false
    }
};

var Helpers = function(){
    this._initResizeEvent();
    this._initOnScreenSizeCallbacks();
};
Helpers.prototype = {
    _resizeCallbacks: [],
    _screenSizeCallbacks: {
        xs:{enter:[], exit:[]},
        sm:{enter:[], exit:[]},
        md:{enter:[], exit:[]},
        lg:{enter:[], exit:[]}
    },

    /**
     * Checks screen size according to Bootstrap default sizes
     * @param size screen size  ('xs','sm','md','lg')
     * @returns {boolean} whether screen is <code>size</code>
     */
    isScreen: function(size){
        var screenPx = window.innerWidth;
        return (screenPx >= app.settings.screens[size + '-min'] || size == 'xs') && (screenPx <= app.settings.screens[size + '-max'] || size == 'lg');
    },

    /**
     * Returns screen size Bootstrap-like string ('xs','sm','md','lg')
     * @returns {string}
     */
    getScreenSize: function(){
        var screenPx = window.innerWidth;
        if (screenPx <= app.settings.screens['xs-max']) return 'xs';
        if ((screenPx >= app.settings.screens['sm-min']) && (screenPx <= app.settings.screens['sm-max'])) return 'sm';
        if ((screenPx >= app.settings.screens['md-min']) && (screenPx <= app.settings.screens['md-max'])) return 'md';
        if (screenPx >= app.settings.screens['lg-min']) return 'lg';
    },

    /**
     * Specify a function to execute when window entered/exited particular size.
     * @param size ('xs','sm','md','lg')
     * @param fn callback(newScreenSize, prevScreenSize)
     * @param onEnter whether to run a callback when screen enters `size` or exits. true by default @optional
     */
    onScreenSize: function(size, fn, /**Boolean=*/ onEnter){
        onEnter = typeof onEnter !== 'undefined' ? onEnter : true;
        this._screenSizeCallbacks[size][onEnter ? 'enter' : 'exit'].push(fn)
    },

    /**
     * Change color brightness
     * @param color
     * @param ratio
     * @param darker
     * @returns {string}
     */
    //credit http://stackoverflow.com/questions/1507931/generate-lighter-darker-color-in-css-using-javascript
    changeColor: function(color, ratio, darker) {
        var pad = function(num, totalChars) {
            var pad = '0';
            num = num + '';
            while (num.length < totalChars) {
                num = pad + num;
            }
            return num;
        };
        // Trim trailing/leading whitespace
        color = color.replace(/^\s*|\s*$/, '');

        // Expand three-digit hex
        color = color.replace(
            /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
            '#$1$1$2$2$3$3'
        );

        // Calculate ratio
        var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
        // Determine if input is RGB(A)
            rgb = color.match(new RegExp('^rgba?\\(\\s*' +
                    '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                    '\\s*,\\s*' +
                    '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                    '\\s*,\\s*' +
                    '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                    '(?:\\s*,\\s*' +
                    '(0|1|0?\\.\\d+))?' +
                    '\\s*\\)$'
                , 'i')),
            alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
            decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
                /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                function() {
                    return parseInt(arguments[1], 16) + ',' +
                        parseInt(arguments[2], 16) + ',' +
                        parseInt(arguments[3], 16);
                }
            ).split(/,/),
            returnValue;

        // Return RGB(A)
        return !!rgb ?
            'rgb' + (alpha !== null ? 'a' : '') + '(' +
            Math[darker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ) +
            (alpha !== null ? ', ' + alpha : '') +
            ')' :
            // Return hex
            [
                '#',
                pad(Math[darker ? 'max' : 'min'](
                        parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                pad(Math[darker ? 'max' : 'min'](
                        parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                pad(Math[darker ? 'max' : 'min'](
                        parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                ).toString(16), 2)
            ].join('');
    },
    lightenColor: function(color, ratio) {
        return this.changeColor(color, ratio, false);
    },
    darkenColor: function(color, ratio) {
        return this.changeColor(color, ratio, true);
    },

    max: function(array) {
        return Math.max.apply(null, array);
    },

    min: function(array) {
        return Math.min.apply(null, array);
    },

    /**
     * Triggers sn:resize event. sn:resize is a convenient way to handle both window resize event and
     * sidebar state change.
     * Fired maximum once in 100 millis
     * @private
     */
    _initResizeEvent: function(){
        var resizeTimeout;

        $(window).on('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                $(window).trigger('sn:resize');
            }, 100);
        });
    },

    /**
     * Initiates an array of throttle onScreenSize callbacks.
     * @private
     */
    _initOnScreenSizeCallbacks: function(){
        var resizeTimeout,
            helpers = this,
            prevSize = this.getScreenSize();

        $(window).resize(function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                var size = helpers.getScreenSize();
                if (size != prevSize){ //run only if something changed
                    //run exit callbacks first
                    helpers._screenSizeCallbacks[prevSize]['exit'].forEach(function(fn){
                        fn(size, prevSize);
                    });
                    //run enter callbacks then
                    helpers._screenSizeCallbacks[size]['enter'].forEach(function(fn){
                        fn(size, prevSize);
                    });
                    console.log('screen changed. new: ' + size + ', old: ' + prevSize);
                }
                prevSize = size;
            }, 100);
        });
    }
};

app.helpers = new Helpers();

appControllers.controller('MainAppController', ['$scope', '$localStorage', 'MsgServices', 'AjaxServices',
    function ($scope, $localStorage, MsgServices, AjaxServices){
    $scope.app = app;
    if (angular.isDefined($localStorage.state)){
        $scope.app.state = $localStorage.state;
    } else {
        $localStorage.state = $scope.app.state;
    }

    $scope.loginUser = {};

    $scope.$watch(function() { return MsgServices.getMsg(); },
        function(newValue) {
            if ( newValue.username ) {      // Got user login
                $scope.loginUser = newValue;

                console.log($scope.loginUser);
            }

            else {

            }
        });

    $scope.logout = function() {
        AjaxServices.logout().success(function() {
            $scope.loginUser = {};
        });
    };

    $scope.print = function(){
        window.print();
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $scope.loginPage = toState.name == 'login';
        //$scope.errorPage = toState.name == 'error';
        $(document).trigger('sn:loaded', [event, toState, toParams, fromState, fromParams]);
    })
}]);

appControllers.controller('LoginController', ['$scope', 'AjaxServices', 'MsgServices', '$state',
    function($scope, AjaxServices, MsgServices, $state) {
    $scope.login = {};

    $scope.verify = function() {
        AjaxServices.login($scope.login).success(function (res) {

            MsgServices.setMsg(res);

            $state.go('app.landing');

        }).error(function(err) {
            console.log(err);
            MsgServices.setMsg(err);

            $state.go('app.error');
        });
    };

    $scope.cancel = function() {
        //console.log('State: ', $state.current.data);
        $state.go('app.landing');
    }
}]);

appControllers.controller('RegisterController', function($scope, AjaxServices, MsgServices, $state) {
    // Ensure the user validate his/her email and phone first
    //setRegisterValid(false);

    $scope.registeredUser = {};
    $scope.registeredUser.username = '';
    $scope.registeredUser.password = '';

    // Send email out to provided phone and email address to validate user's identity
    $scope.validate = function() {

        $scope.registeredUser.tel = $scope.registeredUser.tel.replace(/[^\d]/g, ''); // 4086009999

        /*
        if ( $scope.registeredUser.tel.length < 10 ) {
            MsgServices.setMsg({msg: messages.signup.phone});

            return;
        }

        if ( !$scope.registeredUser.email.indexOf('@') || !$scope.registeredUser.email.indexOf('.') ) {
            MsgServices.setMsg({msg: messages.signup.email});

            return;
        }
        */

        //$scope.validationId = uuid();
        $scope.validationId = 'ABCXYZ';
        var obj = { tel: $scope.registeredUser.tel,
            email: $scope.registeredUser.email,
            id: $scope.validationId };

        AjaxServices.validate(obj).success(function(res) {
            console.log(res);

            //MsgServices.setMsg({msg: messages.signup.post_validate});
            //setRegisterValid(true);
        });
    };

    $scope.register = function() {
        //$scope.validationId = "5e1e536a-dea4-4bb9-be81-bc648328bb87";
        //console.log($scope.registeredUser);
        //var msg = isRegisterValid($scope.registeredUser, $scope.validationId);

        /*
        // Form Registration Error
        if ( msg.length > 0 ) {
            MsgServices.setMsg({msg: msg});
            return;
        }
        */

        AjaxServices.register($scope.registeredUser).success(function() {
            //MsgServices.setMsg({msg: messages.signup.success});

            // Redirect to login page
            $state.go('login');

        }).error( function(err) {
            console.log(err);
            //MsgServices.setMsg({msg: err.message});
            return;
        });
    };

    $scope.cancel = function() {
        $state.go('/');
    }
});

appControllers.controller('MainController', ['$scope', 'MsgServices', 'AjaxServices',
    function($scope, MsgServices, AjaxServices) {
    $scope.loginUser = {};

    $scope.$watch(function() { return MsgServices.getMsg(); },
        function(newValue) {
            if ( newValue.username ) {   // Got authorized login user
                $scope.loginUser = newValue;
            }

            else {
                // newValue.msg
            }
        });

    $scope.logout = function() {
        AjaxServices.logout().success(function() {
            $scope.loginUser = {};
        });
    };
}]);

/**
 * GalleryAppController
 */
appControllers.controller('GalleryAppController', ['$scope', function ($scope) {

    $scope.items = [
        {
            "name":"Cutie",
            "groups":[
                "people"
            ],
            "src":"img/gallery/cuxi.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Mountains",
            "groups":[
                "nature"
            ],
            "src":"img/gallery/1.jpg",
            "date":"10 mins"
        },
        {
            "name":"Empire State Pigeon",
            "groups":[
                "people"
            ],
            "src":"img/gallery/2.jpg",
            "date":"1 hour",
            "like": true
        },
        {
            "name":"Big Lake",
            "groups":[
                "nature"
            ],
            "src":"img/gallery/3.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Forest",
            "groups":[
                "nature"
            ],
            "src":"img/gallery/4.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Smile",
            "groups":[
                "people"
            ],
            "src":"img/gallery/5.jpg",
            "date":"2 mins"
        },
        {
            "name":"Beach",
            "groups":[
                "nature"
            ],
            "src":"img/gallery/beach.jpg",
            "date":"2 mins"
        },
        {
            "name":"Smile",
            "groups":[
                "people"
            ],
            "src":"img/gallery/6.jpg",
            "date":"1 hour",
            "like": true
        },
        {
            "name":"Fog",
            "groups":[
                "nature"
            ],
            "src":"img/gallery/8.jpg",
            "date":"2 mins",
            "like": true
        },
        {
            "name":"Beach",
            "groups":[
                "people"
            ],
            "src":"img/gallery/9.jpg",
            "date":"2 mins"
        },
        {
            "name":"Pause",
            "groups":[
                "people"
            ],
            "src":"img/gallery/10.jpg",
            "date":"3 hour",
            "like": true
        },
        {
            "name":"Space",
            "groups":[
                "space"
            ],
            "src":"img/gallery/11.jpg",
            "date":"3 hour",
            "like": true
        },
        {
            "name":"Shuttle",
            "groups":[
                "space"
            ],
            "src":"img/gallery/13.jpg",
            "date":"35 mins",
            "like": true
        },
        {
            "name":"Sky",
            "groups":[
                "space"
            ],
            "src":"img/gallery/14.jpg",
            "date":"2 mins"
        }
    ];

    $scope.activeGroup = 'all';

    $scope.order = 'asc';

    $scope.$watch('activeGroup', function(newVal, oldVal){
        if (newVal == oldVal) return;
        $scope.$grid.shuffle( 'shuffle', newVal );
    });

    $scope.$watch('order', function(newVal, oldVal){
        if (newVal == oldVal) return;
        $scope.$grid.shuffle('sort', {
            reverse: newVal === 'desc',
            by: function($el) {
                return $el.data('title').toLowerCase();
            }
        });
    })
}]);

/**
 * Calendar mini-app
 */

appControllers.controller('CalendarAppController', ['$scope', '$modal', 'AjaxServices', 'DynamicTableServices', 'DynamicPaginationServices',
    function($scope, $modal, AjaxServices, DynamicTableServices, DynamicPaginationServices){
    $scope.uiConfig = {
        calendar:{
            header: {
                left: '',
                center: '',
                right: ''
            },
            selectable: true,
            selectHelper: true,
            select: function(start, end, allDay) {
                var modal = $modal.open({
                    templateUrl: 'createEventModal.html',
                    controller: 'CreateEventModalInstanceCtrl',
                    size: 'sm',
                    resolve: {
                        event: function(){
                            return {
                                start: start,
                                end: end,
                                allDay: allDay
                            }
                        }
                    }
                });

                modal.result.then($scope.addEvent, angular.noop);
            },
            editable: true,
            droppable:true,

            drop: function(date, allDay, event) { // this function is called when something is dropped
                // retrieve the dropped element's stored Event Object
                var originalEventObject = {
                    title: $.trim($(event.target).text()) // use the element's text as the event title
                };

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;

                var $categoryClass = $(event.target).data('event-class');
                if ($categoryClass)
                    copiedEventObject['className'] = [$categoryClass];

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $scope.eventsCalendar.fullCalendar('renderEvent', copiedEventObject, true);

                $(event.target).remove();

            },

            eventClick: function(event) {
                // opens events in a popup window
                $modal.open({
                    templateUrl: 'showEventModal.html',
                    controller: 'ShowEventModalInstanceCtrl',
                    size: 'sm',
                    resolve: {
                        event: function () {
                            return event;
                        }
                    }
                })
            }
        }
    };

    $scope.events = $scope.events || [];
    $scope.eventSources = [[]];

    $scope.addEvent = function (event) {

        var obj = event;

        obj.utc = +obj.start;
        obj.localTime = $.fullCalendar.formatDate(obj.start, "ddd MMM dd, yyyy");
        obj.backgroundColor = '#79a5f0';
        obj.textColor = '#fff';

        AjaxServices.addEvent(obj).success(function(result) {
            $scope.events.push(result);

            $scope.eventSources[0].push(result);

        }).error( function(err) {
            console.log(err);
        })
    };

    $scope.removeEvent = function(index, id) {

        AjaxServices.removeEvent(id).success(function() {
            $scope.events.splice(index, 1);
            $scope.eventSources[0].splice(index, 1);

        }).error(function(err) {
            console.log(err);
        });
    };

    $scope.changeView = function(view){
        $scope.eventsCalendar.fullCalendar( 'changeView', view )
    };

    $scope.currentMonth = function(){
        return $.fullCalendar.formatDate($scope.eventsCalendar.fullCalendar('getDate'), "MMM dd yyyy")
    };

    $scope.currentDay = function(){
        return $.fullCalendar.formatDate($scope.eventsCalendar.fullCalendar('getDate'), "dddd");
    };

    $scope.prev = function(){
        $scope.eventsCalendar.fullCalendar( 'prev' );
    };

    $scope.next = function(){
        $scope.eventsCalendar.fullCalendar( 'next' );
    };

    $.extend($.fn.dataTableExt.oPagination, DynamicPaginationServices);
/*
    $.extend( $.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function( oSettings, nPaging, fnDraw ) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function ( e ) {
                    e.preventDefault();
                    if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                        fnDraw( oSettings );
                    }
                };

                $(nPaging).append(
                    '<ul class="pagination no-margin">'+
                    '<li class="prev disabled"><a href="#">'+oLang.sPrevious+'</a></li>'+
                    '<li class="next disabled"><a href="#">'+oLang.sNext+'</a></li>'+
                    '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
                $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
            },

            "fnUpdate": function ( oSettings, fnDraw ) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                if ( oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                }
                else if ( oPaging.iPage <= iHalf ) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for ( i=0, ien=an.length ; i<ien ; i++ ) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                    // Add the new list items and their event handlers
                    for ( j=iStart ; j<=iEnd ; j++ ) {
                        sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                        $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                            .insertBefore( $('li:last', an[i])[0] )
                            .bind('click', function (e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                                fnDraw( oSettings );
                            } );
                    }

                    // Add / remove disabled classes from the static elements
                    if ( oPaging.iPage === 0 ) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }

                    if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            }
        }
    } );
*/
    $scope.dtOptions = DynamicTableServices([null,null,null, {"bSortable": false}, {"bSortable": false}]);

    /*
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withBootstrap()
        .withOption('sDom', "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>")
        .withOption('oLanguage', {
            "sLengthMenu": "_MENU_",
            "sInfo": "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries"
        })
        .withOption('sPaginationType', "bootstrap")
        .withOption('oClasses', {
            "sFilter": "pull-right",
            "sFilterInput": "form-control input-rounded ml-sm",
            "sWrapper": "dataTables_wrapper form-inline",
            "sLength": "dataTables_length blahblahcar"
        })
        .withOption('aoColumns', [null,null,null, {"bSortable": false}, {"bSortable": false}])
        //.withOption('aoColumns', [null,null,{"bSortable": false}])
        .withOption('initComplete', function(){
            //bad but creating a separate directive for demo is stupid
            $(".dataTables_length select").selectpicker({
                width: 'auto'
            });
        });
        */

    // Init function
    (function() {
        AjaxServices.getAllEvents().success(function(result) {
            //console.log('All result: ', result);
            $scope.events = result;
            $scope.eventSources[0] = [];            // Clear out the calendar
            $scope.events.map(function(event) {
                $scope.eventSources[0].push(event);
            });
        });
    })();
}]);

/**
 * Application (mini-application) controllers (eg. calendar, inbox)
 */

appControllers.controller('ShowEventModalInstanceCtrl', ['$scope', '$modalInstance', 'event', function ($scope, $modalInstance, event) {

    $scope.event = event;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

appControllers.controller('CreateEventModalInstanceCtrl', ['$scope', '$modalInstance', 'event', function ($scope, $modalInstance, event) {

    $scope.event = event;

    $scope.ok = function () {
        $modalInstance.close($scope.event);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

appControllers.controller('ModalInstanceCtrl', ['$scope', '$modalInstance',function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

appControllers.controller('ImageUploadController', ['$scope', 'AjaxServices', function($scope, AjaxServices) {
    $scope.images = [];

    $("input:file").change(function() {
        var files = [];
        for ( var i = 0; i < $(this).get(0).files.length; i++ ) {
            files.push($(this).get(0).files[i]);
        }

        // create a formdata object
        var formdata = files.reduce(function (formdata, file) {
            formdata.append('data', file);
            return formdata;
        }, new FormData());


        AjaxServices.uploadImage(formdata).success(function(res) {
            //console.log(res.data.name, res.data.path);

            $scope.images = res;

        }).error(function(err) {
            console.log(err);
        });
    });
}]);

appControllers.controller('SearchController', ['$scope', 'SearchServices', function($scope, SearchServices) {
    $scope.term = '';
    $scope.results = [];

    $scope.getSearch = function() {
        $scope.results = SearchServices.search($scope.term);

        console.log($scope.results);
        $scope.term = '';
    }
}]);

appControllers.controller('LandingController', ['$scope', '$resource', function($scope, $resource){

    $scope.items = $resource('fake_data/fake.json').query();

    $scope.activeGroup = 'all';

    $scope.order = 'asc';

    $scope.$watch('activeGroup', function(newVal, oldVal){
        if (newVal == oldVal) return;
        $scope.$grid.shuffle( 'shuffle', newVal );
    });

    $scope.$watch('order', function(newVal, oldVal){
        if (newVal == oldVal) return;
        $scope.$grid.shuffle('sort', {
            reverse: newVal === 'desc',
            by: function($el) {
                return $el.data('title').toLowerCase();
            }
        });
    })
}]);

/**
 * Dynamic datatable controller for service posted
 */
appControllers.controller('servicePostedCtrl', ['$scope', '$resource', 'DynamicTableServices', 'DynamicPaginationServices',
    function ($scope, $resource, DynamicTableServices, DynamicPaginationServices) {
    $.extend( $.fn.dataTableExt.oPagination, DynamicTableServices, DynamicPaginationServices);

    $scope.services = $resource('fake_data/fakePosted.json').query();

    $scope.dtOptions = DynamicTableServices([null,null,{"bSortable": false}, null, null, {"bSortable": false}])
}]);

/**
 * Dynamic datatable controller for service used
 */
appControllers.controller('serviceUsedCtrl', ['$scope', '$resource', 'DynamicTableServices', 'DynamicPaginationServices',
    function ($scope, $resource, DynamicTableServices, DynamicPaginationServices) {
    $.extend( $.fn.dataTableExt.oPagination, DynamicPaginationServices );

    $scope.services = $resource('fake_data/fakeUsed.json').query();

    $scope.dtOptions = DynamicTableServices([null,null,{"bSortable": false}, null, null, {"bSortable": false}]);
}]);
