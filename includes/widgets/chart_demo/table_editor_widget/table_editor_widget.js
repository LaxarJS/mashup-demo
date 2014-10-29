/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar',
   'laxar_patterns'
], function( ng, ax, patterns ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {

      $scope.model = {};
      $scope.resources = {};
      patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'spreadsheet', {onUpdateReplace: convertToTableModel} );

      function convertToTableModel() {
         $scope.model.tableModel = [];

         // Column headers
         var colHeaders = [];
         colHeaders.push( null );
         var spreadsheet = $scope.resources.spreadsheet;
         spreadsheet.series.forEach( function( value, key ) {
            colHeaders.push( value.label );
         } );
         $scope.model.tableModel.push( colHeaders );

         // Row headers
         spreadsheet.grid.forEach( function( value, key ) {
            var rowData = [];
            rowData.push( value );
            $scope.model.tableModel.push( rowData );
         } );

//         // Data area
//         spreadsheet.grid.forEach( function( rowHeader, row ) {
//            console.log( $scope.model.tableModel[ row + 1 ] );
//            spreadsheet.series.data.forEach( function( value, col ) {
//               //console.log( $scope.model.tableModel[ key + 1 ] );
//               $scope.model.tableModel[ row + 1 + col ].concat( value );
//
//            } );
//         } );

//         spreadsheet.grid.forEach( function( rowHeader, row ) {
//            var rowData = [];
//            rowData.push( rowHeader );
//            console.log( rowData );
//            spreadsheet.series.forEach( function( value, col ) {
//               //console.log( $scope.model.tableModel[ key + 1 ] );
//               $scope.model.tableModel[ row + 1 + col ].push( value );
//
//            } );
//         } );



         ////////////////////

//
//         for (var i=0; i<spreadsheet.series.length+1; ++i) {
//            for
//         }
//

         console.log( colHeaders );
         console.log( $scope.model.tableModel );

      }
   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
