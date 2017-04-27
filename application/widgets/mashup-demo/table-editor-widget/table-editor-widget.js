/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import * as ng from 'angular';
import 'angular-sanitize';
import * as ax from 'laxar';
import * as patterns from 'laxar-patterns';
import * as moment from 'moment';
import Handsontable from 'handsontable';
import 'handsontable.css';
import 'laxar-uikit';


const EVENT_AFTER_CHANGE = 'axTableEditor.afterChange';

Controller.$inject = [ '$scope' ];

function Controller( $scope ) {

   $scope.model = {
      settings: {
         rowHeaders: true,
         colHeaders: true,
         contextMenu: true,
         fillHandle: true,
         renderAllRows: true,
         stretchH: 'all'
      },
      tableModel: []
   };
   $scope.resources = {};

   patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'timeSeries', {
      onUpdateReplace: updateTableModel
   } );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   $scope.$on( EVENT_AFTER_CHANGE, () => {
      const modifiedResource = getTimeSeriesFromTableModel();
      const patches = patterns.json.createPatch( $scope.resources.timeSeries, modifiedResource );
      publishUpdate( $scope.features.timeSeries.resource, patches );
      $scope.resources.timeSeries = modifiedResource;

   } );

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function publishUpdate( resourceName, patches ) {
      $scope.eventBus.publish( `didUpdate.${resourceName}`, {
         resource: resourceName,
         patches
      }, { deliverToSender: false } );
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function getTimeSeriesFromTableModel() {
      const tableModel = $scope.model.tableModel;
      const timeSeries = ax.object.deepClone( $scope.resources.timeSeries );

      timeSeries.timeGrid = tableModel
         .map( row => {
            return row[ 0 ] && moment( row[ 0 ], 'YYYY-MM-DD' ).isValid() &&
                   moment( row[ 0 ], 'YYYY-MM-DD' ).format( 'YYYY-MM-DD' );
         } )
         .filter( ( timeTick, rowIndex ) => {
            return rowIndex > 0 && moment( timeTick, 'YYYY-MM-DD' ).isValid();
         } );

      timeSeries.series = tableModel[ 0 ].map( columnLabel => {
         return {
            label: columnLabel
         };
      } );
      timeSeries.series.forEach( ( timeSeries, timeSeriesKey ) => {
         timeSeries.values = tableModel
            .map( row => {
               return row[ timeSeriesKey ] !== '' ? parseFloat( row[ timeSeriesKey ] ) : null;
            } )
            .filter( ( value, rowIndex ) => {
               return rowIndex > 0 && moment( tableModel[ rowIndex ][ 0 ], 'YYYY-MM-DD' ).isValid();
            } );
      } );
      timeSeries.series = timeSeries.series.filter( timeSeries => {
         return timeSeries.label !== null && timeSeries.label !== '';
      } );

      return timeSeries;
   }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateTableModel() {
      const timeSeries = $scope.resources.timeSeries;

      $scope.model.tableModel = timeSeries.timeGrid.map( ( rowHeader, row ) => {
         const rowData = timeSeries.series.map( value => {
            return value.values[ row ];
         } );
         rowData.unshift( rowHeader );
         return rowData;
      } );

      const colHeaders = [ null ].concat( timeSeries.series.map( value => {
         return value.label;
      } ) );
      $scope.model.tableModel.unshift( colHeaders );
   }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const axTableEditorDirectiveName = 'axTableEditor';
const axTableEditorDirective = () => {
   return {
      scope: {
         axTableEditor: '=',
         axTableEditorRows: '='
      },
      link( $scope, $element ) {

         const baseSettings = {
            afterChange( changes ) {
               // changes is defined if loadData was not used:
               if( changes ) {
                  $scope.$emit( EVENT_AFTER_CHANGE );
               }
            },
            afterRemoveCol() {
               $scope.$emit( EVENT_AFTER_CHANGE );
            },
            afterRemoveRow() {
               $scope.$emit( EVENT_AFTER_CHANGE );
            },
            afterCreateCol() {
               $scope.$emit( EVENT_AFTER_CHANGE );
            },
            afterCreateRow() {
               $scope.$emit( EVENT_AFTER_CHANGE );
            }
         };

         const handsontable = Handsontable( $element[ 0 ], completeSettings() );

         $scope.$watch( axTableEditorDirectiveName, newSettings => {
            if( newSettings ) {
               handsontable.updateSettings( completeSettings() );
            }
         }, true );

         $scope.$watch( `${axTableEditorDirectiveName}Rows`, newRows => {
            handsontable.loadData( newRows );
         }, true );

         //////////////////////////////////////////////////////////////////////////////////////////////////

         function completeSettings() {
            const settings = ax.object.options( $scope[ axTableEditorDirectiveName ], baseSettings );
            settings.cells = function( row, col ) {
               if( row > 0 && col === 0 ) {
                  return {
                     type: 'date',
                     dateFormat: 'YYYY-MM-DD'
                  };
               }
               return undefined;
            };
            return ax.object.options( {
               data: $scope[ `${axTableEditorDirectiveName}Rows` ] || []
            }, settings );
         }
      }
   };
};

export const name = ng.module( 'tableEditorWidget', [ 'ngSanitize' ] )
   .controller( 'TableEditorWidgetController', Controller )
   .directive( axTableEditorDirectiveName, axTableEditorDirective ).name;
