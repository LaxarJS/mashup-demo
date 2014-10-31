/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar_patterns',
   'handsontable',
   'css!handsontable',
   'jquery_ui/datepicker'
], function( ng, ax, patterns ) {

   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var EVENT_AFTER_CHANGE = 'axTableEditor.afterChange';

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {

      $scope.model = {};

      //FIXME: Content modification by callback legal here?
      //var dateRenderer = function (instance, td, row, col, prop, value, cellProperties) {
      //   Handsontable.DateCell.renderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
      //};

      $scope.model.settings = {
         rowHeaders: true,
         colHeaders: true,
         contextMenu: true,
         fillHandle: true,
         cells: function (row, col, prop) {
            if (row > 0 && col === 0) {
               return {
                  type: 'date',
                  renderer: Handsontable.DateCell.renderer, //FIXME: Content modification by callback legal here?
                  // We can simply pass any options to jquery-ui-datepicker here.
                  dateFormat: 'mm/dd/yy' // Format to be returned by jquery-ui-datepicker.
               };
            }
         }
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
               if( j === 0 ) {
                  // Upper left corner: ignore.
               }
               else {
                  // Column header
                  if( tableModel[0][j] !== null && tableModel[0][j] !== '' ) {
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
                     spreadsheet.timeGrid.push( dateToIso8601( parseAngloAmerican(tableModel[i][0]) ) );
                  }
                  else {
                     if( tableModel[0][j] !== null && tableModel[0][j] !== '' ) {
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

//      function getSpreadsheetFromTableModel() {
//         var tableModel = $scope.model.tableModel;
//
//         // Clone original resource to keep attributes that cannot be reproduced by the table model.
//         var spreadsheet = ax.object.deepClone( $scope.resources.spreadsheet );
//
//         var firstColumn = 0;
//         spreadsheet.timeGrid = tableModel.map( function( row ) {
//            return row[ firstColumn ];
//         } );
//         spreadsheet.timeGrid = spreadsheet.timeGrid.filter( function( timeTick ) {
//            return timeTick !== null && timeTick !== '';
//         } );
//
//         var firstRow = 0;
//         spreadsheet.series = tableModel[ firstRow ].map( function( columnLabel ) {
//            return {
//               label: columnLabel
//            };
//         } );
//         spreadsheet.series.forEach( function( timeSeries, timeSeriesKey ) {
//            var columnOfTimeSeries = timeSeriesKey;
//            timeSeries.values = tableModel.map( function( row ) {
//               return row[ columnOfTimeSeries ];
//            } );
//            timeSeries.values = timeSeries.values.filter( function( value, key ) {
//               return tableModel[ key ][ 0 ] !== null && tableModel[ key ][ 0 ] !== '';
//            } );
//         } );
//         spreadsheet.series = spreadsheet.series.filter( function( timeSeries ) {
//            return timeSeries.label !== null && timeSeries.label !== '';
//         } );
//
//         return spreadsheet;
//      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updateTableModel() {
         var spreadsheet = $scope.resources.spreadsheet;

         // Data area
         $scope.model.tableModel = spreadsheet.timeGrid.map( function( rowHeader, row ) {
            var rowData = spreadsheet.series.map( function( value, col ) {
               return value.values[ row ];
            } );
            rowData.unshift( dateToAngloAmerican( parseIso8601(rowHeader) ) );
            return rowData;
         } );

         // Column headers
         var colHeaders = [];
         colHeaders = spreadsheet.series.map( function( value ) {
            return value.label;
         } );
         colHeaders.unshift( null );
         $scope.model.tableModel.unshift( colHeaders );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function parseAngloAmerican(dateString) {
         // Try to parse by Date.parse() first.
         var date = new Date(dateString);
         if (!(date instanceof Object)) {
            var parts = dateString.split('-');
            date = new Date(parts[0], parts[1]-1, parts[2]);
         }
         return date;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function parseIso8601(dateString) {
         // Try to parse by Date.parse() first.
         var date = new Date(dateString);
         if (!(date instanceof Object)) {
            var parts = dateString.split('/');
            date = new Date(parts[2], parts[0]-1, parts[1]);
         }
         return date;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function dateToAngloAmerican( date ) {
         var dd = date.getDate();
         dd = '' + (dd < 10 ? '0' : '') + dd;
         var mm = date.getMonth() + 1;
         mm = '' + (mm < 10 ? '0' : '') + mm;
         var yy = date.getFullYear();
         return (mm + '/' + dd + '/' + yy);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function dateToIso8601( date ) {
         var dd = date.getDate();
         dd = '' + (dd < 10 ? '0' : '') + dd;
         var mm = date.getMonth() + 1;
         mm = '' + (mm < 10 ? '0' : '') + mm;
         var yy = date.getFullYear();
         return (yy + '-' + mm + '-' + dd);
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

            $element.handsontable( completeSettings() );

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
               return ax.object.options( {
                  data: $scope[ directiveName + 'Rows' ] || [],
                  columns: columnSettings.length ? columnSettings : undefined
               }, settings );
            }
         }
      };
   } ] );

   return module;

} );
