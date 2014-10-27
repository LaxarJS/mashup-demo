/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar_patterns',
   'ngHandsontable'
], function ( ng, ax, patterns, ngHandsontable ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module = ng.module( moduleName, [ 'ngHandsontable' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', 'settingFactory', 'autoCompleteFactory' ];

   function Controller( $scope, settingFactory, autoCompleteFactory ) {

      $scope.resources = {};
      $scope.model = {};
      $scope.model.handsontalbeSettings = {
         rowHeaders: true,
         colHeaders: true,
         contextMenu: true,
         fillHandle: true
      };


      patterns.resources.handlerFor( $scope )
         .registerResourceFromFeature( 'spreadsheet', { onUpdateReplace: refreshTable } );

      // Initialize an empty 2-dimensional array of fixed size.
      //$scope.model.matrix = createEmptyMatrix( 3, 5 );
      //$scope.model.matrix = createRandomMatrix( 3, 5, 1, 10 );
      // Check if the injection worked.
      //console.log(settingFactory);
      //console.log(autoCompleteFactory);

//      $scope.eventBus.subscribe( 'beginLifecycleRequest', function() {
//            settingFactory.renderHandsontable( ng.element( '#my-table' ) );
//            //settingFactory.updateHandsontableSettings( ng.element( '#my-table' ), { data: $scope.matrix, type: 'numeric', format: '0.0[000]' } );
//      } );


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // Only fire watchers for changes caused in this widget
      var spreadsheetFromEventBus = null;
      $scope.$watch( 'resources.spreadsheet', function (nv, ov) {
         if( spreadsheetFromEventBus && ng.equals( nv, spreadsheetFromEventBus ) ) {
            return;
         }
         if( nv && ov ) {
            spreadsheetFromEventBus = null;
            var patch = patterns.patches.create( nv, ov );
            var resourceName = $scope.features.spreadsheet.resource;
            $scope.eventBus.publish( 'didUpdate.' + resourceName, {
                  resource: resourceName,
                  updates: patch
               }, {
                  deliverToSender: false
               }
            );
         }
      }, true);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function refreshTable() {

         spreadsheetFromEventBus = ax.object.deepClone( $scope.resources.spreadsheet );

         //$scope.model.matrix = createRandomMatrix( 3, 5, 1, 10 );

         settingFactory.renderHandsontable($('#my-table'));
         settingFactory.updateHandsontableSettings( ng.element( '#my-table' ),
            {
               // The ngHandsontable watcher is broken:
               data: $scope.resources.spreadsheet,
               // format: '0.0[000]',
               type: 'numeric'
            }
         );

         //$scope.model.mySettings.data = 'matrix';

//        $scope.model.mySettings =
//            "{rowHeaders: true, colHeaders: true, contextMenu: true, fillHandle: true, type: 'numeric', format: '0.0[000]', data: 'matrix'}"
//         ;

      }

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* module.directive( 'axTableEditorRefresh', [ 'settingFactory', function( settingFactory ) {
      return {
         link: function( $scope, $element ) {
            $scope.$watch( 'resources.spreadsheet', function (nv, ov) {

               settingFactory.updateHandsontableSettings( ng.element( '#my-table' ),
                  {
                     data: $scope.resources.spreadsheet,
                     type: 'numeric',
                     format: '0.0[000]'
                  }
               );
            } );
         }
      };
   } ]
   );
*/
   return module;

} );
