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

   var moduleName = 'widgets.chart_demo.data_provider_widget';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', '$http' ];

   function Controller( $scope, $http ) {

      // Initially publish the resource if the location has been provided.
      $scope.eventBus.subscribe( 'beginLifecycleRequest', function() {
         var publish = $scope.features.publish;
         if (publish.location !== undefined) {
            publishResource(publish.resource, publish.location);
         }
      });

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.useDataSet = function( dataSet ) {
         var publish = $scope.features.publish;
         if( dataSet.location !== undefined ) {
            publishResource(publish.resource, dataSet.location);
         }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function publishResource( resourceId, location ) {
         console.log(resourceId);
         console.log(location);
            $http.get( location )
               .success( function( data ) {
                  console.log("SUCCESS");
                  $scope.eventBus.publish( 'didReplace.' + resourceId, {
                     resource: resourceId,
                     data: data
                  }, { deliverToSender: false } );
               } )
               .error( function(data) {
                  console.log("ERROR: didEncounterError.HTTP_GET: " + data);
                  $scope.eventBus.publish( 'didEncounterError.HTTP_GET' );
               } );
      }

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
