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
      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'series', {onUpdateReplace: convertToChartModel} );

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
            x: function(d) {
               return d.x;
            },
            y: function(d) {
               return d.y;
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
            xAxis: {
               axisLabel: 'Time'
            },
            yAxis: {
               axisLabel: 'Stockvalue',
               axisLabelDistance: 30
            },
            callback: function() {
               //ax.log.debug('!!! lineChart callback !!!');
            }
         },
         title: {
            enable: true,
            text: 'Title for Line Chart'
         },
         subtitle: {
            enable: true,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
               'text-align': 'center',
               'margin': '10px 13px 0px 7px'
            }
         },
         caption: {
            enable: true,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
               'text-align': 'justify',
               'margin': '10px 13px 0px 7px'
            }
         }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertToChartModel() {
         $scope.model.data = [];
         $scope.resources.series.series.forEach( function( timeSeries, key ){
            var values= [];
            timeSeries.data.forEach( function( x, yKey ) {
               values.push( {
                  x: $scope.resources.series.grid[ yKey ],
                  y: x
               } );
            } );

            $scope.model.data.push({
               values: values,
               key: timeSeries.label
            });
         } );
         $scope.model.options.chart.xAxis.tickValues = $scope.resources.series.grid;
      }


   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
