/**
 * Copyright 2014 LaxarJS
 * Released under the MIT license.
 * www.laxarjs.org
 */
define( [
   'angular',
   'laxar_patterns',
   'angular-sanitize'
], function( ng, patterns ) {
   'use strict';

   var moduleName = 'widgets.chart_demo.resource_display_widget';
   var module     = ng.module( moduleName, [ 'ngSanitize' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   Controller.$inject = [ '$scope' ];

   function Controller( $scope ) {

      $scope.resources = {};

      if( $scope.features.display && $scope.features.display.resource ) {
         patterns.resources.handlerFor( $scope ).registerResourceFromFeature( 'display' );
      }

      patterns.i18n.handlerFor( $scope ).scopeLocaleFromFeature( 'i18n' );

      $scope.resourceAsJsonString = function() {
         return JSON.stringify( $scope.resources.display, null, 3 );
      };

   }

   module.controller( moduleName + '.Controller', Controller );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return module;

} );
