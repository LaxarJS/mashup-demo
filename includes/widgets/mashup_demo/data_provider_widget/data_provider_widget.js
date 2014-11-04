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

   var moduleName = 'widgets.mashup_demo.data_provider_widget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', '$http' ];

   function Controller( $scope, $http ) {

      var publishError = patterns.errors.errorPublisherForFeature( $scope, 'messages' );

      $scope.selectedItem = null;

      $scope.eventBus.subscribe( 'beginLifecycleRequest', function() {
         var data = $scope.features.data;
         publishResource( data.resource, data.items[ 0 ].location );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.useItem = function( item ) {
         var data = $scope.features.data;
         $scope.selectedItem = item;
         publishResource( data.resource, item.location );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishResource( resourceId, location ) {
         $http.get( location )
            .success( function( data ) {
               $scope.eventBus.publish( 'didReplace.' + resourceId, {
                  resource: resourceId,
                  data: data
               }, { deliverToSender: false } );
            } )
            .error( function( data, status, headers, config ) {
               publishError( 'HTTP_GET', 'i18nFailedLoadingResource', {
                  resource: resourceId
               }, {
                  data: data,
                  status: status,
                  headers: headers
               } );
            } );
      }

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
