/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar_patterns',
   'css!handsontable',
   'handsontable'

], function( ng, ax, patterns ) {

   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var EVENT_AFTER_CHANGE = 'axTableEditor.afterChange';

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {

      $scope.model = {};

      $scope.model.settings = {
         rowHeaders: true,
         colHeaders: true,
         contextMenu: true,
         fillHandle: true
      };
      $scope.model.columns = [];

      $scope.model.tableModel = [];

      $scope.resources = {};
      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'spreadsheet', {onUpdateReplace: updateTableModel} );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.$on( EVENT_AFTER_CHANGE, function( event ) {
         var modifiedResource = getSpreadsheetFromTableModel();
         var patch = patterns.json.createPatch( $scope.resources.spreadsheet, modifiedResource );

         var resourceName = $scope.features.spreadsheet.resource;
         $scope.eventBus.publish( 'didUpdate.' + resourceName, {
            resource: resourceName,
            patches: patch
         }, {
            deliverToSender: false
         } );

         $scope.resources.spreadsheet = modifiedResource;

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function getSpreadsheetFromTableModel() {
         var tableModel = $scope.model.tableModel;

         // Clone original resource to keep attributes that cannot be reproduced by the table model.
         var spreadsheet = ax.object.deepClone( $scope.resources.spreadsheet );
         spreadsheet.timeGrid = [];
         spreadsheet.series = [];

         var i;
         var j;
         if( tableModel.length > 0 ) {
            // First row is expected to be a row of column headers.
            for( j = 0; j < tableModel[0].length; ++j ) {
               if (j === 0) {
                  // Upper left corner: ignore.
               }
               else {
                  // Column header
                  if (tableModel[0][j] !== null && tableModel[0][j] !== '') {
                     spreadsheet.series.push( { label: tableModel[0][j], values: [] } );
                  }
                  // Otherwise (missing column header): drop the series.
               }
            }
            for( i = 1; i < tableModel.length; ++i ) {
               var seriesIndex = 0;
               for( j = 0; j < tableModel[i].length; ++j ) {
                  if( j === 0 ) {
                     // Row header
                     if( tableModel[i][0] === null || tableModel[i][0] === '' ) {
                        // Missing time grid tick: drop the tick and all corresponding values.
                        break;
                     }
                     spreadsheet.timeGrid.push( tableModel[i][0] );
                  }
                  else {
                     if (tableModel[0][j] !== null && tableModel[0][j] !== '') {
                        // Data cell: convert to number.
                        spreadsheet.series[seriesIndex].values.push( parseFloat( tableModel[i][j] ) );
                        seriesIndex++;
                     }
                     // Otherwise (missing column header): drop the series.
                  }
               }
            }
         }

         return spreadsheet;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

<<<<<<< HEAD
      function convertToTableModel() {
//         $scope.model.tableModel = [];
//         var spreadsheet = $scope.resources.spreadsheet;
//
//         // Column headers
//         var colHeaders = [];
//         colHeaders.push( null );
//         spreadsheet.series.forEach( function( value, key ) {
//            colHeaders.push( value.label );
//         } );
//         $scope.model.tableModel.push( colHeaders );
//
//         // Data area
//         spreadsheet.timeGrid.forEach( function( rowHeader, row ) {
//            var tableDataRow = row + 1;
//            var rowData = [];
//            rowData.push( rowHeader );
//            $scope.model.tableModel.push( rowData );
//            spreadsheet.series.forEach( function( value, col ) {
//               $scope.model.tableModel[ tableDataRow ].push( value.values[ row ] );
//            } );
//         } );
=======
      function updateTableModel() {
         var spreadsheet = $scope.resources.spreadsheet;

         // Column headers
         var colHeaders = [];
         colHeaders.push( null );
         spreadsheet.series.forEach( function( value, key ) {
            colHeaders.push( value.label );
         } );
         $scope.model.tableModel.push( colHeaders );

         // Data area
         spreadsheet.timeGrid.forEach( function( rowHeader, row ) {
            var tableDataRow = row + 1;
            var rowData = [];
            rowData.push( rowHeader );
            $scope.model.tableModel.push( rowData );
            spreadsheet.series.forEach( function( value, col ) {
               $scope.model.tableModel[ tableDataRow ].push( value.values[ row ] );
            } );
         } );
>>>>>>> master
      }
   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directiveName = 'axTableEditor';
   module.directive( directiveName, [ function() {
      return {
         scope: {
            axTableEditor: '=',
            axTableEditorColumns: '=',
            axTableEditorRows: '='
         },
         link: function( $scope, $element ) {

            var baseSettings = {
               afterChange: function( changes ) {
                  // changes is defined if loadData was not used:
                  if( changes ) {
                     $scope.$emit( EVENT_AFTER_CHANGE );
                  }
               },
               afterRemoveCol: function() {
                  $scope.$emit( EVENT_AFTER_CHANGE );
               },
               afterRemoveRow: function() {
                  $scope.$emit( EVENT_AFTER_CHANGE );
               },
               afterCreateCol: function() {
                  $scope.$emit( EVENT_AFTER_CHANGE );
               },
               afterCreateRow: function() {
                  $scope.$emit( EVENT_AFTER_CHANGE );
               }
            };

            var a = completeSettings();
            console.log( a );
            $element.handsontable( a );

            $scope.$watch( directiveName, function( newSettings ) {
               if( newSettings ) {
                  $element.handsontable( 'updateSettings', completeSettings() );
               }
            }, true );

            $scope.$watch( directiveName + 'Rows', function( newRows ) {
               $element.handsontable( 'loadData', newRows );
            }, true );

            $scope.$watch( directiveName + 'Columns', function() {
               $element.handsontable( 'updateSettings', completeSettings() );
            }, true );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function completeSettings() {
               var settings = ax.object.options( $scope[ directiveName ], baseSettings );
               var columnSettings = $scope[ directiveName + 'Columns' ];
               var dummy = [];

               console.log( dummy );
               return ax.object.options( {
                  data: dummy,
                  columns: columnSettings.length ? columnSettings : undefined
               }, settings );
            }
         }
      };
   } ] );

   return module;

} );
