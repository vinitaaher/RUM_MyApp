
    // Metrics
import { DiagConsoleLogger, DiagLogLevel, diag, metrics } from '@opentelemetry/api';
import {OTLPMetricExporter} from '@opentelemetry/exporter-metrics-otlp-http';
import {MeterProvider,PeriodicExportingMetricReader,ConsoleMetricExporter, AggregationTemporality,View,InstrumentType} from '@opentelemetry/sdk-metrics';
import { onFID, onLCP, onCLS} from 'web-vitals';

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
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { WebTracerProvider, BatchSpanProcessor, SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { WebVitalsInstrumentation } from './web-vitals-autoinstrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';

const tracingExporter = new OTLPTraceExporter({
  serviceName: "auto-instrumentations-web",
  url: "http://localhost:4318/v1/traces"
});

export const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'browser_Instrumentation',
    'user_agent.original': navigator.userAgent,
    'browser.platform': navigator.userAgentData.platform,
    'browser.brands': navigator.userAgentData.brands,
    'browser.language': navigator.language,
    'os.name': navigator.platform,
    'host.name': 'localhost',
    'browser.mobile': navigator.userAgent.includes('Mobi'),
    'browser.touch_screen_enabled': navigator.maxTouchPoints > 0,
    'browser.language': navigator.language,
    'screen.width': window.screen.width,
    'screen.height': window.screen.height,
  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(tracingExporter));

provider.register({
  contextManager: new ZoneContextManager()
});

const addCustomAttributesToSpan = (span) => {
  span.setAttribute('key1', 'abc');
};

const addCustomAttributesToResourceFetchSpan = (span) => {
  span.setAttribute('key2', 'xyz');
};

registerInstrumentations({
  instrumentations: [
    WebVitalsInstrumentation,
    getWebAutoInstrumentations({
      "@opentelemetry/instrumentation-xml-http-request": {
        enabled: true,
      },
      "@opentelemetry/instrumentation-document-load": {
        enabled: true,
        applyCustomAttributesOnSpan: {
          documentLoad: addCustomAttributesToSpan,
          resourceFetch: addCustomAttributesToResourceFetchSpan,
        }
      },
      "@opentelemetry/instrumentation-user-interaction": {
        enabled: true,
        shouldPreventSpanCreation: (event, element, span) => {
          span.setAttribute('key', 'xyz');
        },
        eventNames: [
          "click",
          "load",
          "loadeddata",
          "loadedmetadata",
          "loadstart",
          "error",
        ]
      },
      '@opentelemetry/instrumentation-fetch': {
        enabled: true,
      }
    })
  ]
});

const fetchInstrumentation = new FetchInstrumentation();
fetchInstrumentation.setTracerProvider(provider);
fetch('http://localhost:63342/myapp/dist/index.html');
fetch('http://localhost:63342/myapp/dist/main.js');
