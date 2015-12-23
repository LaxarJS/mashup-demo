/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'json!../widget.json',
   'laxar-mocks',
   'laxar',
   'laxar-patterns',
   './spec_data'
], function( descriptor, axMocks, ax, patterns, specData ) {
   'use strict';

   describe( 'A TableEditorWidget', function() {
      var widgetEventBus;
      var widgetScope;
      var testEventBus;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach( axMocks.createSetupForWidget( descriptor, {
         knownMissingResources: [ 'laxar-date-picker-control.css ' ]
      } ) );

      beforeEach( function() {
         axMocks.widget.configure( {
            timeSeries: {
               resource: 'timeSeriesData'
            }
         } );
      } );

      beforeEach( axMocks.widget.load );

      beforeEach( function() {
         widgetScope = axMocks.widget.$scope;
         widgetEventBus = axMocks.widget.axEventBus;
         testEventBus = axMocks.eventBus;
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         axMocks.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with feature timeSeries', function() {

         beforeEach( function() {

            testEventBus.publish( 'didReplace.timeSeriesData', {
               resource: 'timeSeriesData',
               data: specData.originalResource
            } );
            testEventBus.flush();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'acts as a slave for the configured resource', function() {
            expect( widgetEventBus.subscribe )
               .toHaveBeenCalledWith( 'didReplace.timeSeriesData', jasmine.any( Function ) );
            expect( widgetEventBus.subscribe )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', jasmine.any( Function ) );
            expect( widgetScope.resources.timeSeries ).toEqual( specData.originalResource );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'shows the published resource as the data model of the table', function() {
            expect( widgetScope.model.tableModel ).toEqual( specData.expectedTableModel );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didUpdate event after the user changed a data value', function() {
            widgetScope.model.tableModel[1][1] = 11;
            widgetScope.$emit( 'axTableEditor.afterChange' );

            var expectedResource = ax.object.deepClone( specData.originalResource );
            expectedResource.series[ 0 ].values[ 0 ] = 11;
            var patch = patterns.json.createPatch( specData.originalResource, expectedResource );

            expect( widgetEventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', {
                  resource: 'timeSeriesData',
                  patches: patch
               }, jasmine.any( Object ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'ignores rows on which the time grid tick is removed in the didUpdate event data', function() {
            widgetScope.model.tableModel[2][0] = null;
            widgetScope.$emit( 'axTableEditor.afterChange' );

            var expectedResource = specData.expectedResourceWithRemovedTimeGridTick;
            var patch = patterns.json.createPatch( specData.originalResource, expectedResource );

            expect( widgetEventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', {
                  resource: 'timeSeriesData',
                  patches: patch
               }, jasmine.any( Object ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'ignores columns on which the series label is removed in the didUpdate event data', function() {
            widgetScope.model.tableModel[0][2] = null;
            widgetScope.$emit( 'axTableEditor.afterChange' );

            var expectedResource = specData.expectedResourceWithRemovedSeriesLabel;
            var patch = patterns.json.createPatch( specData.originalResource, expectedResource );

            expect( widgetEventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', {
                  resource: 'timeSeriesData',
                  patches: patch
               }, jasmine.any( Object ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'replaces the resource and model after receiving a new resource', function() {
            testEventBus.publish( 'didReplace.timeSeriesData', {
               resource: 'timeSeriesData',
               data: specData.otherResource
            } );
            testEventBus.flush();
            expect( widgetScope.resources.timeSeries ).toEqual( specData.otherResource );
            expect( widgetScope.model.tableModel ).toEqual( specData.expectedTableModelForOtherResource );
         } );
      } );

   } );
} );
