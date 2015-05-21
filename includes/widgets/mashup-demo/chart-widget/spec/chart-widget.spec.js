/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   '../chart_widget',
   '../../../../../bower_components/laxar/laxar_testing',
   './spec_data'
], function( widgetModule, ax, specData ) {
   'use strict';

   describe( 'A ChartWidget', function() {

      var testBed_;

      beforeEach( function setup() {
         testBed_ = ax.testing.portalMocksAngular.createControllerTestBed( widgetModule.name );
         testBed_.featuresMock = {
            timeSeries: {
               resource: 'timeSeriesData'
            },
            chart: {
               type: 'multiBarChart'
            }
         };

         testBed_.useWidgetJson();
         testBed_.setup();

         testBed_.scope.api = {
            updateWithOptions: jasmine.createSpy( 'updateWithOptions' )
         };
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature timeSeries and feature chart', function() {

         beforeEach( function() {
            testBed_.eventBusMock.publish( 'didReplace.timeSeriesData', {
               resource: 'timeSeriesData',
               data: specData.originalResource
            } );
            jasmine.Clock.tick( 0 );

            testBed_.scope.api.updateWithOptions.reset();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'acts as a slave of the resource and displays the chart', function() {
            expect( testBed_.scope.eventBus.subscribe )
               .toHaveBeenCalledWith( 'didReplace.timeSeriesData', jasmine.any( Function ) );
            expect( testBed_.scope.eventBus.subscribe )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', jasmine.any( Function ) );
            expect( testBed_.scope.resources.timeSeries ).toEqual( specData.originalResource );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'converts the resource data to chart model and displays the chart', function() {
            expect( testBed_.scope.model.data ).toEqual( specData.expectedChartModel );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the labels for chart from resource', function() {
            expect( testBed_.scope.model.options.chart.xAxis.axisLabel )
               .toEqual( specData.originalResource.timeLabel );
            expect( testBed_.scope.model.options.chart.yAxis.axisLabel )
               .toEqual( specData.originalResource.valueLabel );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'replaces the resource and model after receiving a new resource', function() {
            testBed_.eventBusMock.publish( 'didReplace.timeSeriesData', {
               resource: 'timeSeriesData',
               data: specData.otherResource
            } );
            jasmine.Clock.tick( 0 );
            expect( testBed_.scope.resources.timeSeries ).toEqual( specData.otherResource );
            expect( testBed_.scope.model.data ).toEqual( specData.expectedChartModelForOtherResource );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'updates the resource after receiving a patch with new values only', function() {
            testBed_.eventBusMock.publish( 'didUpdate.timeSeriesData', {
               resource: 'timeSeriesData',
               patches: specData.patchesWithNewValuesOnly
            } );
            jasmine.Clock.tick( 0 );
            expect( testBed_.scope.api.updateWithOptions ).not.toHaveBeenCalled();

            var modifiedChartModel =  ax.object.deepClone( specData.expectedChartModel );
            modifiedChartModel[ 0 ].values[ 0 ].y = 32;
            modifiedChartModel[ 1 ].values[ 2 ].y = 22;
            expect( testBed_.scope.model.data ).toEqual( modifiedChartModel );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'updates the resource after receiving a patch with new values and a new label', function() {
            testBed_.eventBusMock.publish( 'didUpdate.timeSeriesData', {
               resource: 'timeSeriesData',
               patches: specData.patchesWithNewValuesAndLabel
            } );
            jasmine.Clock.tick( 0 );
            expect( testBed_.scope.api.updateWithOptions ).toHaveBeenCalled();

            var modifiedChartModel =  ax.object.deepClone( specData.expectedChartModel );
            modifiedChartModel[ 0 ].values[ 0 ].y = 32;
            modifiedChartModel[ 1 ].key = 'New Company';
            modifiedChartModel[ 1 ].values[ 2 ].y = 22;
            expect( testBed_.scope.model.data ).toEqual( modifiedChartModel );
         } );
      } );
   } );
} );
