'use strict';

var kiddifiedApp = angular.module('kiddifiedApp', [
    // common essential modules
    'ngAnimate',
    'ngStorage',
    'ngResource',
    'ui.router',
    'ui.router.util',
    'ui.jq',
    'ui.event',
    'ui.bootstrap',

    // page-specific and demo. may be removed
    'angular-bootstrap-select',
    'datatables',
    'datatables.bootstrap',
    'ui.calendar',

     // application libs
     'app.controllers',
     'app.services',
     'app.directives'
]);

kiddifiedApp.run(['AjaxServices', 'MsgServices', function(AjaxServices, MsgServices) {

    AjaxServices.session().success(function(res) {
        MsgServices.setMsg(res);
    });
}]);

kiddifiedApp.config(function($stateProvider, $urlRouterProvider){

    // For any unmatched url, send to /dashboard
    //$urlRouterProvider.otherwise("/app/dashboard/");
    $urlRouterProvider.otherwise('/app/landing/');

    $stateProvider
        .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'views/partials/app.html'
        })

        .state('app.landing', {
            url: '/landing',
            templateUrl: 'views/partials/landing.html'
        })

        //separate state for login & error pages
        .state('login', {
            url: '/login',
            templateUrl: 'views/partials/login.html',
            controller: 'LoginController'
        })

        .state('app.error', {
            url: '/error',
            templateUrl: 'views/partials/error.html'
        })

        // loading page templates dynamically
        .state('app.page', {
            url: '/:page/:child',
            params: {
                page: { value: null },
                child: { value: null }
            },
            resolve: {
                deps: ['scriptLoader', function(scriptLoader){
                    return scriptLoader;
                }]
            },
            templateProvider: function ($http, $stateParams, scriptLoader) {
                return $http.get('views/partials/' + $stateParams.page +
                    ( /*optional param*/ $stateParams.child ? "_" + $stateParams.child : "") + '.html')
                    .then(function(response) {
                        return scriptLoader.loadScriptTagsFromData(response.data);
                    })
                    .then(function(responseData){
                        return responseData;
                    });
            }
        })
});

kiddifiedApp.value('uiJqDependencies', {
    'mapael': [
        '/raphael/raphael-min.js',
        '/jQuery-Mapael/js/jquery.mapael.js'
    ],
    'easyPieChart': [
        '/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'
    ],
    'autosize': [
        '/jquery-autosize/jquery.autosize.min.js'
    ],
    'wysihtml5': [
        '/bootstrap3-wysihtml5/lib/js/wysihtml5-0.3.0.min.js',
        '/bootstrap3-wysihtml5/src/bootstrap3-wysihtml5.js'
    ],
    'select2': [
        '/select2/select2.min.js'
    ],
    'markdown': [
        '/markdown/lib/markdown.js',
        '/bootstrap-markdown/js/bootstrap-markdown.js'
    ],
    'datetimepicker': [
        '/moment/min/moment.min.js',
        '/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
    ],
    'colorpicker': [
        '/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js'
    ],
    'inputmask': [
        '/jasny-bootstrap/js/inputmask.js'
    ],
    'fileinput': [
        '/holderjs/holder.js',
        '/jasny-bootstrap/js/fileinput.js'
    ],
    'slider': [
        '/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js'
    ],
    'parsley': [
        '/parsleyjs/dist/parsley.min.js'
    ],
    'sortable': [
        '/jquery-ui/ui/core.js',
        '/jquery-ui/ui/widget.js',
        '/jquery-ui/ui/mouse.js',
        '/jquery-ui/ui/sortable.js',
        '/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js'
    ],
    'draggable': [
        '/jquery-ui/ui/core.js',
        '/jquery-ui/ui/widget.js',
        '/jquery-ui/ui/mouse.js',
        '/jquery-ui/ui/draggable.js'
    ],
    'nestable': [
        '/jquery.nestable/jquery.nestable.js'
    ],
    'vectorMap': [
        '/jvectormap/jquery-jvectormap-1.2.2.min.js',
        '/jvectormap-world/index.js'
    ],
    'sparkline': [
        '/jquery.sparkline/index.js'
    ],
    'magnificPopup': [
        '/magnific-popup/dist/jquery.magnific-popup.min.js'
    ]
});