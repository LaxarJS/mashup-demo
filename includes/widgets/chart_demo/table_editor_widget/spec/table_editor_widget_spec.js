/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   '../table_editor_widget',
   'laxar/laxar_testing',
   'laxar_patterns',
   'json!./spec_data.json'
], function( widgetModule, ax, patterns, specData ) {
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

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'publishes a didUpdate event after the user changed a data value.', function() {

            testBed_.scope.model.tableModel[1][1] = 11;
            testBed_.scope.$emit( 'axTableEditor.afterChange' );

            var modifiedResource = ax.object.deepClone( specData.sourceData );
            modifiedResource.series[ 0 ].data[ 0 ] = 11;
            var patch = patterns.json.createPatch( specData.sourceData, modifiedResource );

            expect( testBed_.scope.eventBus.publish )
               .toHaveBeenCalledWith( 'didUpdate.spreadsheetData', {
                  resource: 'spreadsheetData',
                  patches: patch
               },{
                  deliverToSender: false
               } );
         } );


      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

   } );
} );
