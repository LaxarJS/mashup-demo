/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
    //'jquery',
    //'../../../../bower_components/handsontable/dist/jquery.handsontable.full'
    'ngHandsontable'
], function( ng ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.table_editor_widget';
   var module     = ng.module( moduleName, ['ngHandsontable'] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', '$window', '$rootScope', 'ngHandsontable' ];

   function Controller( $scope, $window, $rootScope, nghot ) {


       console.log(nghot);

       $scope.db = {};

       $scope.db.items = [
           {
               "id":1,
               "name":{
                   "first":"John",
                   "last":"Schmidt"
               },
               "address":"45024 France",
               "price":760.41,
               "isActive":"Yes",
               "product":{
                   "description":"Fried Potatoes",
                   "options":[
                       {
                           "description":"Fried Potatoes",
                           "image":"//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
                           "Pick$":null
                       },
                       {
                           "description":"Fried Onions",
                           "image":"//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
                           "Pick$":null
                       }
                   ]
               }
           }
           //more items go here
       ];

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
