define( [
   '../includes/widgets/mashup_demo/headline_widget/headline_widget',
   '../includes/widgets/mashup_demo/data_provider_widget/data_provider_widget',
   '../includes/widgets/mashup_demo/chart_widget/chart_widget',
   '../includes/widgets/mashup_demo/table_editor_widget/table_editor_widget',
   'laxar_uikit/controls/date_picker'
], function() {
   'use strict';

   return [].map.call( arguments, function( module ) { return module.name; } );
} );
