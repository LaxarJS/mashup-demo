/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license
 */
/* global require */

import 'laxar/dist/polyfills';

import { create } from 'laxar';
import * as angularAdapter from 'laxar-angular-adapter';
import artifacts from 'laxar-loader/artifacts?flow=main&theme=cube';

var configuration = {
   name: 'mashup-demo',
   logging: { threshold: 'TRACE' },
   theme: 'cube',
   router: {
      query: { enabled: true },
      navigo: { useHash: true }
   }
};

create( [ angularAdapter ], artifacts, configuration )
   .tooling( require( 'laxar-loader/debug-info?flow=main&theme=cube' ) )
   .flow( 'main', document.querySelector( '[data-ax-page]' ) )
   .bootstrap();
