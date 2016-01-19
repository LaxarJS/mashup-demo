define( [
   'laxar-date-picker-control/ax-date-picker-control',
   'laxar-developer-tools-widget/ax-developer-tools-widget',
   'laxar-application/includes/widgets/mashup-demo/chart-widget/chart-widget',
   'laxar-application/includes/widgets/mashup-demo/data-provider-widget/data-provider-widget',
   'laxar-application/includes/widgets/mashup-demo/table-editor-widget/table-editor-widget'
], function() {
   'use strict';

   var modules = [].slice.call( arguments );
   return {
      'angular': modules.slice( 0, 5 )
   };
} );
