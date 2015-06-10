var require = {
   baseUrl: 'bower_components',
   deps: [],
   shim: {
      angular: {
         deps: [ 'jquery' ],
         exports: 'angular'
      },
      'angular-mocks': {
         deps: [ 'angular' ],
         init: function ( angular ) {
            'use strict';
            return angular.mock;
         }
      },
      'angular-route': {
         deps: [ 'angular' ],
         init: function ( angular ) {
            'use strict';
            return angular;
         }
      },
      'angular-sanitize': {
         deps: [ 'angular' ],
         init: function ( angular ) {
            'use strict';
            return angular;
         }
      },
      'json-patch': {
         exports: 'jsonpatch'
      },
      //underscore: {
      //   exports: '_',
      //   init: function () {
      //      'use strict';
      //      return this._.noConflict();
      //   }
      //},
      handsontable: {
         deps: [ 'jquery', 'numeral', 'pikaday/pikaday', 'css!pikaday/css/pikaday' ],
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
         name: 'moment',
         location: 'moment',
         main: 'moment'
      }
   ],
   paths: {
      // LaxarJS Core and dependencies:
      laxar: 'laxar/dist/laxar.with-deps',
      requirejs: 'requirejs/require',
      text: 'requirejs-plugins/lib/text',
      json: 'requirejs-plugins/src/json',
      angular: 'angular/angular',
      'angular-mocks': 'angular-mocks/angular-mocks',
      'angular-route': 'angular-route/angular-route',
      'angular-sanitize': 'angular-sanitize/angular-sanitize',

      //underscore: 'underscore/underscore',
      //jjv: 'jjv/lib/jjv',
      //jjve: 'jjve/jjve',

      // LaxarJS Core (tests only):
      'laxar/laxar_testing': 'laxar/dist/laxar_testing',
      jquery: 'jquery/dist/jquery',
      jasmine: 'jasmine/lib/jasmine-core/jasmine',
      q_mock: 'q_mock/q',

      // LaxarJS Patterns:
      'laxar-patterns': 'laxar-patterns/dist/laxar-patterns',
      'json-patch': 'fast-json-patch/src/json-patch-duplex',

      // LaxarJS UIKit:
      'laxar-uikit': 'laxar-uikit/dist/laxar-uikit',
      'laxar-uikit/controls': 'laxar-uikit/dist/controls',

      // LaxarJS application paths:
      'laxar-path-root': '..',
      'laxar-path-layouts': '../application/layouts',
      'laxar-path-pages': '../application/pages',
      'laxar-path-flow': '../application/flow/flow.json',
      'laxar-path-widgets': '../includes/widgets',
      'laxar-path-themes': '../includes/themes',
      'laxar-path-default-theme': 'laxar-uikit/dist/themes/default.theme',

      // LaxarJS application modules (contents are generated):
      'laxar-application-dependencies': '../var/static/laxar_application_dependencies',

      // Spreadsheet-like table and dependencies
      numeral: 'numeral/numeral',
      handsontable: 'handsontable/dist/handsontable',

      // Charts
      d3: 'd3/d3',
      nvd3: 'nvd3/build/nv.d3',
      'angular-nvd3': 'angular-nvd3/dist/angular-nvd3',
      pikaday: 'pikaday',

      // App Parts:
      'laxar-path-controls': '../includes/controls'

   },
   map: {
      '*': {
         'css': 'require-css/css', // or whatever the path to require-css is
         'laxar_uikit': 'laxar-uikit',
         'laxar_patterns': 'laxar-patterns'
      }
   }
};
