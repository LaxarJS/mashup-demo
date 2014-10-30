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
            publish: {
               resource: 'spreadsheetData'
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

      describe( 'with feature publish', function() {

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'does not publish a didReplace event for the configured resource at the beginning of the page lifecycle if no location is provided.', inject( function( $httpBackend ) {
            testBed_.featuresMock = {
               publish: {
                  resource: 'spreadsheetData'
               }
            };
            testBed_.setup();

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );

            expect( testBed_.scope.eventBus.publish ).not.toHaveBeenCalled();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } ) );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didReplace event for the configured resource at the beginning of the page lifecycle if a location is provided.', inject( function( $httpBackend ) {
            testBed_.featuresMock = {
               publish: {
                  resource: 'spreadsheetData',
                  location: 'data-set-1.json'
               }
            };
            testBed_.setup();

            $httpBackend.expectGET( 'data-set-1.json' ).respond( specData.dataSet1 );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didReplace.spreadsheetData', {
                  resource: 'spreadsheetData',
                  data: specData.dataSet1
               }, jasmine.any( Object )
            );

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } ) );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with features publish and display', function() {

         var $httpBackend;

         beforeEach( inject( function( _$httpBackend_ ) {
            testBed_.featuresMock = {
               publish: {
                  resource: 'spreadsheetData',
                  location: 'data-set-1.json'
               },
               display: {
                  dataSets: [
                     {
                        location: 'data-set-2.json'
                     }
                  ]
               }
            };
            testBed_.setup();

            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET( 'data-set-1.json' ).respond( specData.dataSet1 );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();
         } ) );

         it( 'publishes a didReplace event with the file content of the new location when the corresponding button is pressed.', function() {

            $httpBackend.expectGET( 'data-set-2.json' ).respond( specData.dataSet2 );

            //testBed_.eventBusMock.publish( 'beginLifecycleRequest' );

            testBed_.scope.useDataSet( testBed_.featuresMock.display.dataSets[0] );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();

            expect( testBed_.scope.eventBus.publish ).toHaveBeenCalledWith( 'didReplace.spreadsheetData', {
                  resource: 'spreadsheetData',
                  data: specData.dataSet2
               }, jasmine.any( Object )
            );

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } );
      } );
   } );

} );
