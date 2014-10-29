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


      $scope.resources = {};
      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'spreadsheet', {onUpdateReplace: convertToTableModel} );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.$on( EVENT_AFTER_CHANGE, function( event ) {
         var modifiedResource = convertToResource();
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

      function convertToResource() {
         var tableModel = $scope.model.tableModel;

         var resource = {};
         resource.timeGrid = [];
         resource.series = [];

         var i;
         var j;
         if( tableModel.length > 0 ) {
            // Row of column headers exists.
            for( j = 0; j < tableModel[0].length; ++j ) {
               if( j > 0 ) {
                  resource.series.push( {label: tableModel[0][j], values: []} );
               }
            }
            for( i = 1; i < tableModel.length; ++i ) {
               for( j = 0; j < tableModel[i].length; ++j ) {
                  if( j === 0 ) {
                     // Row header
                     resource.timeGrid.push( tableModel[i][0] );
                  }
                  else {
                     // Data
                     resource.series[j - 1].values.push( parseFloat(tableModel[i][j]) );
                  }
               }
            }
         }

         return resource;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function convertToTableModel() {
         $scope.model.tableModel = [];
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
