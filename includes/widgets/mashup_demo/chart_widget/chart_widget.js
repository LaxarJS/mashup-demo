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

   var MARGIN_TOP = 20;
   var MARGIN_RIGHT = 60;
   var MARGIN_BOTTOM = 40;
   var MARGIN_LEFT = 55;
   var TRANSITION_DURATION = 250;
   var Y_AXIS_LABEL_DISTANCE = 30;

   var FORCE_Y = 0;

   var SEARCH_PATTERN = /\/series\/(\d+)\/values\/(\d+)/;

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
         model.options = {
            chart: {
               type: features.chart.type,
               margin: {
                  top: MARGIN_TOP,
                  right: MARGIN_RIGHT,
                  bottom: MARGIN_BOTTOM,
                  left: MARGIN_LEFT
               },
               useInteractiveGuideline: true,
               transitionDuration: TRANSITION_DURATION,
               xAxis: {
               },
               yAxis: {
                  axisLabelDistance: Y_AXIS_LABEL_DISTANCE
               },
               forceY: [ FORCE_Y ]
            }
         };
         model.options.chart.height = features.chart.height;
         if( features.chart.caption ) {
            model.options.caption = {
               enable: true,
               text: features.chart.caption
            };
         }
      }
   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
