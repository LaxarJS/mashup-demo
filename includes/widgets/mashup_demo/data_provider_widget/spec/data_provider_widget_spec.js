/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular-mocks',
   '../data_provider_widget',
   'laxar/laxar_testing',
   'laxar_patterns',
   './spec_data'
], function( ngMocks, widgetModule, ax, patterns, specData ) {
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
                  },
                  {
                     title: 'Data-Set-Non-Existing',
                     location: 'data-set-non-existing.json'
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

         var $httpBackend;

         beforeEach( function() {
            ngMocks.inject( function( _$httpBackend_ ) {
               $httpBackend = _$httpBackend_;
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didReplace event for the configured resource at the beginning of the page lifecycle', function() {
            $httpBackend.expectGET( 'data-set-1.json' ).respond( specData.dataSet1 );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didReplace.timeSeriesData', {
                  resource: 'timeSeriesData',
                  data: specData.dataSet1
               }, jasmine.any( Object )
            );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didReplace event with the file content of the new location when the corresponding button is pressed', function() {
            $httpBackend.expectGET( 'data-set-2.json' ).respond( specData.dataSet2 );

            testBed_.scope.useItem( testBed_.featuresMock.data.items[1] );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didReplace.timeSeriesData', {
                  resource: 'timeSeriesData',
                  data: specData.dataSet2
               }, jasmine.any( Object )
            );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didEncounterError event if the new location is not available', function() {
            $httpBackend.expectGET( 'data-set-non-existing.json' ).respond( 404, 'Not Found' );

            testBed_.scope.useItem( testBed_.featuresMock.data.items[2] );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didEncounterError.HTTP_GET', jasmine.any( Object ), jasmine.any( Object ) );
         } );

      } );
   } );

} );
