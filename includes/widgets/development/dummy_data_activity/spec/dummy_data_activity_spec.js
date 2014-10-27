/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../dummy_data_activity',
   'laxar/laxar_testing'
], function( controller, ax ) {
   'use strict';

   describe( 'The DummyDataActivity', function() {

      var testBed_;

      var resource1 = {
         resource: 'myResource',
         data: {
            myKey: 'myValue'
         }
      };

      var resource2 = {
         resource: 'myOtherResource',
         data: {
            items: [
               'myValue',
               'myOtherValue'
            ]
         }
      };

      var resourceExternal = {
         resource: 'myExternalResource',
         location: 'data/dummy.json'
      };

      var externalContent = {
         'i am content': 'to contain'
      };

      var actions = {
         action1: {
            resource: 'action1Resource',
            data: {
               myKey: 'value1'
            }
         },
         action2: {
            resource: 'action2Resource',
            updates: {
               items: [
                  'value1',
                  'value2'
               ]
            }
         },
         action3: {
            resource: 'action3Resource',
            updates: {
               items: [
                  'value1',
                  'value2'
               ]
            }
         }
      };

      function setup( features ) {
         testBed_ = ax.testing.portalMocksAngular.createControllerTestBed( 'widgets.development.dummy_data_activity' );
         testBed_.featuresMock = features;
         testBed_.setup();
      }

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature resources ', function() {

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A1.1] allows to configure an arbitrary number of resources', function() {
            setup( { resources: [ resource1 ] } );
            expect( testBed_.scope.features.resources[0].data ).toEqual( resource1.data );
            expect( testBed_.scope.features.resources[0].resource ).toEqual( resource1.resource );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A1.1] validates the configured resources ', function() {
            expect(function() {
               setup( { resources: [
                  { }
               ] } );
            } ).toThrow();
            expect(function() {
               setup( { resources: [
                  { resource: 'myUglyResource', data: ['x'] }
               ] } );
               jasmine.Clock.tick( 0 );
            } ).toThrow();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A1.2] publishes the configured resources at the beginning of the lifecycle of the page ',
            function() {
               var wasCalled = false;
               setup( { resources: [ resource1 ] } );
               testBed_.eventBusMock.subscribe( 'didReplace.' + resource1.resource, function( event ) {
                  wasCalled = true;
                  expect( event.resource ).toEqual( resource1.resource );
                  expect( event.data ).toEqual( resource1.data );
               } );
               testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
               jasmine.Clock.tick( 0 );
               expect( wasCalled ).toBe( true );
            } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A1.3] propagates updates ', function() {
            setup( { resources: [ resource1, resource2 ] } );
            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );

            testBed_.eventBusMock.publish( 'didUpdate.' + resource2.resource, {
               resource: resource2.resource,
               patches: [
                  { op: 'replace', path: '/items/0', value: 'newValue' },
                  { op: 'replace', path: '/items/3', value: 42 }
               ]
            } );
            jasmine.Clock.tick( 0 );
            expect( testBed_.scope.model.resources[1].data.items )
               .toEqual( [ 'newValue', 'myOtherValue', undefined, 42 ] );

            testBed_.eventBusMock.publish( 'didUpdate.' + resource1.resource, {
               resource: resource1.resource,
               patches: [
                  { op: 'replace', path: '/myKey', value: 'newValue' }
               ]
            } );
            jasmine.Clock.tick( 0 );
            expect( testBed_.scope.model.resources[0].data ).toEqual( { myKey: 'newValue' } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.1] allows to configure an arbitrary number of actions', function() {
            setup( { 'actions': actions } );
            expect( testBed_.scope.features.actions.action1.resource ).toEqual( actions.action1.resource );
            expect( testBed_.scope.features.actions.action1.action ).toEqual( actions.action1.action );
            expect( testBed_.scope.features.actions.action1.data ).toEqual( actions.action1.data );
            expect( testBed_.scope.features.actions.action2.resource ).
               toEqual( actions.action2.resource );
            expect( testBed_.scope.features.actions.action2.action ).
               toEqual( actions.action2.action );
            expect( testBed_.scope.features.actions.action2.updates ).
               toEqual( actions.action2.updates );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.2] watches takeActionRequest events for the configured actions', function() {
            setup( { 'actions': actions } );
            expect( testBed_.scope.eventBus.subscribe ).
               toHaveBeenCalledWith( 'takeActionRequest.action1', jasmine.any( Function ) );
            expect( testBed_.scope.eventBus.subscribe ).
               toHaveBeenCalledWith( 'takeActionRequest.action2', jasmine.any( Function ) );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.3] publishes the start of the requested action', function() {
            setup( { 'actions': actions } );
            var wasCalled1 = false;
            var wasCalled2 = false;

            testBed_.eventBusMock.subscribe( 'willTakeAction.action1', function() {
               wasCalled1 = true;
            } );
            testBed_.eventBusMock.subscribe( 'willTakeAction.action2', function() {
               wasCalled2 = true;
            } );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );

            testBed_.eventBusMock.publish( 'takeActionRequest.action1' );
            testBed_.eventBusMock.publish( 'takeActionRequest.action2' );
            jasmine.Clock.tick( 0 );

            expect( wasCalled1 ).toBe( true );
            expect( wasCalled2 ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.4] publishes a didReplace or didUpdate for the resource of the requested action',
            function() {
               setup( { 'actions': actions } );
               var wasCalled1 = false;
               var wasCalled2 = false;

               testBed_.eventBusMock.subscribe( 'didReplace.' + actions.action1.resource, function( event ) {
                  wasCalled1 = true;
                  expect( event.resource ).toEqual( actions.action1.resource );
                  expect( event.data ).toEqual( actions.action1.data );
               } );

               testBed_.eventBusMock.subscribe( 'didUpdate.' + actions.action2.resource, function( event ) {
                  wasCalled2 = true;
                  expect( event.resource ).toEqual( actions.action2.resource );
                  expect( event.updates ).toEqual( actions.action2.updates );
               } );

               testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
               jasmine.Clock.tick( 0 );

               testBed_.eventBusMock.publish( 'takeActionRequest.action1' );
               testBed_.eventBusMock.publish( 'takeActionRequest.action2' );
               jasmine.Clock.tick( 0 );

               expect( wasCalled1 ).toBe( true );
               expect( wasCalled2 ).toBe( true );
            } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.5] publishes the end of the requested action after publishing the resource', function() {
            setup( { 'actions': actions } );
            var didReplaceHandlerWasCalled = false;
            var didTakeActionHandlerWasCalled = false;

            testBed_.eventBusMock.subscribe( 'didReplace.' + actions.action1.resource, function() {
               didReplaceHandlerWasCalled = true;
               expect( didTakeActionHandlerWasCalled ).toBe( false );
            } );

            testBed_.eventBusMock.subscribe( 'didTakeAction.action1', function() {
               expect( didReplaceHandlerWasCalled ).toBe( true );
               didTakeActionHandlerWasCalled = true;
            } );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );

            testBed_.eventBusMock.publish( 'takeActionRequest.action1' );
            jasmine.Clock.tick( 0 );

            expect( didTakeActionHandlerWasCalled ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.6] propagates updates ', function() {
            setup( {
               'actions': actions ,
               'resources': [ {
                  'resource': 'action2Resource',
                  'data': { 'items': [ 42, 'oneValue'] }
               } ]
            } );
            var wasCalled1 = false;
            var wasCalled2 = false;

            testBed_.eventBusMock.subscribe( 'didTakeAction.action2', function() {

               wasCalled1 = true;
               testBed_.eventBusMock.publish( 'didUpdate.' + actions.action2.resource, {
                  resource: actions.action2.resource,
                  patches: [
                     { op: 'replace', path: '/items', value: [ 42 ] }
                  ]
               } );
               jasmine.Clock.tick( 0 );

               expect( testBed_.scope.model.resources[ 0 ].data ).toEqual( { 'items': [ 42 ] } );
            } );

            testBed_.eventBusMock.subscribe( 'didTakeAction.action3', function() {

               wasCalled2 = true;
               testBed_.eventBusMock.publish( 'didUpdate.' + actions.action3.resource, {
                  resource: actions.action3.resource,
                  patches: [
                     { op: 'replace', path: '/myKey', value: 'newValue' }
                  ]
               } );
               jasmine.Clock.tick( 0 );

               expect( testBed_.scope.model.actions.action3.data ).toEqual( undefined );
            } );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );

            testBed_.eventBusMock.publish( 'takeActionRequest.action1' );
            testBed_.eventBusMock.publish( 'takeActionRequest.action2' );
            testBed_.eventBusMock.publish( 'takeActionRequest.action3' );
            jasmine.Clock.tick( 0 );

            expect( wasCalled1 ).toBe( true );
            expect( wasCalled2 ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( '[A2.7] publishes content from external locations ', function() {
            setup( { resources: [ resourceExternal ] } );

            var $httpBackend = null;
            inject( function( $injector ) {
               $httpBackend = $injector.get( '$httpBackend' );
               $httpBackend.when( 'GET', resourceExternal.location ).respond( externalContent );
            } );

            var wasCalled = false;
            testBed_.eventBusMock.subscribe( 'didReplace.' + resourceExternal.resource, function( event ) {
               wasCalled = true;
               expect( event.resource ).toEqual( resourceExternal.resource );
               expect( event.data ).toEqual( externalContent );
            } );

            testBed_.eventBusMock.publish( 'beginLifecycleRequest' );
            jasmine.Clock.tick( 0 );
            $httpBackend.flush();
            jasmine.Clock.tick( 0 );

            expect( wasCalled ).toBe( true );

            expect( testBed_.scope.model.resources[ 0 ].data ).toEqual( externalContent );

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
         } );

      } );
   } );
} );
