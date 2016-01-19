/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
require( [
   'laxar',
   'laxar-application/var/flows/main/dependencies',
   'json!laxar-application/var/flows/main/resources.json'
], function( ax, mainDependencies, mainResources ) {
   'use strict';

   window.laxar.fileListings = {
      application: mainResources,
      bower_components: mainResources,
      includes: mainResources
   };

   ax.bootstrap( mainDependencies );

} );

