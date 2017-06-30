/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

import * as axMocks from 'laxar-mocks';
import { specData } from './spec_data';
import * as ax from 'laxar';

describe( 'A chart-widget', () => {
   let widgetEventBus;
   let widgetScope;
   let testEventBus;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure( 'timeSeries.resource', 'timeSeriesData' );
      axMocks.widget.configure( 'chart.type', 'multiBarChart' );
   } );

   beforeEach( axMocks.widget.load );

   beforeEach( () => {
      widgetScope = axMocks.widget.$scope;
      widgetEventBus = axMocks.widget.axEventBus;
      testEventBus = axMocks.eventBus;

      widgetScope.api = {
         updateWithOptions: jasmine.createSpy( 'updateWithOptions' )
      };
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( axMocks.tearDown );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature timeSeries and feature chart', () => {

      beforeEach( () => {
         testEventBus.publish( 'didReplace.timeSeriesData', {
            resource: 'timeSeriesData',
            data: specData.originalResource
         } );
         testEventBus.flush();

         widgetScope.api.updateWithOptions.calls.reset();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'acts as a slave of the resource and displays the chart', () => {
         expect( widgetEventBus.subscribe ).toHaveBeenCalledWith(
            'didReplace.timeSeriesData', jasmine.any( Function ) );
         expect( widgetScope.resources.timeSeries ).toEqual( specData.originalResource );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'converts the resource data to chart model and displays the chart', () => {
         expect( widgetScope.model.data ).toEqual( specData.expectedChartModel );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the labels for chart from resource', () => {
         expect( widgetScope.model.options.chart.xAxis.axisLabel )
            .toEqual( specData.originalResource.timeLabel );
         expect( widgetScope.model.options.chart.yAxis.axisLabel )
            .toEqual( specData.originalResource.valueLabel );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'replaces the resource and model after receiving a new resource', () => {
         testEventBus.publish( 'didReplace.timeSeriesData', {
            resource: 'timeSeriesData',
            data: specData.otherResource
         } );
         testEventBus.flush();
         expect( widgetScope.resources.timeSeries ).toEqual( specData.otherResource );
         expect( widgetScope.model.data ).toEqual( specData.expectedChartModelForOtherResource );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'updates the resource after receiving a patch with new values only', () => {
         testEventBus.publish( 'didUpdate.timeSeriesData', {
            resource: 'timeSeriesData',
            patches: specData.patchesWithNewValuesOnly
         } );
         testEventBus.flush();
         expect( widgetScope.api.updateWithOptions ).not.toHaveBeenCalled();

         const modifiedChartModel = ax.object.deepClone( specData.expectedChartModel );
         modifiedChartModel[ 0 ].values[ 0 ].y = 32;
         modifiedChartModel[ 1 ].values[ 2 ].y = 22;
         expect( widgetScope.model.data ).toEqual( modifiedChartModel );
      } );

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'updates the resource after receiving a patch with new values and a new label', () => {
         testEventBus.publish( 'didUpdate.timeSeriesData', {
            resource: 'timeSeriesData',
            patches: specData.patchesWithNewValuesAndLabel
         } );
         testEventBus.flush();
         expect( widgetScope.api.updateWithOptions ).toHaveBeenCalled();

         const modifiedChartModel = ax.object.deepClone( specData.expectedChartModel );
         modifiedChartModel[ 0 ].values[ 0 ].y = 32;
         modifiedChartModel[ 1 ].key = 'New Company';
         modifiedChartModel[ 1 ].values[ 2 ].y = 22;
         expect( widgetScope.model.data ).toEqual( modifiedChartModel );
      } );
   } );
} );

