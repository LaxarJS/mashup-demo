/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'moment',
   'laxar',
   'laxar-patterns',
   'd3',
   'angular-nvd3',
   'css!nvd3'
], function( ng, moment, ax, patterns, d3 ) {
   'use strict';

   var moduleName = 'chartWidget';
   var module = ng.module( moduleName, ['nvd3'] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var SEARCH_PATTERN = /\/series\/(\d+)\/values\/(\d+)/;

   // Chart Styling
   var TRANSITION_DURATION = 250;
   var Y_AXIS_LABEL_DISTANCE = 30;
   var FORCE_Y = 0;

   var chartConfigurations = {
      pieChart: {
         chart: {
            margin: {bottom: 0},
            height: 180,
            pie: {
               donut: true,
               showLabels: false,
               margin: {
                  top: 0,
                  bottom: 0
               }
            }
         },
         caption: {
            enable: true,
            text: 'The average of all values of the time series.'
         }
      },
      stackedAreaChart: {
         chart: {
            margin: {
               right: 30,
               bottom: 40
            },
            height: 260
         }
      },
      multiBarChart: {
         chart: {
            margin: {
               right: 0,
               bottom: 40
            },
            height: 260
         }
      }
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = ['$scope'];

   function Controller( $scope ) {
      $scope.model = {
         data: []
      };
      $scope.resources = {};

      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'timeSeries', {
         onReplace: [ replaceChartModel ],
         onUpdate: [ updateChartModel ]
      } );

      var features = $scope.features;
      var model = $scope.model;
      var resources = $scope.resources;

      setOptions();
      model.config = {refreshDataOnly: true};

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function replaceChartModel( event ) {
         if( features.chart.type === 'pieChart' ) {
            convertResourceToPieModel();
         }
         else {
            convertResourceToChartModel();
         }
         setOptionsFromResource();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updateChartModel( event ) {
         if( features.chart.type === 'pieChart' ) {
            convertResourceToPieModel();
            if( !isIncremental( event.patches ) ) {
               setOptionsFromResource();
            }
         }
         else {
            if( isIncremental( event.patches ) ) {
               // Update only the values contained in the patch.
               event.patches.forEach( function( patch ) {
                  var matches = SEARCH_PATTERN.exec( patch.path );
                  if( matches !== null ) {
                     model.data[ matches[ 1 ] ].values[ matches[ 2 ] ].y = patch.value;
                  }
               } );
            }
            else {
               convertResourceToChartModel();
               setOptionsFromResource();
            }
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function isIncremental( patches ) {
         return patches.every( function( patch ) {
            return patch.op === 'replace' && SEARCH_PATTERN.exec( patch.path ) !== null;
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertResourceToPieModel() {
         var data = model.data;
         data.splice.apply( data, [0, data.length].concat( resources.timeSeries.series.map( function( ts ) {
            return {
               x: ts.label,
               y: calculateAverageValue( ts.values )
            };
         } ) ) );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertResourceToChartModel() {
         var data = model.data;
         data.splice.apply( data, [0, data.length].concat( resources.timeSeries.series.map( function( ts ) {
            var values = ts.values.map( function( value, timeTickKey ) {
               return {
                  x: moment( resources.timeSeries.timeGrid[timeTickKey], 'YYYY-MM-DD' ).format( 'X' ) * 1000,
                  y: value
               };
            } );

            return {
               values: values,
               key: ts.label
            };
         } ) ) );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function calculateAverageValue( values ) {
         var sum = values.reduce( function( sum, value ) {
            return sum + value;
         }, 0 );
         return Math.round( sum * 10 / values.length ) / 10;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptionsFromResource() {
         model.options.chart.xAxis.tickFormat = function( d ) {
            return d3.time.format( '%Y-%m-%d' )( new Date( d ) );
         };
         model.options.chart.xAxis.axisLabel = resources.timeSeries.timeLabel;
         model.options.chart.yAxis.axisLabel = resources.timeSeries.valueLabel;
         if( $scope.api ) {
            $scope.api.updateWithOptions( model.options );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptions() {
         var chartType = features.chart.type;
         var options = ax.object.deepClone( chartConfigurations[chartType] );

         var chartOptions = options.chart;
         chartOptions.type = chartType;
         chartOptions.useInteractiveGuideline = true;
         chartOptions.transitionDuration = TRANSITION_DURATION;
         chartOptions.xAxis = {};
         chartOptions.yAxis = {
            axisLabelDistance: Y_AXIS_LABEL_DISTANCE
         };
         chartOptions.forceY = [FORCE_Y];

         model.options = options;
      }
   }

   module.controller( 'ChartWidgetController', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
