/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'json!../widget.json',
   'laxar-mocks',
   'angular-mocks',
   'laxar-patterns',
   './spec_data'
], function(descriptor, axMocks, ngMocks, patterns, specData ) {
   'use strict';

   describe( 'A data-provider-widget', function() {
      var $httpBackend;
      var $provide;
      var widgetEventBus;
      var widgetScope;
      var testEventBus;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      var widgetConfiguration = {
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

      beforeEach( function() {
         ngMocks.module( function( _$provide_ ) {
            $provide = _$provide_;
         } );
      } );

      beforeEach( axMocks.createSetupForWidget( descriptor ) );

      beforeEach( function() {
         axMocks.widget.configure( widgetConfiguration );
      } );

      beforeEach( axMocks.widget.load );

      beforeEach( function() {
         widgetScope = axMocks.widget.$scope;
         widgetEventBus = axMocks.widget.axEventBus;
         testEventBus = axMocks.eventBus;
         ngMocks.inject( function( $injector ) {
            $httpBackend = $injector.get( '$httpBackend' );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         axMocks.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature data', function() {

         afterEach( function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didReplace event with the file content of the new location when the corresponding button is pressed', function() {
            $httpBackend.expectGET( 'data-set-2.json' ).respond( specData.dataSet2 );

            widgetScope.useItem (widgetConfiguration.data.items[ 1 ] );
            $httpBackend.flush();

            expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didReplace.timeSeriesData', {
                  resource: 'timeSeriesData',
                  data: specData.dataSet2
               }, jasmine.any( Object )
            );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didEncounterError event if the new location is not available', function() {
            $httpBackend.expectGET( 'data-set-non-existing.json' ).respond( 404, 'Not Found' );

            widgetScope.useItem (widgetConfiguration.data.items[ 2 ] );
            $httpBackend.flush();

            expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didEncounterError.HTTP_GET', jasmine.any( Object ), jasmine.any( Object ) );
         } );

      } );
   } );
} );
