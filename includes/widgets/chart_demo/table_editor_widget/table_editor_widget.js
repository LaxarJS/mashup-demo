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

      $scope.resources = {};

      $scope.model = {};
      $scope.model.settings = {
         rowHeaders: true,
         colHeaders: true,
         contextMenu: true,
         fillHandle: true
      };
      $scope.model.columns = [];

      var model = $scope.model;
      var resources = $scope.resources;

      patterns.resources.handlerFor( $scope )
         .registerResourceFromFeature( 'spreadsheet', { onUpdateReplace: createDeepClone } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.$on( EVENT_AFTER_CHANGE, function() {
         var spreadsheetModelObject =  { entries: $scope.model.spreadsheet };
         var patches = patterns.json.createPatch( $scope.resources.spreadsheet, spreadsheetModelObject );
         patterns.json.applyPatch( $scope.resources.spreadsheet, patches );
         createDeepClone();
         updateSpreadsheetResource( patches );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

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

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createDeepClone() {
         $scope.model.spreadsheet = ax.object.deepClone( $scope.resources.spreadsheet.entries );
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
               afterCreateCol : function() {
                  $scope.$emit( EVENT_AFTER_CHANGE );
               },
               afterCreateRow : function() {
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
