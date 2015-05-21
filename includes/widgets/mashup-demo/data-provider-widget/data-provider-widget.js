/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar_patterns'
], function( ng, patterns ) {
   'use strict';

   var moduleName = 'dataProviderWidget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = ['$scope', '$http'];

   function Controller( $scope, $http ) {

      var publishError = patterns.errors.errorPublisherForFeature( $scope, 'messages' );

      $scope.selectedItem = null;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.useItem = function( item ) {
         var data = $scope.features.data;
         $scope.selectedItem = item;
         readAndPublishResource( data.resource, item.location );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function readAndPublishResource( resourceName, location ) {
         $http.get( location )
            .success( function( data ) {
               publishResource( resourceName, data );
            } )
            .error( function( data, status, headers ) {
               publishError( 'HTTP_GET', 'i18nFailedLoadingResource', {
                  resource: resourceName
               }, {
                  data: data,
                  status: status,
                  headers: headers
               } );
            } );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishResource( resourceName, data ) {
         $scope.eventBus.publish( 'didReplace.' + resourceName, {
            resource: resourceName,
            data: data
         }, { deliverToSender: false } );
      }
   }

   module.controller( 'DataProviderWidgetController', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
