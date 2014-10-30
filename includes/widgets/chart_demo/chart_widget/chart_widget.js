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

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {
      $scope.model = {};
      $scope.resources = {};
      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'display', {onUpdateReplace: [ convertToChartModel, setOptionsFromResource ]} );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setOptionsFromResource() {
         $scope.model.options.chart.xAxis.tickValues = $scope.resources.display.timeGrid;
         $scope.model.options.chart.xAxis.axisLabel = $scope.resources.display.timeLabel;
         $scope.model.options.chart.yAxis.axisLabel =  $scope.resources.display.valueLabel;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertToChartModel() {
         $scope.model.data = [];
         $scope.resources.display.series.forEach( function( timeSeries, key ){
            var values= [];
            timeSeries.values.forEach( function( x, yKey ) {
               values.push( {
                  x: $scope.resources.display.timeGrid[ yKey ],
                  y: x
               } );
            } );

            $scope.model.data.push({
               values: values,
               key: timeSeries.label
            });
         } );
      }

      $scope.model.options = {
         chart: {
            type: 'lineChart',
            height: 450,
            margin: {
               top: 20,
               right: 20,
               bottom: 40,
               left: 55
            },
            useInteractiveGuideline: true,
            dispatch: {
               stateChange: function() {
                  //ax.log.debug('stateChange');
               },
               changeState: function() {
                  //ax.log.debug('changeState');
               },
               tooltipShow: function() {
                  //ax.log.debug('tooltipShow');
               },
               tooltipHide: function() {
                  //ax.log.debug('tooltipHide');
               }
            },
            xAxis: {},
            yAxis: {
               axisLabelDistance: 30
            },
            callback: function() {
               //ax.log.debug('!!! lineChart callback !!!');
            }
         }
      };

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
