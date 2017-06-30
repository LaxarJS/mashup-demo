/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import * as axMocks from 'laxar-mocks';
import angular from 'angular';
import 'angular-mocks';
import { specData } from './spec_data';

describe( 'A data-provider-widget', () => {
   let $httpBackend;
   let widgetEventBus;
   let widgetScope;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   const widgetConfiguration = {
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

   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure( widgetConfiguration );
      axMocks.widget.whenServicesAvailable( () => {
         angular.mock.inject( $injector => {
            $httpBackend = $injector.get( '$httpBackend' );
         } );
      } );
   } );

   beforeEach( axMocks.widget.load );

   beforeEach( () => {
      widgetScope = axMocks.widget.$scope;
      widgetEventBus = axMocks.widget.axEventBus;
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( axMocks.tearDown );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature data', () => {

      afterEach( () => {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'publishes a didReplace event with the file content of the new location' +
          'when the corresponding button is pressed', () => {
         $httpBackend.expectGET( 'data-set-2.json' ).respond( specData.dataSet2 );

         widgetScope.useItem(widgetConfiguration.data.items[ 1 ] );
         $httpBackend.flush();

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didReplace.timeSeriesData', {
            resource: 'timeSeriesData',
            data: specData.dataSet2
         }, jasmine.any( Object )
         );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'publishes a didEncounterError event if the new location is not available', () => {
         $httpBackend.expectGET( 'data-set-non-existing.json' ).respond( 404, 'Not Found' );

         widgetScope.useItem(widgetConfiguration.data.items[ 2 ] );
         $httpBackend.flush();

         expect( widgetEventBus.publish ).toHaveBeenCalledWith(
            'didEncounterError.HTTP_GET', jasmine.any( Object ), jasmine.any( Object ) );
      } );

   } );
} );
