/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */


import * as axMocks from 'laxar-mocks';
import * as ax from 'laxar';
import * as patterns from 'laxar-patterns';
import { specData } from './spec_data';

describe( 'A table-editor-widget', () => {
   let widgetEventBus;
   let widgetScope;
   let testEventBus;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure( 'timeSeries.resource', 'timeSeriesData' );
   } );

   beforeEach( axMocks.widget.load );

   beforeEach( () => {
      widgetScope = axMocks.widget.$scope;
      widgetEventBus = axMocks.widget.axEventBus;
      testEventBus = axMocks.eventBus;
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( axMocks.tearDown );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature timeSeries', () => {

      beforeEach( () => {

         testEventBus.publish( 'didReplace.timeSeriesData', {
            resource: 'timeSeriesData',
            data: specData.originalResource
         } );
         testEventBus.flush();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'acts as a slave for the configured resource', () => {
         expect( widgetEventBus.subscribe )
               .toHaveBeenCalledWith( 'didReplace.timeSeriesData', jasmine.any( Function ) );
         expect( widgetEventBus.subscribe )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', jasmine.any( Function ) );
         expect( widgetScope.resources.timeSeries ).toEqual( specData.originalResource );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'shows the published resource as the data model of the table', () => {
         expect( widgetScope.model.tableModel ).toEqual( specData.expectedTableModel );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'publishes a didUpdate event after the user changed a data value', () => {
         widgetScope.model.tableModel[ 1 ][ 1 ] = 11;
         widgetScope.$emit( 'axTableEditor.afterChange' );

         const expectedResource = ax.object.deepClone( specData.originalResource );
         expectedResource.series[ 0 ].values[ 0 ] = 11;
         const patch = patterns.json.createPatch( specData.originalResource, expectedResource );

         expect( widgetEventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', {
                  resource: 'timeSeriesData',
                  patches: patch
               }, jasmine.any( Object ) );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'ignores rows on which the time grid tick is removed in the didUpdate event data', () => {
         widgetScope.model.tableModel[ 2 ][ 0 ] = null;
         widgetScope.$emit( 'axTableEditor.afterChange' );

         const expectedResource = specData.expectedResourceWithRemovedTimeGridTick;
         const patch = patterns.json.createPatch( specData.originalResource, expectedResource );

         expect( widgetEventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', {
                  resource: 'timeSeriesData',
                  patches: patch
               }, jasmine.any( Object ) );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'ignores columns on which the series label is removed in the didUpdate event data', () => {
         widgetScope.model.tableModel[ 0 ][ 2 ] = null;
         widgetScope.$emit( 'axTableEditor.afterChange' );

         const expectedResource = specData.expectedResourceWithRemovedSeriesLabel;
         const patch = patterns.json.createPatch( specData.originalResource, expectedResource );

         expect( widgetEventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.timeSeriesData', {
                  resource: 'timeSeriesData',
                  patches: patch
               }, jasmine.any( Object ) );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'replaces the resource and model after receiving a new resource', () => {
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
