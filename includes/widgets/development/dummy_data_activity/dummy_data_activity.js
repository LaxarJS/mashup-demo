/**
 * Copyright 2014 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'underscore',
   'laxar',
   'json-patch'
], function( ng, _, ax, jsonPatch, undefined ) {
   'use strict';

   var moduleName = 'widgets.development.dummy_data_activity';
   var module = ng.module( moduleName, [] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope', '$http' ];

   function Controller( $scope, $http ) {

      $scope.model = {};

      if( _.isObject( $scope.features.resources ) ) {
         setupResources( ax.object.deepClone( $scope.features.resources) );
      }
      if( _.isObject( $scope.features.actions ) ) {
         setupActions( ax.object.deepClone( $scope.features.actions ) );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setupResources( resources ) {
         $scope.model.resources = resources;

         for( var i = 0; i < resources.length; i++ ) {
            if( resources[ i ].data === undefined ) {
               if ( resources[ i ].location === undefined ) {
                  throw new Error( 'For resource ' + i + ' either data or location must be set!' );
               }
            }
            else if( _.isArray( resources[ i ].data ) || !( _.isObject( resources[ i ].data ) ) ) {
               throw new Error( 'For resource ' + i + ' data must be an object!' );
            }
         }

         $scope.eventBus.subscribe( 'beginLifecycleRequest', function() {
            for( var i = 0; i < resources.length; i++ ) {
               if( resources[ i ].data !== undefined ) {
                  $scope.eventBus.publish( 'didReplace.' + resources[ i ].resource, resources[ i ] );
               }
               if( resources[ i ].location !== undefined ) {
                  fetch( resources[ i ] );
               }
            }
         } );

         for( var j = 0; j < resources.length; j++ ) {
            $scope.eventBus.subscribe( 'didUpdate.' + resources[ j ].resource, createUpdateHandler( j ) );
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         function fetch( resource ) {
            var resourceId = resource.resource;
            $http.get( resource.location ).success( function handleGetOk( data ) {
               resource.data = data;
               $scope.eventBus.publish( 'didReplace.' + resourceId, {
                  resource: resourceId,
                  data: data
               }, { deliverToSender: false } );
            } ).error( function() {
               $scope.eventBus.publish( 'didEncounterError.HTTP_GET' );
            } );
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         function createUpdateHandler( i ) {
            return function( event ) {
               jsonPatch.apply( $scope.model.resources[ i ].data, event.patches );
            };
         }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setupActions( actions ) {
         $scope.model.actions = actions;

         _.each( actions, function( actionDefinition, action ) {

            $scope.eventBus.subscribe( 'takeActionRequest.' + action, function() {

               $scope.eventBus.publish( 'willTakeAction.' + action );

               if( _.isObject( actionDefinition.data ) ) {
                  $scope.eventBus.publish( 'didReplace.' + actionDefinition.resource, {
                     resource: actionDefinition.resource, data: actionDefinition.data
                  } );
                  $scope.eventBus.publish( 'didTakeAction.' + action );
               }
               else if( actionDefinition.location !== undefined ) {
                  var res = actionDefinition.resource;
                  $http.get( actionDefinition.location ).success( function handleGetOk( data ) {
                     $scope.eventBus.publish( 'didReplace.' + res, { resource: res, data: data } );
                     $scope.eventBus.publish( 'didTakeAction.' + action );
                  } ).error( function handleGetError() {
                     $scope.eventBus.publish( 'didEncounterError.HTTP_GET' );
                  } );
               }

               if( _.isObject( actionDefinition.updates ) ) {
                  $scope.eventBus.publish( 'didUpdate.' + actionDefinition.resource, {
                     resource: actionDefinition.resource,
                     updates: actionDefinition.updates
                  }, { deliverToSender: false }  );
                  $scope.eventBus.publish( 'didTakeAction.' + action );
               }

               if( _.isObject( actionDefinition.patches ) ) {
                  $scope.eventBus.publish( 'didUpdate.' + actionDefinition.resource, {
                     resource: actionDefinition.resource,
                     patches: actionDefinition.patches
                  }, { deliverToSender: false }  );
                  $scope.eventBus.publish( 'didTakeAction.' + action );
               }

            } );
         } );
      }

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
