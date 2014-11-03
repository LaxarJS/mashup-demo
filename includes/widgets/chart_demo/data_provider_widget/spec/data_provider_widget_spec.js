/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   '../data_provider_widget',
   'laxar/laxar_testing',
   'laxar_patterns',
   'json!./spec_data.json'
], function( widgetModule, ax, patterns, specData ) {
   'use strict';

   describe( 'A DataProviderWidget', function() {

      var testBed_;

      beforeEach( function setup() {
         testBed_ = ax.testing.portalMocksAngular.createControllerTestBed( widgetModule.name );
         testBed_.featuresMock = {
            data: {
               resource: 'timeSeriesData',
               items: [
                  {
                     title: 'Data-Set-1',
                     location: 'data-set-1.json'
                  },
                  {
                     title: 'Data-Set-2',
                     location: 'data-set-2.json'
                  }
               ]
            }
         };

         testBed_.useWidgetJson();
         testBed_.setup();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature data', function() {

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didReplace event for the configured resource at the beginning of the page lifecycle', inject( function( $httpBackend ) {
            $httpBackend.expectGET( 'data-set-1.json' ).respond( specData.dataSet1 );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didReplace.timeSeriesData', {
                  resource: 'timeSeriesData',
                  data: specData.dataSet1
               }, jasmine.any( Object )
            );

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } ) );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didReplace event with the file content of the new location when the corresponding button is pressed', inject( function( $httpBackend ) {
            $httpBackend.expectGET( 'data-set-2.json' ).respond( specData.dataSet2 );

            testBed_.scope.useItem( testBed_.featuresMock.data.items[1] );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didReplace.timeSeriesData', {
                  resource: 'timeSeriesData',
                  data: specData.dataSet2
               }, jasmine.any( Object )
            );

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } ) );

      } );
   } );

} );
