/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license
 */
/* global require */

import 'laxar/dist/polyfills';

import { create } from 'laxar';
import * as angularAdapter from 'laxar-angular-adapter';
import artifacts from 'laxar-loader/artifacts?flow=main&theme=cube';
import debugInfo from 'laxar-loader/debug-info?flow=main&theme=cube';

const configuration = {
   name: 'mashup-demo',
   theme: 'cube',
   router: {
      query: { enabled: true },
      navigo: { useHash: true }
   }
};

create( [ angularAdapter ], artifacts, configuration )
   .tooling( debugInfo )
   .flow( 'main', document.querySelector( '[data-ax-page]' ) )
   .bootstrap();
