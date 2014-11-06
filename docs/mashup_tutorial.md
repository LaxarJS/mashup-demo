# Mashup Demo Tutorial
The *LaxarJS MashupDemo* is a web application which combines two external libraries, a data grid editor ([Handsontable](http://handsontable.com/)) and a charting library ([Angular-nvD3](http://krispo.github.io/angular-nvd3)) by using the LaxarJS event bus.
The MashupDemo consists of four widgets as follows:

## HeadlineWidget
The HeadlineWidget provides a simple headline and is used to display the title "Mashup Demo" in the upper
right corner of the layout.

## DataProviderWidget
The DataProviderWidget's task is to provide initial data sets to choose from.
In our context data sets consist of a set of time series to be visualized as charts by another widget.

![DataProviderWidget](data_provider_widget.png)

When the user selects a data set, the initial time series resource is published on the event bus.

## TableEditorWidget
The TableEditorWidget enables the user to modify the initial time series provided by the DataProviderWidget.
For this purpose we integrated a data grid editor based on the popular *Handsontable* library.

![TableEditorWidget](table_editor_widget.png)

Time series are shown vertically, i.e. each column corresponds to a time series.
The column headers denote the title of the corresponding time series.
The rows headers specify the date grid which the data values of each time series are referring to.
All time series must lie on the same date grid.
Missing values are interpreted as NULL.
However the interpretation of NULL values may vary in other widgets.
A chart widget may choose to set NULL values to 0 or it may ignore the value, depending on the chart type.

When a cell value is changed, a corresponding update is published on the event bus.
The accompanying data can be used to reconstruct the modified time series resource.

## ChartWidget

The ChartWidget displays the published time series resource in a chart. For this purpose we integrated
*Angular-nvD3* as the chart library. The library supports different chart types. In our example we
chose three different chart types: a pie chart, a stacked line chart and a bar chart.

![ChartWidget](chart_widget_line_chart.png)

It is always the current state of the time series resource that is displayed.
In order to do this the ChartWidget subscribes to changes to the time series resource.

## Include External Libraries
In a LaxarJS application we organize the different libraries with (RequireJS)[http://requirejs.org/].

### ChartWidget with Angular-nvD3

### TableEditorWidget with Handsontable

## Widget Communication
![mashup demo](mashup_demo.png)

