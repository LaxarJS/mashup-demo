/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import * as patterns from 'laxar-patterns';
import { module } from 'angular';
import 'angular-sanitize';

Controller.$inject = [ '$scope', '$http'];
function Controller( $scope, $http ) {

   var publishError = patterns.errors.errorPublisherForFeature( $scope, 'messages' );

   $scope.selectedItem = null;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   $scope.useItem = function( item ) {
      var data = $scope.features.data;
      $scope.selectedItem = item;
      readAndPublishResource( data.resource, item.location );
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function readAndPublishResource( resourceName, location ) {
      $http.get( location )
         .then( function( data ) {
               publishResource( resourceName, data.data );
            } , function( data, status, headers ) {
               publishError( 'HTTP_GET', 'i18nFailedLoadingResource', {
                  resource: resourceName
               }, {
                  data: data,
                  status: status,
                  headers: headers
               } );
            }
         );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function publishResource( resourceName, data ) {
      $scope.eventBus.publish( 'didReplace.' + resourceName, {
         resource: resourceName,
         data: data
      }, { deliverToSender: false } );
   }
}

export const name = module( 'dataProviderWidget', [ 'ngSanitize' ] )
   .controller( 'DataProviderWidgetController', Controller ).name;
