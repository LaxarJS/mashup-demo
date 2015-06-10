define( [
   'laxar-date-picker-control/ax-date-picker-control',
   'laxar-application/includes/widgets/mashup-demo/data-provider-widget/data-provider-widget',
   'laxar-application/includes/widgets/mashup-demo/table-editor-widget/table-editor-widget',
   'laxar-application/includes/widgets/mashup-demo/chart-widget/chart-widget'
], function() {
   'use strict';

   var modules = [].slice.call( arguments );
   return {
      'angular': modules.slice( 0, 4 )
   };
} );
