/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define([
    'angular',
    'ngHandsontable',
], function (ng, ngHandsontable) {
    'use strict';

    var moduleName = 'widgets.chart_demo.table_editor_widget';
    var module = ng.module(moduleName, ['ngHandsontable']);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    Controller.$inject = [ '$scope', 'settingFactory', 'autoCompleteFactory'];

    function Controller($scope, settingFactory, autoCompleteFactory) {

        // Check if the injection worked.
        console.log(settingFactory);
        console.log(autoCompleteFactory);

        // Just a hack to visually "repair" the table by redrawing it.
        $scope.refresh = function () {
            settingFactory.renderHandsontable($('#my-table'));
        }

        $scope.afterChange = function () {
            console.log("afterChange()");
        };

        $scope.createRandomData = function() {
            $scope.data = createRandomMatrix(3, 5, 1, 10);
            //settingFactory.renderHandsontable($('#my-table'));
            settingFactory.updateHandsontableSettings($('#my-table'), {data: $scope.data});

        };

        $scope.modify = function () {
            $scope.data[0][0] = 100;
        };

        $scope.output = function () {
            console.log($scope.data);
        }


        var createEmptyMatrix = function(rows, columns) {
            var array = new Array(rows);
            for (var i = 0; i < rows; ++i) {
                array[i] = new Array(columns)
            }
            //array[1][1] = "Hello World!"; //FIXME CSS: Provoke a styling error due to word wrapping.
            return array;
        }

        var createRandomMatrix = function(rows, columns, min, max) {
            var array = new Array(rows);
            for (var i = 0; i < rows; ++i) {
                array[i] = new Array(columns)
                for (var j=0; j<columns; ++j) {
                    array[i][j] = Math.floor(Math.random() * (max - min + 1) + min);
                }
            }
            return array;
        }

        // Initialize an empty 2-dimensional array of fixed size.
        $scope.data = createEmptyMatrix(3, 5);










        //$scope.colHeaders = ['X1', 'X2'];
        //$scope.rowHeaders = ['Y1','Y2','Y3'];
//       $scope.rowHeaders = function(i) {
//           console.log(i);
//           return 'Y' + i;
//       }
//
//        $scope.colHeaders = function (j) {
//            console.log("col: X" + j);
//            return 'X' + j;
//        }
//
//        $scope.foo = function () {
//            return 'dfd';
//        }
//
//        $scope.db = {};
//
//        $scope.db.rowheaders = ['A', 2, 3];
//
//        $scope.db.items = [
//            {
//                "id": 1,
//                "name": {
//                    "first": "John",
//                    "last": "Schmidt"
//                },
//                "address": "45024 France",
//                "price": 760.41,
//                "isActive": "Yes",
//                "product": {
//                    "description": "Fried Potatoes",
//                    "options": [
//                        {
//                            "description": "Fried Potatoes",
//                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
//                            "Pick$": null
//                        },
//                        {
//                            "description": "Fried Onions",
//                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
//                            "Pick$": null
//                        }
//                    ]
//                }
//            },
//            {
//                "id": 2,
//                "name": {
//                    "first": "John",
//                    "last": "Schmidt"
//                },
//                "address": "45024 France",
//                "price": 760.41,
//                "isActive": "Yes",
//                "product": {
//                    "description": "Fried Potatoes",
//                    "options": [
//                        {
//                            "description": "Fried Potatoes",
//                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
//                            "Pick$": null
//                        },
//                        {
//                            "description": "Fried Onions",
//                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
//                            "Pick$": null
//                        }
//                    ]
//                }
//            },
//            //more items go here
//            {
//                "id": 3,
//                "name": {
//                    "first": "John",
//                    "last": "Schmidt"
//                },
//                "address": "45024 France",
//                "price": 760.41,
//                "isActive": "Yes",
//                "product": {
//                    "description": "Fried Potatoes",
//                    "options": [
//                        {
//                            "description": "Fried Potatoes",
//                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
//                            "Pick$": null
//                        },
//                        {
//                            "description": "Fried Onions",
//                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
//                            "Pick$": null
//                        }
//                    ]
//                }
//            }
//            //more items go here
//            //more items go here
//        ];


    }

    module.controller(moduleName + '.Controller', Controller);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    return module;

});
