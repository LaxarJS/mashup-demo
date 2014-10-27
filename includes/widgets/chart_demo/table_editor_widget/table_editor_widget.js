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
   var EVENT_AFTER_REMOVE_COL = 'axTableEditor.afterRemoveCol';

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {

      $scope.resources = {};

      $scope.model = {};
      $scope.model.settings = {
         rowHeaders: true,
         colHeaders: true,
         contextMenu: true,
         fillHandle: true
      };
      $scope.model.columns = [];

      patterns.resources.handlerFor( $scope )
         .registerResourceFromFeature( 'spreadsheet', {} );

      $scope.$on( EVENT_AFTER_CHANGE, function( event, changes ) {
         var ROW = 0, COL = 1, NEW_VAL = 3;
         var patches = changes.map( function( change ) {
            var path = '/entries/' + change[ ROW ] + '/' + change[ COL ];
            var value = parseInt( change[ NEW_VAL ] );
            return { op: 'replace', path: path, value: value };
         } );
         updateSpreadsheetResource( patches );
      } );

      $scope.$on( EVENT_AFTER_REMOVE_COL, function( event, index, amount ) {
         var patches = [];
         for( var i = 0; i < amount; ++i ){
            var indexInResource = i + index;
            patches.push( { op: 'remove', path: '/entries/' + indexInResource } );
         }
         updateSpreadsheetResource( patches );
      } );

      function updateSpreadsheetResource( patches ) {
         var resourceName = $scope.features.spreadsheet.resource;
         $scope.eventBus.publish( 'didUpdate.' + resourceName, {
               resource: resourceName,
               patches: patches
            }, {
               deliverToSender: false
            }
         );
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
                     $scope.$emit( EVENT_AFTER_CHANGE, changes );
                  }
               },
               afterRemoveCol: function( index, amount ) {
                  console.log('afterRemoveCol');
                  $scope.$emit( EVENT_AFTER_REMOVE_COL, index, amount );
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
