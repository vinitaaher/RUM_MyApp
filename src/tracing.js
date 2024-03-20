
import { DiagConsoleLogger, DiagLogLevel, diag, metrics } from '@opentelemetry/api';
import {OTLPMetricExporter} from '@opentelemetry/exporter-metrics-otlp-http';
import {MeterProvider,PeriodicExportingMetricReader,ConsoleMetricExporter, AggregationTemporality,View,InstrumentType} from '@opentelemetry/sdk-metrics';
 import { onFID, onLCP, onCLS} from 'web-vitals';
 import { Resource } from '@opentelemetry/resources';

                  // Metrics

   let interval;
   console.log('STARTING METRICS');
   const meterProvider = new MeterProvider();
   metrics.setGlobalMeterProvider(meterProvider);
   let meter = meterProvider.getMeter('web-vitals-meter');
   const exporter =new OTLPMetricExporter();
   exporter.selectAggregationTemporality(InstrumentType.UP_DOWN_COUNTER,AggregationTemporality.DELTA);
   meterProvider.addMetricReader(new PeriodicExportingMetricReader({
       exporter: exporter,
//        exporter:exporter,
       exportIntervalMillis: 1000
     }));

    const upDownCounter = meter.createUpDownCounter('Web Vitals', {
      description: 'Example of a UpDownCounter',
    });



  function onReport(metric) {
               console.log(metric.name+'='+metric.value);
               const attributes = { name: metric.name ,
                id:metric.id ,
                rating:metric.rating,
                delta:metric.delta,
                value:metric.value,
                entries:JSON.stringify(metric.entries),
                navigationType:metric.navigationType};
//                vitalGauge.set(metric.delta);
              upDownCounter.add(metric.value,attributes);
           }

// Capture First Input Delay
  onFID((metric) => {
    onReport(metric);
  });


  // Capture Cumulative Layout Shift
  onCLS((metric) => {
    onReport(metric);
  });


  // Capture Largest Contentful Paint
  onLCP((metric) => {
    onReport(metric);
  });


  // tracing
