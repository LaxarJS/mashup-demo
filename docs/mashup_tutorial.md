# Mashup Demo Tutorial
The *LaxarJS MashupDemo* is a web application which combines two external libraries, a data grid editor (*[Handsontable](http://handsontable.com/)*) and a charting library (*[Angular-nvD3](http://krispo.github.io/angular-nvd3)*) by using the LaxarJS event bus.
The MashupDemo consists of four widgets mainly implemented with [LaxarJS](http://laxarjs.org), *[AngularJS](http://angularjs.org)* and the two libraries mentioned before.

Before reading the overview of the MashupDemo, it's recommended to take a look at the [core concepts](https://github.com/LaxarJS/laxar/blob/master/docs/concepts.md) of LaxarJS.
Not necessary, but useful to read are these additional documents:

* [Why LaxarJS?](https://github.com/LaxarJS/laxar/blob/master/docs/why_laxar.md)
* [Events and Publish-Subscribe](https://github.com/LaxarJS/laxar/blob/master/docs/manuals/events.md)
* [Widgets and Activities](https://github.com/LaxarJS/laxar/blob/master/docs/manuals/widgets_and_activities.md)
* [Writing Pages](https://github.com/LaxarJS/laxar/blob/master/docs/manuals/writing_pages.md)

It's a good idea to explore the ShopDemo as well, as it introduces you to the core concepts of laxarJS:

* [The ShopDemo](https://github.com/LaxarJS/shop_demo)

## HeadlineWidget
The HeadlineWidget displays a simple headline and an optional teaser.
In our application we use it to complete the layout with the title "MashupDemo" in the upper right corner.

## DataProviderWidget
The DataProviderWidget's task is to provide initial data sets to choose from.
In our context data sets consist of a set of time series to be visualized as charts by another widget.

![DataProviderWidget](img/data_provider_widget.png)

When the user selects a data set, the initial time series resource is published on the event bus.

## TableEditorWidget
The TableEditorWidget enables the user to modify the initial time series provided by the DataProviderWidget.
For this purpose we decided to use a data grid editor based on the Handsontable library.

![TableEditorWidget](img/table_editor_widget.png)

Time series are shown vertically, i.e. each column corresponds to a time series.
The column headers denote the title of the corresponding time series.
The row headers specify the date grid which the data values of each time series are referring to.
All time series must lie on the same date grid.
Missing values are interpreted as NULL.
However the interpretation of NULL values may vary in other widgets.
A chart widget may choose to set NULL values to 0 or it may ignore the value, depending on the chart type.

When a cell value is changed, a corresponding update is published on the event bus.
The accompanying data can be used to reconstruct the modified time series resource.

## ChartWidget
The ChartWidget displays the published time series resource in a chart.
For this purpose we decided to use the chart library Angular-nvD3.
It supports different chart types and various options to customize the visual representation.
Our demo has three ChartWidgets, each displaying a different chart type: a pie chart, a stacked line chart and a bar chart.

The ChartWidget with the stacked line chart:
![ChartWidget](img/chart_widget.png)

It's always the current state of the time series resource that is displayed.
In order to do this the ChartWidget subscribes to changes to the time series resource.


## Widget Communication
Each widgets is a self-contained component which communicates with other widgets through the event bus.
In our application there are two scenarios with interaction of the widgets.

When the user selects an example the DataProviderWidget publishes the data set as a resource under the name `timeSeriesData` (configured in the page.json).
The event bus delivers this resource to all widgets subscribed to it, the TableEditorWidget and the three ChartWidgets.

After the user edits the time series the TableEditorWidget publishes an update of the `timeSeriesData` resource.
The changes are reflected by the Chartwidgets.

![mashup demo](img/mashup_demo_communication.png)


## Include External Libraries
In a LaxarJS application we organize the different libraries with *[RequireJS](http://requirejs.org/)*, *[npm](http://www.npmjs.org)* and *[Bower](http://bower.io/)*.
In the best case we fetch the desired library with npm or bower and add a simple path to the RequireJS configuration file.
The worst case is, the library does not provide a package and is not prepared for using it with RequireJS.

### ChartWidget with Angular-nvD3
The ChartWidget expects a resource with time series and displays them in a chart.
For the visualization of a chart we use Angular-nvD3.
To download the library and its dependencies we use bower.
We have to resolve the dependency conflict between Angular-nvD3 and NVD3 and their common dependency D3 [manually](../bower.json#L22).

We have to make sure that its direct dependencies as well as its transitive dependencies are fulfilled:
Angular-nvD3 depends on *[NVD3](http://nvd3.org/)* and AngularJS itself.
NVD3 depends on *[D3](http://d3js.org/)*.
These dependencies have to be configured as a so-called *[shim config](http://requirejs.org/docs/api.html#config-shim)*:
```JSON
shim: {
   d3: {
       exports: 'd3',
       init: function () {
          'use strict';
          return this.d3;
       }
    },
    nvd3: {
       deps: [ 'd3' ],
       exports: 'nvd3',
       init: function () {
          'use strict';
          return this.nv;
       }
    },
    'angular-nvd3': {
       deps: [ 'nvd3', 'angular' ],
       init: function ( angular ) {
          'use strict';
          return angular;
       }
    }
}
```
We need to add a suitable *[path mapping](http://requirejs.org/docs/api.html#config-paths)* as well:

```JSON
paths: {
   d3: 'd3/d3',
   nvd3: 'nvd3/nv.d3',
   'angular-nvd3': 'angular-nvd3/dist/angular-nvd3'
}
```
CSS files are loaded by *[require-css](https://github.com/guybedford/require-css)* available through Bower.
We have to make sure, that it's used if we prefix a required module by `css!`.
We do this by a *[map config](http://requirejs.org/docs/api.html#config-map)*:

```JSON
map: {
   '*': {
      'css': 'require-css/css' // or whatever the path to require-css is
   }
}
```

The following code snippet shows how to include Angular-nvD3 and the required CSS:

```JSON
define( [
   ...
   'angular-nvd3',
   'css!nvd3'
], function( ... ) {
...
} );
```

When the dependency 'angular-nvd3' is mentioned, requireJS will be able to build the dependency tree
from our shim config.
A valid order of loading the above dependencies is ('d3', 'nvd3', 'angular-nvd3'). The defined path mappings
provide the exact paths to the corresponding Javascript files: ('d3/d3.js','nvd3/nv.d3.js','angular-nvd3/dist/angular-nvd3.js').
A similar approach is used for the CSS file:
when requireJS encounters the 'css!' prefix, the require-css plugin is used.
The path mapping provides the exact path: 'nvd3/nv.d3.css'.


### TableEditorWidget with Handsontable
The TableEditorWidget lets the user to edit the time series.
Because we do not want to implement a complete excel-like table editor form the scratch, we use the library Handsontable.
For this propose we install it with bower.

Handsontable depends on jquery and when using the date format in one table column it uses the jQuery UI Datepicker.

```JSON
shim: {
   ...
   handsontable: {
      deps: [
         'jquery'
      ]
   }
}
```

We also have to add a suitable path mapping:


```JSON
paths: {
   ...
   'handsontable': 'handsontable/dist/jquery.handsontable.full'
}
```

The following code snippet shows how to include Handsontable and the required CSS:


```JSON
define( [
   ...
   'handsontable',
   'css!handsontable',
   'jquery_ui/datepicker'
], function( ... ) {
...
} );
```
When the dependency 'handsontable' is mentioned, requireJS will deduce that jQuery needs to be loaded before Handsontable.
The path mapping provides the exact path to Handsontable's Javascript file:
'handsontable/dist/jquery.handsontable.full.js'.
Similar to the Angular-nvD3 case, require-css is used to load the CSS file 'handsontable/dist/jquery.handsontable.full.css'.
