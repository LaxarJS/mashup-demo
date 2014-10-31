/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar_patterns',
   'angular-nvd3',
   'css!nvd3'
], function( ng, ax, patterns ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.chart_widget';
   var module     = ng.module( moduleName, [ 'nvd3' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   // Chart Styling

   var MARGIN_TOP = 20;
   var MARGIN_RIGHT = 20;
   var MARGIN_BOTTOM = 40;
   var MARGIN_LEFT = 55;
   var TRANSITION_DURATION = 250;
   var Y_AXIS_LABEL_DISTANCE = 30;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {
      $scope.model = {};
      $scope.resources = {};
      var model = $scope.model;
      var resources = $scope.resources;
      var features = $scope.features;

      var resourceHandler = patterns.resources.handlerFor( $scope );

      if( features.display.chart.type === 'pieChart' ) {
         resourceHandler.registerResourceFromFeature( 'display', {
            onReplace: [ updatePie, setOptionsFromResource ],
            onUpdate: [ updatePie ]
         } );
      }
      else {
         resourceHandler.registerResourceFromFeature( 'display', {
            onReplace: [ convertToChartModel, setOptionsFromResource ],
            onUpdate: [ applyPatches ]
         } );
      }

      setOptions();

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updatePie() {
         var data = model.data = model.data || [];
         data.splice.apply( data, [ 0, data.length ].concat( resources.display.series.map( function( ts ) {
            return {
               x: ts.label,
               y: calculateAverageValue( ts.values )
            };
         } ) ) );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function isIncremental( patches ) {
         return patches.every( function( patch ) {
            return patch.op === 'replace' && patch.path.indexOf( '/series/' ) === 0;
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function applyPatches( event ) {
         if( isIncremental( event.patches ) ) {
            event.patches.forEach( function ( patch ) {
               var path = patch.path.split( '/' ).slice( 1 );
               if( path[ 0 ] === 'series' ) {
                  var seriesKey = path[ 1 ];
                  var valueKey = path[ 3 ];
                  model.data[ seriesKey ].values[ valueKey ].y = patch.value;
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
         var data = model.data = model.data || [];
         data.splice( 0, data.length );
         resources.display.series.forEach( function( seriesObject, key ) {
            var values= [];
            seriesObject.values.forEach( function( value, timeTickKey ) {
               values.push( {
                  x: resources.display.timeGrid[ timeTickKey ],
                  y: value
               } );
            } );

            data.push( {
               values: values,
               key: seriesObject.label
            } );
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function calculateAverageValue( values ){
         var sum = 0;
         values.forEach( function( value ) {
            sum = sum + value;
         } );
         return Math.round( sum * 10 / values.length ) / 10;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptionsFromResource() {
         model.options.chart.xAxis.axisLabel = resources.display.timeLabel;
         model.options.chart.yAxis.axisLabel =  resources.display.valueLabel;
         if( $scope.api ) {
            $scope.api.updateWithOptions( model.options );
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptions() {
         model.options = {
            chart: {
               type: features.display.chart.type,
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
               }
            }
         };
         model.options.chart.height = features.display.chart.height;
      }
   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
