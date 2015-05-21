var require = {
   baseUrl: 'bower_components',
   deps: [
      'es5-shim/es5-shim'
   ],
   shim: {
      angular: {
         deps: [
            'jquery'
         ],
         exports: 'angular'
      },
      'angular-mocks': {
         deps: [
            'angular'
         ],
         init: function ( angular ) {
            'use strict';
            return angular.mock;
         }
      },
      'angular-route': {
         deps: [
            'angular'
         ],
         init: function ( angular ) {
            'use strict';
            return angular;
         }
      },
      'angular-sanitize': {
         deps: [
            'angular'
         ],
         init: function ( angular ) {
            'use strict';
            return angular;
         }
      },
      'json-patch': {
         exports: 'jsonpatch'
      },
      underscore: {
         exports: '_',
         init: function () {
            'use strict';
            return this._.noConflict();
         }
      },
      handsontable: {
          deps: [
              'jquery', 'numeral', 'pikaday/pikaday', 'css!pikaday/css/pikaday'
          ],
         exports: 'Handsontable',
         init: function(numeral, moment, pikaday) {
            // Handsontable needs Pikaday in global scope.
            this.Pikaday = pikaday;
         }
      },
      d3: {
         exports: 'd3'
      },
      nvd3: {
         deps: [ 'd3' ],
         exports: 'nv'
      },
      pikaday: {
         exports: 'pikaday'
      },
      'angular-nvd3': {
         deps: [ 'angular', 'nvd3' ]
      }
   },
   packages: [
      {
         name: 'laxar-application',
         location: '..',
         main: 'init'
      },
      {
         name: 'laxar',
         location: 'laxar',
         main: 'laxar'
      },
      {
         name: 'laxar_patterns',
         location: 'laxar_patterns',
         main: 'laxar-patterns'
      },
      {
         name: 'laxar_uikit',
         location: 'laxar_uikit',
         main: 'laxar_uikit'
      },
      {
         name: 'moment',
         location: 'moment',
         main: 'moment'
      }
   ],
   paths: {
      // LaxarJS Core:
      requirejs: 'requirejs/require',
      jquery: 'jquery/dist/jquery',
      underscore: 'underscore/underscore',
      angular: 'angular/angular',
      'angular-mocks': 'angular-mocks/angular-mocks',
      'angular-route': 'angular-route/angular-route',
      'angular-sanitize': 'angular-sanitize/angular-sanitize',
      jjv: 'jjv/lib/jjv',
      jjve: 'jjve/jjve',

      // LaxarJS Core Testing:
      jasmine: 'jasmine/lib/jasmine-core/jasmine',
      q_mock: 'q_mock/q',

      // LaxarJS Core Legacy:
      text: 'requirejs-plugins/lib/text',
      json: 'requirejs-plugins/src/json',

      // LaxarJS Patterns:
      'json-patch': 'fast-json-patch/src/json-patch-duplex',

      // LaxarJS UIKit:
      jquery_ui: 'jquery_ui/ui',
      'bootstrap-tooltip': 'bootstrap-sass-official/assets/javascripts/bootstrap/tooltip',
      'bootstrap-affix': 'bootstrap-sass-official/assets/javascripts/bootstrap/affix',
      trunk8: 'trunk8/trunk8',

      // Spreadsheet-like table and dependencies
      numeral: 'numeral/numeral',
      handsontable: 'handsontable/dist/handsontable',

      // Charts
      d3: 'd3/d3',
      nvd3: 'nvd3/build/nv.d3',
      'angular-nvd3': 'angular-nvd3/dist/angular-nvd3',
      pikaday: 'pikaday',

      // App Parts:
      'laxar-path-root': '..',
      'laxar-path-controls': '../includes/controls',
      'laxar-path-layouts': '../application/layouts',
      'laxar-path-pages': '../application/pages',
      'laxar-path-widgets': '../includes/widgets',
      'laxar-path-themes': '../includes/themes',
      'laxar-path-flow': '../application/flow/flow.json',

      'laxar-application-dependencies': '../var/static/laxar_application_dependencies'
   },
   map: {
      '*': {
         'css': 'require-css/css' // or whatever the path to require-css is
      }
   }
};
