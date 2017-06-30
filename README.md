# LaxarJS MashupDemo

The *LaxarJS MashupDemo* is a web application which combines two external libraries, a data grid editor ([Handsontable](http://handsontable.com/)) and a charting library ([Angular-nvD3](http://krispo.github.io/angular-nvd3)) by using the LaxarJS event bus.
The MashupDemo is implemented using the [LaxarJS](http://laxarjs.org) web application framework.

The demo consists of a small set of LaxarJS widgets implemented in AngularJS.

* [Show the live demo](http://laxarjs.github.io/mashup-demo/)

* [Read the tutorial](docs/mashup_tutorial.md)

* [LaxarJS Homepage](http://laxarjs.org)

* [LaxarJS on GitHub](https://github.com/LaxarJS/laxar)


## Running the MashupDemo

To fetch the required tools and libraries, make sure that you have `npm` (comes with NodeJS) installed on your machine.

Use a shell to issue the following commands:

```sh
git clone --recursive https://github.com/LaxarJS/mashup-demo.git
cd mashup-demo
npm install
npm start
```

Afterwards, open the demo at [http://localhost:8001/debug.html](http://localhost:8001/debug.html).


## Next Steps

For an optimized version more suitable for production, stop the server (using `Ctrl-C`) and run:

```sh
npm run dist
npm start
```

Now you can browse the optimized demo at [http://localhost:8001/index.html](http://localhost:8001/index.html).

Instead of using `npm start`, you can use any web server on your machine by having it serve the `mashup-demo` directory.

Try modifying the widgets under `includes/widgets/mashup-demo` to get a feel for how a LaxarJS application works.

Read the [tutorial](docs/mashup_tutorial.md) to get further information about how this application was implemented.
