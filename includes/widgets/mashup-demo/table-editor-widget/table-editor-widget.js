/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar-patterns',
   'moment',
   'handsontable',
   'css!handsontable',
   'jquery-ui/ui/datepicker'
], function( ng, ax, patterns, moment, handsontable ) {
   'use strict';

   var moduleName = 'tableEditorWidget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var EVENT_AFTER_CHANGE = 'axTableEditor.afterChange';

   Controller.$inject = ['$scope'];

   function Controller( $scope ) {

      $scope.model = {
         settings: {
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            fillHandle: true,
            stretchH: 'all'
         },
         tableModel: []
      };
      $scope.resources = {};

      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'timeSeries', {
         onUpdateReplace: updateTableModel
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.$on( EVENT_AFTER_CHANGE, function() {
         var modifiedResource = getTimeSeriesFromTableModel();
         var patches = patterns.json.createPatch( $scope.resources.timeSeries, modifiedResource );
         publishUpdate( $scope.features.timeSeries.resource, patches );
         $scope.resources.timeSeries = modifiedResource;

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishUpdate( resourceName, patches ) {
         $scope.eventBus.publish( 'didUpdate.' + resourceName, {
            resource: resourceName,
            patches: patches
         }, { deliverToSender: false } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function getTimeSeriesFromTableModel() {
         var tableModel = $scope.model.tableModel;
         var timeSeries = ax.object.deepClone( $scope.resources.timeSeries );

         timeSeries.timeGrid = tableModel
            .map( function( row ) {
               return row[0] && moment( row[0], 'YYYY-MM-DD' ).isValid() && moment( row[0], 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' );
            } )
            .filter( function( timeTick, rowIndex ) {
               return rowIndex > 0 && moment( timeTick, 'YYYY-MM-DD' ).isValid();
            } );

         timeSeries.series = tableModel[0].map( function( columnLabel ) {
            return {
               label: columnLabel
            };
         } );
         timeSeries.series.forEach( function( timeSeries, timeSeriesKey ) {
            timeSeries.values = tableModel
               .map( function( row ) {
                  return row[timeSeriesKey] !== '' ? parseFloat( row[timeSeriesKey] ) : null;
               } )
               .filter( function( value, rowIndex ) {
                  return rowIndex > 0 && moment( tableModel[rowIndex][0], 'YYYY-MM-DD' ).isValid();
               } );
         } );
         timeSeries.series = timeSeries.series.filter( function( timeSeries ) {
            return timeSeries.label !== null && timeSeries.label !== '';
         } );

         return timeSeries;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updateTableModel() {
         var timeSeries = $scope.resources.timeSeries;

         $scope.model.tableModel = timeSeries.timeGrid.map( function( rowHeader, row ) {
            var rowData = timeSeries.series.map( function( value, col ) {
               return value.values[row];
            } );
            rowData.unshift( rowHeader );
            return rowData;
         } );

         var colHeaders = [null].concat( timeSeries.series.map( function( value ) {
            return value.label;
         } ) );
         $scope.model.tableModel.unshift( colHeaders );
      }

   }

   module.controller( 'TableEditorWidgetController', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directiveName = 'axTableEditor';
   module.directive( directiveName, [function() {

      return {
         scope: {
            axTableEditor: '=',
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

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function completeSettings() {
               var settings = ax.object.options( $scope[directiveName], baseSettings );
               settings.cells = function( row, col, prop ) {
                  if( row > 0 && col === 0 ) {
                     return {
                        type: 'date',
                        renderer: handsontable.DateCell.renderer,
                        dateFormat: 'YYYY-MM-DD'
                     };
                  }
               };
               return ax.object.options( {
                  data: $scope[directiveName + 'Rows'] || []
               }, settings );
            }
         }
      };
   }] );

   return module;

} );
