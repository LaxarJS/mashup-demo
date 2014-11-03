/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar_patterns',
   'moment',
   'handsontable',
   'css!handsontable',
   'jquery_ui/datepicker'
], function( ng, ax, patterns, moment ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var EVENT_AFTER_CHANGE = 'axTableEditor.afterChange';

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {

      $scope.model = {
         settings: {
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            fillHandle: true
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
         var patch = patterns.json.createPatch( $scope.resources.timeSeries, modifiedResource );

         var resourceName = $scope.features.timeSeries.resource;
         $scope.eventBus.publish( 'didUpdate.' + resourceName, {
            resource: resourceName,
            patches: patch
         }, {
            deliverToSender: false
         } );

         $scope.resources.timeSeries = modifiedResource;

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function getTimeSeriesFromTableModel() {
         var tableModel = $scope.model.tableModel;
         var timeSeries = ax.object.deepClone( $scope.resources.timeSeries );

         timeSeries.timeGrid = tableModel
            .map( function( row ) {
               return row[ 0 ] && moment( row[ 0 ], 'MM/DD/YYYY' ).format( 'YYYY-MM-DD' );
            } )
            .filter( function( timeTick ) {
               return timeTick !== null && timeTick !== '';
            } );

         timeSeries.series = tableModel[ 0 ].map( function( columnLabel ) {
            return {
               label: columnLabel
            };
         } );
         timeSeries.series.forEach( function( timeSeries, timeSeriesKey ) {
            var columnOfTimeSeries = timeSeriesKey;
            timeSeries.values = tableModel
               .map( function( row ) {
                  return parseInt( row[ columnOfTimeSeries ], 10 );
               } )
               .filter( function( value, key ) {
                  return tableModel[ key ][ 0 ] !== null && tableModel[ key ][ 0 ] !== '';
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
               return value.values[ row ];
            } );
            rowData.unshift( moment( rowHeader, 'YYYY-MM-DD' ).format( 'MM/DD/YYYY' ) );
            return rowData;
         } );

         var colHeaders = [ null ].concat( timeSeries.series.map( function( value ) {
            return value.label;
         } ) );
         $scope.model.tableModel.unshift( colHeaders );
      }

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var directiveName = 'axTableEditor';
   module.directive( directiveName, [ '$window', function( $window ) {
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
               var settings = ax.object.options( $scope[ directiveName ], baseSettings );
               settings.cells = function( row, col, prop ) {
                  if( row > 0 && col === 0 ) {
                     return {
                        type: 'date',
                        renderer: $window.Handsontable.DateCell.renderer,
                        // We can simply pass any options to jquery-ui-datepicker here.
                        dateFormat: 'mm/dd/yy' // Format to be returned by jquery-ui-datepicker.
                     };
                  }
               };
               return ax.object.options( {
                  data: $scope[ directiveName + 'Rows' ] || []
               }, settings );
            }
         }
      };
   } ] );

   return module;

} );
