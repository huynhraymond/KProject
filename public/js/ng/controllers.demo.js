'use strict';

/**
 * Demo controllers. To remove when used in real app
 */

/**
 * Each demo page may have a global controller to collect demo data in one place
 */

/**
 * form_elements page controller
 */
appControllers.controller('FormElementsDemoController', ['$scope', function($scope){
    var bs3Wysihtml5Templates = {
        "emphasis": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'><i class='glyphicon glyphicon-bold'></i></a>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'><i class='glyphicon glyphicon-italic'></i></a>" +
                "</div>" +
                "</li>";
        },
        "link": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                ""+
                "<div class='bootstrap-wysihtml5-insert-link-modal modal fade'>" +
                "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                "<div class='modal-header'>" +
                "<a class='close' data-dismiss='modal'>&times;</a>" +
                "<h4>" + locale.link.insert + "</h4>" +
                "</div>" +
                "<div class='modal-body'>" +
                "<input value='http://' class='bootstrap-wysihtml5-insert-link-url form-control'>" +
                "<label class='checkbox'> <input type='checkbox' class='bootstrap-wysihtml5-insert-link-target' checked>" + locale.link.target + "</label>" +
                "</div>" +
                "<div class='modal-footer'>" +
                "<button class='btn btn-default' data-dismiss='modal'>" + locale.link.cancel + "</button>" +
                "<button href='#' class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-command='createLink' title='" + locale.link.insert + "' tabindex='-1'><i class='fa fa-share'></i></a>" +
                "</li>";
        },
        "html": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn btn-" + size + " btn-default' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><i class='fa fa-pencil'></i></a>" +
                "</div>" +
                "</li>";
        }
    };
    $scope.wysihtml5Options = {
        html: true,
        customTemplates: bs3Wysihtml5Templates,
        stylesheets: []
    };

    $scope.dtChanged = function(dt){
        alert('Angular model changed to: ' + dt);
    };
}]);

/**
 * charts page controller
 */
appControllers.controller('ChartsDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    $scope.data1 = [
        [1, 20],
        [2, 20],
        [3, 40],
        [4, 30],
        [5, 40],
        [6, 35],
        [7, 47]
    ];
    $scope.data2 = [
        [1, 13],
        [2, 8],
        [3, 17],
        [4, 10],
        [5, 17],
        [6, 15],
        [7, 16]
    ];
    $scope.data3 = [
        [1, 23],
        [2, 13],
        [3, 33],
        [4, 16],
        [5, 32],
        [6, 28],
        [7, 31]
    ];

    $scope.applyRickshawData = function(){
        $scope.seriesData = [ [], [] ];
        $scope.random = new Rickshaw.Fixtures.RandomData(30);

        for (var i = 0; i < 30; i++) {
            $scope.random.addData($scope.seriesData);
        }
        $scope.series = [
            {
                color: '#96E593',
                data: $scope.seriesData[0],
                name: 'Uploads'
            }, {
                color: '#ecfaec',
                data: $scope.seriesData[1],
                name: 'Downloads'
            }
        ];
    };

    scriptLoader.loadScripts([
        'd3/d3.min.js',
        'rickshaw/rickshaw.min.js'
    ])
        .then(function(){
            $scope.applyRickshawData()
        });


    $scope.sparklineCompositeData = [[2,4,6,2,7,5,3,7,8,3,6], [5,3,7,8,3,6,2,4,6,2,7]];
    $scope.sparklineCompositeOptions = [{
        width: '100%',
        fillColor: '#ddd',
        height: '100px',
        lineColor: 'transparent',
        spotColor: '#c0d0f0',
        minSpotColor: null,
        maxSpotColor: null,
        highlightSpotColor: '#ddd',
        highlightLineColor: '#ddd'
    }, {
        lineColor: 'transparent',
        spotColor: '#c0d0f0',
        fillColor: 'rgba(192, 208, 240, 0.76)',
        minSpotColor: null,
        maxSpotColor: null,
        highlightSpotColor: '#ddd',
        highlightLineColor: '#ddd'
    }];

    $scope.sparklinePieData = [2,4,6];
    $scope.sparklinePieOptions = {
        type: 'pie',
        width: '100px',
        height: '100px',
        sliceColors: ['#F5CB7B', '#FAEEE5', '#f0f0f0']
    };

    $scope.applyNvd3Data = function(){
        /* Inspired by Lee Byron's test data generator. */
        function _stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(function(d, i) {
                    return {x: i, y: Math.max(0, d)};
                });
            });
        }

        function testData(stream_names, pointsCount) {
            var now = new Date().getTime(),
                day = 1000 * 60 * 60 * 24, //milliseconds
                daysAgoCount = 60,
                daysAgo = daysAgoCount * day,
                daysAgoDate = now - daysAgo,
                pointsCount = pointsCount || 45, //less for better performance
                daysPerPoint = daysAgoCount / pointsCount;
            return _stream_layers(stream_names.length, pointsCount, .1).map(function(data, i) {
                return {
                    key: stream_names[i],
                    values: data.map(function(d,j){
                        return {
                            x: daysAgoDate + d.x * day * daysPerPoint,
                            y: Math.floor(d.y * 100) //just a coefficient,
                        }
                    })
                };
            });
        }

        $scope.nvd31Chart = nv.models.lineChart()
            .useInteractiveGuideline(true)
            .margin({left: 28, bottom: 30, right: 0})
            .color(['#82DFD6', '#ddd']);

        $scope.nvd31Chart.xAxis
            .showMaxMin(false)
            .ticks(1000)
            .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

        $scope.nvd31Chart.yAxis
            .showMaxMin(false)
            .ticks(0)
            .tickFormat(d3.format(',f'));

        $scope.nvd31Data = testData(['Search', 'Referral'], 50).map(function(el, i){
            el.area = true;
            return el;
        });

        $scope.nvd32Chart = nv.models.multiBarChart()
            .margin({left: 28, bottom: 30, right: 0})
            .color(['#F7653F', '#ddd']);

        $scope.nvd32Chart.xAxis
            .showMaxMin(false)
            .ticks(1000)
            .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

        $scope.nvd32Chart.yAxis
            .showMaxMin(false)
            .ticks(0)
            .tickFormat(d3.format(',f'))

        $scope.nvd32Data = testData(['Uploads', 'Downloads'], 10).map(function(el, i){
            el.area = true;
            return el;
        });
    };

    scriptLoader.loadScripts([
        'd3/d3.min.js',
        'nvd3/build/nv.d3.min.js'
    ])
        .then(function(){
            $scope.applyNvd3Data()
        });

    $scope.morris1Options = {
        resize: true,
        data: [
            { y: '2006', a: 100, b: 90 },
            { y: '2007', a: 75,  b: 65 },
            { y: '2008', a: 50,  b: 40 },
            { y: '2009', a: 75,  b: 65 },
            { y: '2010', a: 50,  b: 40 },
            { y: '2011', a: 75,  b: 65 },
            { y: '2012', a: 100, b: 90 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        lineColors: ['#88C4EE', '#ccc']
    };

    $scope.morris2Options = {
        resize: true,
        data: [
            { y: '2006', a: 100, b: 90 },
            { y: '2007', a: 75,  b: 65 },
            { y: '2008', a: 50,  b: 40 },
            { y: '2009', a: 75,  b: 65 },
            { y: '2010', a: 50,  b: 40 },
            { y: '2011', a: 75,  b: 65 },
            { y: '2012', a: 100, b: 90 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        lineColors: ['#80DE78', '#9EEE9B'],
        lineWidth: 0
    };

    $scope.morris3Options = {
        data: [
            {label: "Download Sales", value: 12},
            {label: "In-Store Sales", value: 30},
            {label: "Mail-Order Sales", value: 20}
        ],
        colors: ['#F7653F', '#F8C0A2', '#e6e6e6']
    };

    var bar_customised_1 = [[1388534400000, 120], [1391212800000, 70],  [1393632000000, 100], [1396310400000, 60], [1398902400000, 35]];
    var bar_customised_2 = [[1388534400000, 90], [1391212800000, 60], [1393632000000, 30], [1396310400000, 73], [1398902400000, 30]];
    var bar_customised_3 = [[1388534400000, 80], [1391212800000, 40], [1393632000000, 47], [1396310400000, 22], [1398902400000, 24]];

    $scope.flotBarsData = [
        {
            label: "Apple",
            data: bar_customised_1,
            bars: {
                show: true,
                barWidth: 12*24*60*60*300,
                fill: true,
                lineWidth:0,
                order: 1
            }
        },
        {
            label: "Google",
            data: bar_customised_2,
            bars: {
                show: true,
                barWidth: 12*24*60*60*300,
                fill: true,
                lineWidth: 0,
                order: 2
            }
        },
        {
            label: "Facebook",
            data: bar_customised_3,
            bars: {
                show: true,
                barWidth: 12*24*60*60*300,
                fill: true,
                lineWidth: 0,
                order: 3
            }
        }

    ];

    $scope.flotBarsOptions = {
        series: {
            bars: {
                show: true,
                barWidth: 12*24*60*60*350,
                lineWidth: 0,
                order: 1,
                fillColor: {
                    colors: [{
                        opacity: 1
                    }, {
                        opacity: 0.7
                    }]
                }
            }
        },
        xaxis: {
            mode: "time",
            min: 1387497600000,
            max: 1400112000000,
            tickLength: 0,
            tickSize: [1, "month"],
            axisLabel: 'Month',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 13,
            axisLabelPadding: 15
        },
        yaxis: {
            axisLabel: 'Value',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 13,
            axisLabelPadding: 5
        },
        grid: {
            hoverable: true,
            borderWidth: 0
        },
        legend: {
            backgroundColor: "transparent",
            labelBoxBorderColor: "none"
        },
        colors: ["#64bd63", "#f0b518", "#F7653F"]
    }
}]);

/**
 * ui_components page controller
 */
appControllers.controller('UiComponentsDemoController', ['$scope', '$sce',function($scope, $sce){
    $scope.alerts = [
        { type: 'success', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Success:</span> You successfully read this important alert message.') },
        { type: 'info', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Info:</span> This alert needs your attention, but it\'s not super important.') },
        { type: 'warning', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Warning:</span> Best check yo self, you\'re not looking too good.') },
        { type: 'danger', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Danger:</span> Change this and that and try again. \
                                <a class="btn btn-default btn-xs pull-right mr" href="#">Ignore</a> \
                                <a class="btn btn-danger btn-xs pull-right mr-xs" href="#">Take this action</a>') }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({type: 'warning', msg: $sce.trustAsHtml('Another alert!')});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}]);


/**
 * Single widget controllers
 */

appControllers.controller('GeoLocationsWidgetDemoController', ['$scope', function($scope){
    var state;
    $scope.mapData = {
        map:{
            name : "usa_states",
            defaultArea : {
                attrsHover : {
                    fill : '#242424',
                    animDuration : 100
                },
                tooltip: {
                    content: function(){
                        return '<strong>' + state + '</strong>';
                    }
                },
                eventHandlers: {
                    mouseover: function(e, id){
                        state = id;
                    }
                }
            },
            defaultPlot:{
                size: 17,
                attrs : {
                    fill : app.settings.colors['brand-warning'],
                    stroke : "#fff",
                    "stroke-width" : 0,
                    "stroke-linejoin" : "round"
                },
                attrsHover : {
                    "stroke-width" : 1,
                    animDuration : 100
                }
            },
            zoom : {
                enabled : true,
                step : 0.75
            }
        },
        plots:{
            'ny' : {
                latitude: 40.717079,
                longitude: -74.00116,
                tooltip: {content : "New York"}
            },
            'on' : {
                latitude: 33.145235,
                longitude: -83.811834,
                size: 18,
                tooltip: {content : "Oconee National Forest"}
            },
            'sf' : {
                latitude: 37.792032,
                longitude: -122.394613,
                size: 12,
                tooltip: {content : "San Francisco"}
            },
            'la' : {
                latitude: 26.935080,
                longitude: -80.851766,
                size: 26,
                tooltip: {content : "Lake Okeechobee"}
            },
            'gc' : {
                latitude: 36.331308,
                longitude: -83.336050,
                size: 10,
                tooltip: {content : "Grainger County"}
            },
            'cc' : {
                latitude: 36.269356,
                longitude: -76.587477,
                size: 22,
                tooltip: {content : "Chowan County"}
            },
            'll' : {
                latitude: 30.700644,
                longitude: -95.145249,
                tooltip: {content : "Lake Livingston"}
            },
            'tc' : {
                latitude: 34.546708,
                longitude: -90.211471,
                size: 14,
                tooltip: {content : "Tunica County"}
            },
            'lc' : {
                latitude: 32.628599,
                longitude: -103.675115,
                tooltip: {content : "Lea County"}
            },
            'uc' : {
                latitude: 40.456692,
                longitude: -83.522688,
                size: 11,
                tooltip: {content : "Union County"}
            },
            'lm' : {
                latitude: 33.844630,
                longitude: -118.157483,
                tooltip: {content : "Lakewood Mutual"}
            }
        }
    };


    // brutal IE svg height fix. too late to fix in css
    (function(){
        var $map = $('.mapael .map');
        //ie svg height fix
        function _fixMapHeight(){
            setTimeout(function(){
                $map.find('svg').css('height', function(){
                    return $(this).attr('height') + 'px';
                });
            }, 100)
        }

        _fixMapHeight();
        $(window).on('sn:resize', _fixMapHeight);
    })();
}]);

appControllers.controller('MarketStatsWidgetDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    $scope.applyToScope = function(){
        $scope.seriesData = [ [], [] ];
        $scope.random = new Rickshaw.Fixtures.RandomData(30);

        for (var i = 0; i < 30; i++) {
            $scope.random.addData($scope.seriesData);
        }
        $scope.series = [
            {
                color: '#F7653F',
                data: $scope.seriesData[0],
                name: 'Uploads'
            }, {
                color: '#F7D9C5',
                data: $scope.seriesData[1],
                name: 'Downloads'
            }
        ]
    }
    scriptLoader.loadScripts([
        'd3/d3.min.js',
        'rickshaw/rickshaw.js'
    ])
        .then(function(){
            $scope.applyToScope()
        })
}]);

appControllers.controller('BootstrapCalendarDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    var now = new Date();
    $scope.month = now.getMonth() + 1;
    $scope.year = now.getFullYear();
}]);

appControllers.controller('FlotChartDemoController', ['$scope', function($scope){
    $scope.generateRandomData = function(labels){
        function random() {
            return (Math.floor(Math.random() * 30)) + 10;
        }

        var data = [],
            maxValueIndex = 5;

        for (var i = 0; i < labels.length; i++){
            var randomSeries = [];
            for (var j = 0; j < 25; j++){
                randomSeries.push([j, Math.floor(maxValueIndex * j) + random()])
            }
            maxValueIndex--;
            data.push({
                data: randomSeries, showLabels: true, label: labels[i].label, labelPlacement: "below", canvasRender: true, cColor: "red", color: labels[i].color
            })
        }
        return data;
    };
}]);

appControllers.controller('NasdaqSparklineDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    $scope.applyToScope = function(){
        $scope.data = [4,6,5,7,5];
        $scope.options = {
            type: 'line',
            width: '100%',
            height: '60',
            lineColor: $scope.app.settings.colors['gray'],
            fillColor: 'transparent',
            spotRadius: 5,
            spotColor: $scope.app.settings.colors['gray'],
            valueSpots: {'0:':$scope.app.settings.colors['gray']},
            highlightSpotColor: $scope.app.settings.colors['white'],
            highlightLineColor: $scope.app.settings.colors['gray'],
            minSpotColor: $scope.app.settings.colors['gray'],
            maxSpotColor: $scope.app.settings.colors['brand-danger'],
            tooltipFormat: new $.SPFormatClass('<span style="color: white">&#9679;</span> {{prefix}}{{y}}{{suffix}}'),
            chartRangeMin: $scope.app.helpers.min($scope.data)  - 1
        };
    };
    scriptLoader.loadScripts(['jquery.sparkline/index.js'])
        .then(function(){
            $scope.applyToScope()
        })
}]);

appControllers.controller('YearsMapDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    $scope.applyToScope = function(){
        $scope.selectedYear = 2009;

        $scope.$watch('selectedYear', function(year, oldYear){
            if (year == oldYear) return;
            $scope.$map.trigger('update', [fakeWorldData[year], {}, {}, {animDuration : 300}]);
        });

        $scope.data = {
            map:{
                name : "world_countries",
                defaultArea : {
                    attrs : {
                        fill: $scope.app.settings.colors['gray-lighter']
                        , stroke : $scope.app.settings.colors['gray']
                    },
                    attrsHover : {
                        fill : $scope.app.settings.colors['gray-light'],
                        animDuration : 100
                    }
                },
                defaultPlot:{
                    size: 17,
                    attrs : {
                        fill : $scope.app.settings.colors['brand-warning'],
                        stroke : "#fff",
                        "stroke-width" : 0,
                        "stroke-linejoin" : "round"
                    },
                    attrsHover : {
                        "stroke-width" : 1,
                        animDuration : 100
                    }
                },
                zoom : {
                    enabled : true,
                    step : 1,
                    maxLevel: 10
                }
            }
            ,legend : {
                area : {
                    display : false,
                    slices : [
                        {
                            max :5000000,
                            attrs : {
                                fill : $scope.app.helpers.lightenColor('#ebeff1',.04)
                            },
                            label :"Less than 5M"
                        },
                        {
                            min :5000000,
                            max :10000000,
                            attrs : {
                                fill : '#ebeff1'
                            },
                            label :"Between 5M and 10M"
                        },
                        {
                            min :10000000,
                            max :50000000,
                            attrs : {
                                fill : $scope.app.settings.colors['gray-lighter']
                            },
                            label :"Between 10M and 50M"
                        },
                        {
                            min :50000000,
                            attrs : {
                                fill : $scope.app.helpers.darkenColor('#ebeff1',.1)
                            },
                            label :"More than 50M"
                        }
                    ]
                }
            },
            areas: fakeWorldData[$scope.selectedYear]['areas']
        };
        var coords = $.fn.mapael.maps["world_countries"].getCoords(59.599254, 8.863224);
        $scope.zoom = [6, coords.x, coords.y];
    };

    scriptLoader.loadScripts([
        'raphael/raphael-min.js',
        'jQuery-Mapael/js/jquery.mapael.js',
        'jQuery-Mapael/js/maps/world_countries.js',
        'demo/js/_fake-world-data.js'
    ])
        .then(function(){
            $scope.applyToScope();
        })
}]);

appControllers.controller('RealtimeTrafficWidgetDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    $scope.applyToScope = function(){
        $scope.seriesData = [ [], [] ];
        $scope.random = new Rickshaw.Fixtures.RandomData(30);

        for (var i = 0; i < 30; i++) {
            $scope.random.addData($scope.seriesData);
        }
        $scope.series = [
            {
                color: $scope.app.settings.colors['gray-dark'],
                data: $scope.seriesData[0],
                name: 'Uploads'
            }, {
                color: $scope.app.settings.colors['gray'],
                data: $scope.seriesData[1],
                name: 'Downloads'
            }
        ]
    };


    scriptLoader.loadScripts([
        'd3/d3.min.js',
        'rickshaw/rickshaw.min.js'
    ])
        .then(function(){
            $scope.applyToScope()
        })
}]);

appControllers.controller('ChangesChartWidgetDemoController', ['$scope', 'scriptLoader', function($scope, scriptLoader){
    $scope.applyRickshawData = function(){
        var seriesData = [ [], [] ];
        var random = new Rickshaw.Fixtures.RandomData(10000);

        for (var i = 0; i < 32; i++) {
            random.addData(seriesData);
        }

        $scope.series = [{
            name: 'pop',
            data: seriesData.shift().map(function(d) { return { x: d.x, y: d.y } }),
            color: $scope.app.helpers.lightenColor($scope.app.settings.colors['brand-success'], .09),
            renderer: 'bar'
        }, {
            name: 'humidity',
            data: seriesData.shift().map(function(d) { return { x: d.x, y: d.y * (Math.random()*0.1 + 1.1) } }),
            renderer: 'line',
            color: $scope.app.settings.colors['white']
        }];
    };

    $scope.applySparklineData = function(){
        var data = [3,6,2,4,5,8,6,8],
            dataMax = $scope.app.helpers.max(data),
            backgroundData = data.map(function(){return dataMax});

        $scope.sparklineData = [backgroundData, data];
        $scope.sparklineOptions = [{
            type: 'bar',
            height: 26,
            barColor: $scope.app.settings.colors['gray-lighter'],
            barWidth: 7,
            barSpacing: 5,
            chartRangeMin: $scope.app.helpers.min(data),
            tooltipFormat: new $.SPFormatClass('')
        },{
            composite: true,
            type: 'bar',
            barColor: $scope.app.settings.colors['brand-success'],
            barWidth: 7,
            barSpacing: 5
        }];
    };

    scriptLoader.loadScripts([
        'd3/d3.min.js',
        'rickshaw/rickshaw.min.js'
    ])
        .then(function(){
            $scope.applyRickshawData()
        });

    scriptLoader.loadScripts([
        'jquery.sparkline/index.js'
    ])
        .then(function(){
            $scope.applySparklineData()
        })
}]);

appControllers.controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

    $scope.open = function () {

        $modal.open({
            templateUrl: 'myModal18Content.html',
            controller: 'ModalInstanceCtrl'
        });
    };
}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

