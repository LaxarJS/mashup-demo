/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../resource_display_widget',
   'laxar/laxar_testing',
   'angular-mocks',
   'laxar_uikit/controls/i18n',
   'text!../default.theme/resource_display_widget.html'
], function( widgetModule, ax, angularMocks, axI18nModule, htmlCode ) {
   'use strict';

   describe( 'A ResourceDisplayWidget', function() {

      var initialResource = {
         name: 'Peter',
         cars: [
            {
               type: 'VW'
            },
            {
               type: 'DMC'
            }
         ]
      };

      var testBed_;
      var eventBus_;
      var scopeEventBus_;
      var element_;

      function setup( configuration ) {
         testBed_ = ax.testing.portalMocksAngular.createControllerTestBed( 'widgets.development.resource_display_widget' );
         angularMocks.module( 'laxar_uikit.controls.i18n' );
         testBed_.featuresMock = configuration;

         testBed_.useWidgetJson();
         testBed_.setup();

         eventBus_ = testBed_.eventBusMock;
         scopeEventBus_ = testBed_.scope.eventBus;

         eventBus_.publish( 'didChangeLocale.default', { locale: 'default', languageTag: 'en' } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature display', function() {

         beforeEach( function() {
            setup ( {
               display: {
                  resource: 'myDemoResource',
                  i18nHtmlLabel: { en: '<h3>My Demo Resource</h3>' }
               }
            } );

         } );

         beforeEach( angularMocks.inject( function( $compile ) {
            var code = '<div id="widget">'  + htmlCode + '</div>';
            element_ = $compile( code )( testBed_.scope );
         } ) );

         beforeEach( function() {
            eventBus_.publish( 'didReplace.myDemoResource', {
               resource: 'myDemoResource',
               data: initialResource
            } );
            jasmine.Clock.tick( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'acts as slave for the configured resource (A1.1)', function() {
            expect( scopeEventBus_.subscribe )
               .toHaveBeenCalledWith( 'didReplace.myDemoResource', jasmine.any( Function ) );
            expect( scopeEventBus_.subscribe )
               .toHaveBeenCalledWith( 'didUpdate.myDemoResource', jasmine.any( Function ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'displays the current state of the resource after replace (A1.2)', function() {
            expect( element_.find( 'pre' ).css( 'display' ) ).not.toEqual( 'none' );
            expect( element_.find( 'pre' ).html() ).toEqual( JSON.stringify( initialResource, null, 3 ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when an didUpdate event occured', function() {

            beforeEach( function() {
               eventBus_.publish( 'didUpdate.myDemoResource', {
                  resource: 'myDemoResource',
                  patches: [
                     { op: 'replace', path: '/name', value: 'Hans' },
                     { op: 'add', path: '/cars/2', value: { type: 'Hanomag' } }
                  ]
               } );
               jasmine.Clock.tick( 0 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'display the new version of the resource (A1.2)', function() {
               var newResource = JSON.parse( JSON.stringify( initialResource ) );
               newResource.name = 'Hans';
               newResource.cars[2] = { type: 'Hanomag' };

               expect( element_.find( 'pre' ).html() ).toEqual( JSON.stringify( newResource, null, 3 ) );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'displays a configured html label if available (A1.3)', function() {
            expect( element_.find( 'pre' ).hasClass( 'ng-hide' ) ).toBe( false );
            expect( element_.find( 'div' ).html().toLowerCase() ).toEqual( '<h3>my demo resource</h3>' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature display and no resource configured', function() {

         beforeEach( function() {
            setup ( {
               display: { }
            } );
         } );

         beforeEach( angularMocks.inject( function( $compile ) {
            var code = '<div id="widget">'  + htmlCode + '</div>';
            element_ = $compile( code )( testBed_.scope );
         } ) );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'doesn\'t display the resource section (A1.4)', function() {
            testBed_.scope.$apply();
            expect( element_.find( 'pre' ).hasClass( 'ng-hide' ) ).toBe( true );
         } );
      } );

   } );
} );
