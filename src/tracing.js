
import { DiagConsoleLogger, DiagLogLevel, diag, metrics } from '@opentelemetry/api';
import {OTLPMetricExporter} from '@opentelemetry/exporter-metrics-otlp-http';
import {MeterProvider,PeriodicExportingMetricReader,ConsoleMetricExporter} from '@opentelemetry/sdk-metrics';
import { getCLS, getFCP, getFID, getINP, getLCP} from 'web-vitals';


//  console.log('STARTING METRICS');
//  const meterProvider = new MeterProvider();
//
//   metrics.setGlobalMeterProvider(meterProvider);
//
//   let meter = meterProvider.getMeter('web-vitals-meter');
//
//    const observableCounter = meter.createObservableCounter('web_vitals', {
//        description: 'Web Vitals metric',
//    });
//
//    let counter = 0;
//    const attributes = { pid:'name11', environment: 'staging' };
//
//    console.log(counter);
//    // Register a single-instrument callback to the async instrument.
//    observableCounter.addCallback(async (observableResult) => {
//       observableResult.observe(counter, attributes);
//    });
//
//    const exporter =new ConsoleMetricExporter();
//         meterProvider.addMetricReader(new PeriodicExportingMetricReader({
//    //        exporter: new OTLPMetricExporter(),
//            exporter:exporter,
//            exportIntervalMillis: 1000
//          }));
//
//        // Record metrics
//        setInterval(() => {
//          counter++;
//        }, 1000);


    let interval;
    console.log('STARTING METRICS');
    const meterProvider = new MeterProvider();
    metrics.setGlobalMeterProvider(meterProvider);
    let meter = meterProvider.getMeter('web-vitals-meter');
    const exporter =new ConsoleMetricExporter();

     meterProvider.addMetricReader(new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
//        exporter:exporter,
        exportIntervalMillis: 1000
      }));

       const requestCounter = meter.createCounter('Web Vitals', {
          description: 'Web Vitals',
        });



     const dummyData = [
         { name: 'dummy_metric_1', delta: 10 },
         { name: 'dummy_metric_2', delta: 20 },
         { name: 'dummy_metric_3', delta: 30 },
         // Add more dummy data as needed
     ];

     // Call recordWebVitals with each dummy data entry
     dummyData.forEach(data => {
         recordWebVitals(data);
     });

     // Callback to increment the counter for each Web Vitals metric
            function recordWebVitals({ name, delta }) {
                requestCounter.add(delta, { name });
            }


         getCLS(recordWebVitals);
         getLCP(recordWebVitals);
//        interval = setInterval(() => {
//          getCLS(recordWebVitals);
//          getLCP(recordWebVitals);
//        }, 1000);







//  let interval;
//  console.log('STARTING METRICS');
//
//  const meterProvider = new MeterProvider();
//
//  metrics.setGlobalMeterProvider(meterProvider);
//
//  let meter = meterProvider.getMeter('web-vitals-meter');
//
//
//    const exporter =new ConsoleMetricExporter();
//
//     meterProvider.addMetricReader(new PeriodicExportingMetricReader({
//        exporter: new OTLPMetricExporter(),
//        exportIntervalMillis: 1000
//      }));
//
//       const requestCounter = meter.createCounter('CLS', {
//          description: 'Web Vitals',
//        });
//
//
//        const attributes = { environment: 'Test' , value:0};
//
//         requestCounter.add(1, attributes);
//
//        interval = setInterval(() => {
//          requestCounter.add(1, attributes);
//        }, 1000);
