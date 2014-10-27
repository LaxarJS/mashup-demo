/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../command_bar_widget',
   'laxar/laxar_testing',
   './command_bar_widget_data'
], function( navigator, ax, testData ) {
   'use strict';

   var testBed_;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A CommandBarWidget', function() {

      beforeEach( function setup() {
         testBed_ = testBedAfterDidNavigate( this, { buttons: [] } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'defines three distinct areas for buttons (A1.1)', function() {
         expect( testBed_.scope.model.areas.left ).toBeDefined();
         expect( testBed_.scope.model.areas.center ).toBeDefined();
         expect( testBed_.scope.model.areas.right ).toBeDefined();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'renders no buttons by default', function() {
         expect( testBed_.scope.model.areas.left.length ).toBe( 0 );
         expect( testBed_.scope.model.areas.center.length ).toBe( 0 );
         expect( testBed_.scope.model.areas.right.length ).toBe( 0 );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A CommandBarWidget with some custom buttons', function() {

      describe( 'when no buttons are disabled', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.customAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'puts them into the correct areas (A1.2, A2.4)', function() {
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action1' );
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action2' );
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action3' );
            expect( testBed_.scope.model.areas.center ).toContainButtonWithAction( 'action4' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'action5' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index (A2.4)', function() {
            expect( testBed_.scope.model.areas.left[0] ).toHaveAction( 'action3' );
            expect( testBed_.scope.model.areas.left[1] ).toHaveAction( 'action1' );
            expect( testBed_.scope.model.areas.left[2] ).toHaveAction( 'action2' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the css class for class-attribute (A2.5)', function() {
            expect( testBed_.scope.model.areas.right[0].classes[ 'btn-success' ] ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the css class for size-attribute (A2.6)', function() {
            expect( testBed_.scope.model.areas.center[0].classes[ 'btn-sm' ] ).toBe( true );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when some buttons are disabled', function() {

         beforeEach( function() {
            testData.customAllEnabledButtons.buttons[1].enabled = false;
            testData.customAllEnabledButtons.buttons[3].enabled = false;
            testBed_ = testBedAfterDidNavigate( this, testData.customAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            testData.customAllEnabledButtons.buttons[1].enabled = true;
            testData.customAllEnabledButtons.buttons[3].enabled = true;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'does not render these buttons (A2.1)', function() {
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action1' );
            expect( testBed_.scope.model.areas.left ).not.toContainButtonWithAction( 'action2' );
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action3' );
            expect( testBed_.scope.model.areas.center ).not.toContainButtonWithAction( 'action4' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'action5' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when no buttons are disabled and some buttons have index and some have no index', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.sortTestButtons.customButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index (A2.4)', function() {
            var buttonOrder = [ 15, 1, 2, 3, 4, 5, 10, 11, 6, 12, 13, 7, 14, 8, 9 ];
            testBed_.scope.model.areas.left.forEach( function( button, i ) {
               expect( button ).toHaveAction( 'action' + buttonOrder[ i ] );
            } );
         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A CommandBarWidget with some default buttons', function() {

      describe( 'when no buttons are disabled', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'puts them into the correct areas (A3.1)', function() {
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'previous' );
            expect( testBed_.scope.model.areas.center ).toContainButtonWithAction( 'help' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'next' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'cancel' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index (A3.1)', function() {
            expect( testBed_.scope.model.areas.right[0] ).toHaveAction( 'cancel' );
            expect( testBed_.scope.model.areas.right[1] ).toHaveAction( 'next' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when some buttons are disabled', function() {

         beforeEach( function() {
            testData.defaultAllEnabledButtons.previous.enabled = false;
            testData.defaultAllEnabledButtons.next.enabled = false;
            testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            testData.defaultAllEnabledButtons.previous.enabled = true;
            testData.defaultAllEnabledButtons.next.enabled = true;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'does not render these buttons (A3.1)', function() {
            expect( testBed_.scope.model.areas.left ).not.toContainButtonWithAction( 'previous' );
            expect( testBed_.scope.model.areas.center ).toContainButtonWithAction( 'help' );
            expect( testBed_.scope.model.areas.right ).not.toContainButtonWithAction( 'next' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'cancel' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'and some of the buttons have index and some have no index', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.sortTestButtons.defaultButtons );
         } );

         //////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index and inserts default buttons before custom buttons having the same index', function() {
            var buttonOrder = [ 11, 7, 8, 1, 3, 4, 5, 9, 12, 10, 2 ];
            testBed_.scope.model.areas.left.forEach( function( button, i ) {
               expect( button ).toHaveAction( 'action' + buttonOrder[ i ] );
            } );
         } );

      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A CommandBarWidget with both custom and default buttons', function() {

      describe( '', function() {

         var originalCustomButtons;

         beforeEach( function() {
            originalCustomButtons = testData.defaultAllEnabledButtons.buttons;
            var features = testData.defaultAllEnabledButtons;
            features.buttons = testData.customAllEnabledButtons.buttons;

            testBed_ = testBedAfterDidNavigate( this, features );
            changeLocale( 'en_US' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            testData.defaultAllEnabledButtons.buttons = originalCustomButtons;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'inserts default buttons before custom buttons having the same index', function() {
            expect( testBed_.scope.model.areas.right[0] ).toHaveAction( 'cancel' );
            expect( testBed_.scope.model.areas.right[1] ).toHaveAction( 'action5' );
            expect( testBed_.scope.model.areas.right[2] ).toHaveAction( 'next' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a view label for a simple string (A2.2)', function() {
            expect( testBed_.scope.model.areas.right[1].htmlLabel ).toEqual( 'Action 5' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a view label for a localizable object based on the current locale (A2.2)', function() {
            changeLocale( 'de' );
            var next = testBed_.scope.model.areas.right[2];
            expect( next.htmlLabel ).toEqual( '<i class=\"icon-circle-arrow-right\"></i> Weiter' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and some of the buttons have index and some have no index', function() {

            beforeEach( function() {
               testBed_ = testBedAfterDidNavigate( this, testData.sortTestButtons.defaultAndCustomButtons );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'sorts them by their index and inserts default buttons before custom buttons having the same index', function() {
               var buttonOrder = [ 16, 15, 1, 2, 3, 4, 5, 10, 11, 18, 6, 12, 13, 7, 14, 17, 8, 9 ];
               testBed_.scope.model.areas.left.forEach( function( button, i ) {
                  expect( button ).toHaveAction( 'action' + buttonOrder[ i ] );
               } );
            } );

         } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   describe( 'A CommandBarWidget with buttons with same action', function() {

      beforeEach( function() {
         testBed_ = testBedAfterDidNavigate( this, testData.customWithSameAction );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      it( 'has individual ids for each button', function() {        
         expect( testBed_.scope.model.areas.left[ 0 ].id ).not.
            toEqual( testBed_.scope.model.areas.left[ 1 ].id );
      } );      
      
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   describe( 'A CommandBarWidget with buttons', function() {

      beforeEach( function() {
         testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when a button is pressed', function() {

         var actionEvent;
         var actionEventName;
         var signalActionFinished;
         var nextButton;

         beforeEach( function() {
            nextButton = testBed_.scope.model.areas.right[ 1 ];

            var action;
            testBed_.scope.eventBus.subscribe( 'takeActionRequest', function( event, meta ) {
               action = event.action;
               actionEvent = event;
               actionEventName = meta.name;
               testBed_.scope.eventBus.publish( 'willTakeAction.' + action, { sender: 'spec' } );
               jasmine.Clock.tick( 0 );
            } );
            signalActionFinished = function() {
               testBed_.scope.eventBus.publish( 'didTakeAction.' + action, { sender: 'spec' } );
               jasmine.Clock.tick( 0 );
            };
            testBed_.scope.handleButtonClicked( nextButton );
            jasmine.Clock.tick( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'an event with the configured action is published', function() {
            expect( actionEventName ).toEqual( 'takeActionRequest.next' );
            expect( actionEvent.action ).toEqual( 'next' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'the according button has the css class is-active as long as the action is ongoing', function() {
            expect( nextButton.classes[ 'ax-active' ] ).toBe( true );

            signalActionFinished();

            expect( nextButton.classes[ 'ax-active' ] ).toBe( false );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sends the button\'s id as event.anchorDomElement (jira ATP-7038)', function() {
            expect( actionEvent.anchorDomElement ).toEqual( testBed_.scope.id( 'next_0' ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////
         
         describe( 'and the button is pressed again before a didTakeAction event was received ATP-8017)', function() {

            it( 'doesn\'t publish a takeActionRequest event twice', function() {
               expect( actionEventName ).toEqual( 'takeActionRequest.next' );
               
               actionEventName = 'resetEventName';
               testBed_.scope.handleButtonClicked( nextButton );
               jasmine.Clock.tick( 0 );
               expect( actionEventName ).toEqual( 'resetEventName' );
               
               signalActionFinished();
               testBed_.scope.handleButtonClicked( nextButton );
               jasmine.Clock.tick( 0 );
               expect( actionEventName ).toEqual( 'takeActionRequest.next' );
            } );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when configured flags change', function() {

         var mySpy;
         var nextButton;
         var helpButton;
         var previousButton;

         function publishFlagChange( flag, state ) {
            testBed_.scope.eventBus.publish( 'didChangeFlag.' + flag + '.' + state, {
               flag: flag,
               state: state
            } );
            jasmine.Clock.tick( 0 );
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         beforeEach( function() {
            mySpy = jasmine.createSpy( 'takeActionRequestSpy' );
            testBed_.scope.eventBus.subscribe( 'takeActionRequest', mySpy );

            nextButton = testBed_.scope.model.areas.right[1];
            helpButton = testBed_.scope.model.areas.center[0];
            previousButton = testBed_.scope.model.areas.left[0];

            publishFlagChange( 'helpAvailable', true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'on true the according css classes are applied (A2.7)', function() {
            expect( nextButton.classes['ax-invisible'] ).toBe( false );
            expect( nextButton.classes['ax-busy'] ).toBe( false );
            expect( helpButton.classes['ax-omitted'] ).toBe( false );
            expect( previousButton.classes['ax-disabled'] ).toBe( false );

            publishFlagChange( 'guestUser', true );
            publishFlagChange( 'navigation', true );
            publishFlagChange( 'helpAvailable', false );
            publishFlagChange( 'notUndoable', true );

            expect( nextButton.classes['ax-invisible'] ).toBe( true );
            expect( nextButton.classes['ax-busy'] ).toBe( true );
            expect( helpButton.classes['ax-omitted'] ).toBe( true );
            expect( previousButton.classes['ax-disabled'] ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when all flags are active', function() {

            beforeEach( function() {
               publishFlagChange( 'guestUser', true );
               publishFlagChange( 'navigation', true );
               publishFlagChange( 'helpAvailable', false );
               publishFlagChange( 'notUndoable', true );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'on false the according css classes are removed (A2.7)', function() {
               expect( nextButton.classes['ax-invisible'] ).toBe( true );
               expect( nextButton.classes['ax-busy'] ).toBe( true );
               expect( helpButton.classes['ax-omitted'] ).toBe( true );
               expect( previousButton.classes['ax-disabled'] ).toBe( true );

               publishFlagChange( 'guestUser', false );
               publishFlagChange( 'navigation', false );
               publishFlagChange( 'helpAvailable', true );
               publishFlagChange( 'notUndoable', false );

               expect( nextButton.classes['ax-invisible'] ).toBe( false );
               expect( nextButton.classes['ax-busy'] ).toBe( false );
               expect( helpButton.classes['ax-omitted'] ).toBe( false );
               expect( previousButton.classes['ax-disabled'] ).toBe( false );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'no user interaction is possible', function() {
               testBed_.scope.handleButtonClicked( nextButton );
               testBed_.scope.handleButtonClicked( helpButton );
               testBed_.scope.handleButtonClicked( previousButton );
               jasmine.Clock.tick( 0 );

               expect( mySpy.callCount ).toBe( 0 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'on false user interaction is possible again', function() {
               publishFlagChange( 'guestUser', false );
               publishFlagChange( 'navigation', false );
               publishFlagChange( 'helpAvailable', true );
               publishFlagChange( 'notUndoable', false );

               testBed_.scope.handleButtonClicked( nextButton );
               testBed_.scope.handleButtonClicked( helpButton );
               testBed_.scope.handleButtonClicked( previousButton );
               jasmine.Clock.tick( 0 );

               expect( mySpy.callCount ).toBe( 3 );
            } );

         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A CommandBarWidget', function() {

      function setup( self, layout ) {
         var features = {
            buttons: [
               { i18nHtmlLabel: 'Action 1', action: 'action1' },
               { i18nHtmlLabel: 'Action 2', action: 'action2' }
            ]
         };

         if( layout ) {
            features.layout = layout;
         }

         testBed_ = testBedAfterDidNavigate( self, features );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with no explicit layout configuration', function() {

         it( 'displays the buttons horizontally', function() {
            setup( this );
            expect( testBed_.scope.model.layout ).toEqual( 'ax-local-horizontal' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with configured layout variant HORIZONTAL', function() {

         it( 'displays the buttons horizontally', function() {
            setup( this, { variant: 'HORIZONTAL' } );
            expect( testBed_.scope.model.layout ).toEqual( 'ax-local-horizontal' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with configured layout variant VERTICAL', function() {

         it( 'displays the buttons horizontally', function() {
            setup( this, { variant: 'VERTICAL' } );
            expect( testBed_.scope.model.layout ).toEqual( 'ax-local-vertical' );
         } );

      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'A CommandBarWidget', function() {

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'without area configuration', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
         } );

         ////////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a model with empty style classes for columnWidth (A1.7)', function() {

            expect( testBed_.scope.model.areaClasses.left ).toEqual( [] );
            expect( testBed_.scope.model.areaClasses.center ).toEqual( [] );
            expect( testBed_.scope.model.areaClasses.right ).toEqual( [] );

         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with area configuration', function() {

         var features;

         beforeEach( function() {
            features = testData.defaultAllEnabledButtons;
            features.areas = {
               left: { columnWidth: 3 },
               center: { columnWidth: 9 },
               right: { columnWidth: 0 }
            };
            testBed_ = testBedAfterDidNavigate( this, features );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            delete features.areas;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a model with style classes for columnWidth (A1.7)', function() {
            expect( testBed_.scope.model.areaClasses.left ).toEqual( [ 'col-lg-3' ] );
            expect( testBed_.scope.model.areaClasses.center ).toEqual( [ 'col-lg-9' ] );
            expect( testBed_.scope.model.areaClasses.right ).toEqual( [ 'col-lg-0' ] );
         } );

      } );

   } );
   
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function testBedAfterDidNavigate( self, features ) {
      addButtonMatchers( self );

      var testBed = ax.testing.portalMocksAngular.createControllerTestBed( 'widgets.portal.command_bar_widget' );
      testBed.featuresMock = features;

      testBed.useWidgetJson();
      testBed.setup();

      return testBed;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function addButtonMatchers( self ) {
      self.addMatchers( {
         toContainButtonWithAction: function( expectedAction ) {
            var buttonList = this.actual;
            for( var i = 0; i < buttonList.length; ++i ) {
               if( buttonList[i].action === expectedAction ) {
                  return true;
               }
            }
            return false;
         },
         toHaveAction: function( expectedAction ) {
            return this.actual.action === expectedAction;
         }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function changeLocale( languageTag, locale ) {
      locale = locale || 'default';
      testBed_.eventBusMock.publish( 'didChangeLocale.' + locale, {
         locale: locale,
         languageTag: languageTag
      } );
      jasmine.Clock.tick( 0 );
   }

} );
