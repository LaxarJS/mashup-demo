/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   '../chart_widget',
   'laxar/laxar_testing',
   'json!./spec_data.json'
], function( widgetModule, ax, specData ) {
   'use strict';

   describe( 'A ChartWidget', function() {

      var testBed_;
      var configuration = {
         display: {
            resource: 'spreadsheetData',
            chart: {
               height: 350
            }
         }
      };

      beforeEach( function setup() {
         testBed_ = ax.testing.portalMocksAngular.createControllerTestBed( widgetModule.name );
         testBed_.featuresMock = configuration;

         testBed_.useWidgetJson();
         testBed_.setup();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature display and configured resource', function() {

         beforeEach( function() {

            testBed_.eventBusMock.publish( 'didReplace.spreadsheetData', {
               resource: 'articles',
               data: specData.originalResource
            } );
            jasmine.Clock.tick( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'acts as a slave of the resource and displays the chart', function() {
            expect( testBed_.scope.eventBus.subscribe )
               .toHaveBeenCalledWith( 'didReplace.spreadsheetData', jasmine.any( Function ) );
            expect( testBed_.scope.eventBus.subscribe )
               .toHaveBeenCalledWith( 'didUpdate.spreadsheetData', jasmine.any( Function ) );
            expect( testBed_.scope.resources.display ).toEqual( specData.originalResource );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'converts the resource data to chart model and displays the chart', function() {
            expect( testBed_.scope.model.data ).toEqual( specData.expectedChartModel );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the labels for chart from resource', function() {
            expect( testBed_.scope.model.options.chart.xAxis ).toEqual( {
               tickValues: specData.originalResource.timeGrid,
               axisLabel: specData.originalResource.timeLabel
            } );
            expect( testBed_.scope.model.options.chart.yAxis.axisLabel ).toEqual( specData.originalResource.valueLabel );
         } );
         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the chart height from feature configuration', function() {
            expect( testBed_.scope.model.options.chart.height ).toEqual( 350 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'replaces the resource and model after receiving a new resource', function() {
            testBed_.eventBusMock.publish( 'didReplace.spreadsheetData', {
               resource: 'spreadsheetData',
               data: specData.otherResource
            } );
            jasmine.Clock.tick( 0 );
            expect( testBed_.scope.resources.display ).toEqual( specData.otherResource );
            expect( testBed_.scope.model.data ).toEqual( specData.expectedChartModelForOtherResource );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////
      } );
   } );
} );
