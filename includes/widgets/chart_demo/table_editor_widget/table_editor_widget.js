/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'ngHandsontable'
], function ( ng, ngHandsontable ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module = ng.module( moduleName, [ 'ngHandsontable' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', 'settingFactory', 'autoCompleteFactory' ];

   function Controller( $scope, settingFactory, autoCompleteFactory ) {


      // Initialize an empty 2-dimensional array of fixed size.
      //$scope.matrix = createEmptyMatrix( 3, 5 );
      $scope.matrix = createBuggyStylingMatrix(3, 6); //FIXME CSS: Provoke a styling error due to word wrapping.

      // Check if the injection worked.
      //console.log(settingFactory);
      //console.log(autoCompleteFactory);


      ng.element( '#my-table' ).ready(function() {
         //console.log('ready()');
         //settingFactory.renderHandsontable( ng.element( '#my-table' ) );
         //settingFactory.updateHandsontableSettings( ng.element( '#my-table' ), { data: $scope.matrix, type: 'numeric', format: '0.0[000]' } );
      });

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // Just a hack to visually "repair" the table by redrawing it.
      $scope.refresh = function () {
         settingFactory.renderHandsontable( ng.element( '#my-table' ) );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.afterChange = function () {
         console.log( 'afterChange()' );

         var resourceName = $scope.features.data.resource;
         $scope.eventBus.publish( 'didReplace.' + resourceName, {
               resource: resourceName,
               data: $scope.matrix
            }, {
               deliverToSender: false
            }
         );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.createRandomData = function () {
         $scope.matrix = createRandomMatrix( 3, 5, 1, 10 );
         //settingFactory.renderHandsontable($('#my-table'));
         settingFactory.updateHandsontableSettings( ng.element( '#my-table' ),
            {
               data: $scope.matrix,
               type: 'numeric',
               format: '0.0[000]'
            }
         );

      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.output = function () {
         console.log( $scope.matrix );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////



      function createEmptyMatrix( rows, columns ) {
         var array = new Array( rows );
         for ( var i = 0; i < rows; ++i ) {
            array[ i ] = new Array( columns );
         }
         return array;
      }


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createBuggyStylingMatrix( rows, columns ) {
         var array = new Array( rows );
         for ( var i = 0; i < rows; ++i ) {
            array[ i ] = new Array( columns );
            for ( var j = 0; j < columns; ++j ) {
               array[ i ][ j ] = 'Hello World 123!';
            }
         }
         return array;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function createRandomMatrix( rows, columns, min, max ) {
         var array = new Array( rows );
         for ( var i = 0; i < rows; ++i ) {
            array[ i ] = new Array( columns );
            for ( var j = 0; j < columns; ++j ) {
               array[ i ][ j ] = Math.floor( Math.random() * ( max - min + 1 ) + min );
            }
         }
         return array;
      }

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
