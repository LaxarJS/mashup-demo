/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'moment',
   'laxar',
   'laxar_patterns',
   'angular-nvd3',
   'css!nvd3'
], function( ng, moment, ax, patterns ) {
   'use strict';

   var moduleName = 'widgets.mashup_demo.chart_widget';
   var module     = ng.module( moduleName, [ 'nvd3' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   // Chart Styling


   var TRANSITION_DURATION = 250;
   var Y_AXIS_LABEL_DISTANCE = 30;

   var FORCE_Y = 0;

   var SEARCH_PATTERN = /\/series\/(\d+)\/values\/(\d+)/;

   var chartConfigurations = {
      pieChart: {
         chart: {
            margin: { bottom: 0 },
            height: 180,
            pie: {
               donut: true,
               showLabels: false,
               margin: {
                  top: 0,
                  bottom: 0
               }
            },
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

   Controller.$inject = [ '$scope', '$window' ];

   function Controller( $scope, $window ) {
      $scope.model = {
         data: []
      };
      $scope.resources = {};
      var model = $scope.model;
      var resources = $scope.resources;
      var features = $scope.features;

      var resourceHandler = patterns.resources.handlerFor( $scope );

      if( features.chart.type === 'pieChart' ) {
         resourceHandler.registerResourceFromFeature( 'timeSeries', {
            onReplace: [ updatePie, setOptionsFromResource ],
            onUpdate: [ updatePie ]
         } );
      }
      else {
         resourceHandler.registerResourceFromFeature( 'timeSeries', {
            onReplace: [ convertToChartModel, setOptionsFromResource ],
            onUpdate: [ applyPatches ]
         } );
      }

      setOptions();
      $scope.model.config = { refreshDataOnly: true };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updatePie() {
         var data = model.data;
         data.splice.apply( data, [ 0, data.length ].concat( resources.timeSeries.series.map( function( ts ) {
            return {
               x: ts.label,
               y: calculateAverageValue( ts.values )
            };
         } ) ) );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function isIncremental( patches ) {
         return patches.every( function( patch ) {
            return patch.op === 'replace' && SEARCH_PATTERN.exec( patch.path ) !== null;
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function applyPatches( event ) {

         if( isIncremental( event.patches ) ) {
            event.patches.forEach( function( patch ) {
               var matches = SEARCH_PATTERN.exec( patch.path );
               if( matches !== null ) {
                  model.data[ matches[ 1 ] ].values[ matches[ 2 ] ].y = patch.value;
               }
            } );
         }
         else {
            convertToChartModel();
            setOptionsFromResource();
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertToChartModel() {
         var data = model.data;
         data.splice.apply( data, [ 0, data.length ].concat( resources.timeSeries.series.map( function( ts ) {
            var values = ts.values.map( function( value, timeTickKey ) {
               return {
                  x: moment( resources.timeSeries.timeGrid[ timeTickKey ], 'YYYY-MM-DD' ).format( 'X' ) * 1000,
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

      function calculateAverageValue( values ){
         var sum = values.reduce( function( sum, value ) {
            return sum + value;
         }, 0 );
         return Math.round( sum * 10 / values.length ) / 10;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptionsFromResource() {
         model.options.chart.xAxis.tickFormat = function( d ) {
            return $window.d3.time.format( '%x' )( new Date( d ) );
         };
         model.options.chart.xAxis.axisLabel = resources.timeSeries.timeLabel;
         model.options.chart.yAxis.axisLabel =  resources.timeSeries.valueLabel;
         if( $scope.api ) {
            $scope.api.updateWithOptions( model.options );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptions() {
         var chartType = features.chart.type;
         var options = ax.object.deepClone( chartConfigurations[ chartType ] );

         var chartOptions = options.chart;
         chartOptions.type = chartType;
         chartOptions.useInteractiveGuideline = true;
         chartOptions.transitionDuration = TRANSITION_DURATION;
         chartOptions.xAxis = {};
         chartOptions.yAxis = {
            axisLabelDistance: Y_AXIS_LABEL_DISTANCE
         };
         chartOptions.forceY = [ FORCE_Y ];

         model.options = options;
      }
   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
