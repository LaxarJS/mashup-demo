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
   var Y_AXIS_LABEL_DISTANCE = 30;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {
      $scope.model = {};
      $scope.resources = {};
      var model = $scope.model;
      var resources = $scope.resources;
      var features = $scope.features;

      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'display',
         { onUpdateReplace: [ convertToChartModel, setOptionsFromResource ] } );

      setOptions();

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertToChartModel() {
         model.data = [];
         resources.display.series.forEach( function( seriesObject, key ) {
            var values= [];
            seriesObject.values.forEach( function( value, timeTickKey ) {
               values.push( {
                  x: resources.display.timeGrid[ timeTickKey ],
                  y: value
               } );
            } );

            model.data.push( {
               values: values,
               key: seriesObject.label
            } );
         } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptionsFromResource() {
         model.options.chart.xAxis.tickValues = resources.display.timeGrid;
         model.options.chart.xAxis.axisLabel = resources.display.timeLabel;
         model.options.chart.yAxis.axisLabel =  resources.display.valueLabel;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptions() {
         model.options = {
            chart: {
               type: 'lineChart',
               margin: {
                  top: MARGIN_TOP,
                  right: MARGIN_RIGHT,
                  bottom: MARGIN_BOTTOM,
                  left: MARGIN_LEFT
               },
               useInteractiveGuideline: true,
               xAxis: {
               },
               yAxis: {
                  axisLabelDistance: Y_AXIS_LABEL_DISTANCE
               },
               callback: function() {
                  //ax.log.debug('!!! lineChart callback !!!');
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
