/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   '../table_editor_widget',
   'laxar/laxar_testing',
   'json!./spec_data.json'
], function( widgetModule, ax, specData ) {
   'use strict';

   describe( 'A TableEditorWidget', function() {

      var testBed_;

      beforeEach( function setup() {
         testBed_ = ax.testing.portalMocksAngular.createControllerTestBed( widgetModule.name );
         testBed_.featuresMock = {
            spreadsheet: {
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

      describe( 'with feature spreadsheet', function() {

         beforeEach( function() {

            testBed_.eventBusMock.publish( 'didReplace.spreadsheetData', {
               resource: 'spreadsheetData',
               data: specData.sourceData
            } );
            jasmine.Clock.tick( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'acts as a slave for a configured resource.', function() {
            expect( testBed_.scope.eventBus.subscribe )
               .toHaveBeenCalledWith( 'didReplace.spreadsheetData', jasmine.any( Function ) );
            expect( testBed_.scope.eventBus.subscribe )
               .toHaveBeenCalledWith( 'didUpdate.spreadsheetData', jasmine.any( Function ) );
            expect( testBed_.scope.resources.spreadsheet ).toEqual( specData.sourceData );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'shows the published resource as the data model of the table.', function() {
            expect( testBed_.scope.model.tableModel ).toEqual( specData.expectedData );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

   } );
} );
