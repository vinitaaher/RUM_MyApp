import express from 'express';
const PORT = process.env.PORT || "3000";
//import { datadogRum } from '@datadog/browser-rum';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';

//const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
//const { WebTracerProvider } = require('@opentelemetry/sdk-trace-web');
//const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
//const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
//const { Resource } = require('@opentelemetry/resources');
//const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
//const { B3Propagator } = require('@opentelemetry/propagator-b3');
//const {ZoneContextManager} = require('@opentelemetry/context-zone');
//const { registerInstrumentations } = require('@opentelemetry/instrumentation');
//const { getWebAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-web');
//const { DocumentLoadInstrumentation } = require('@opentelemetry/instrumentation-document-load');
//
const exporter = getExporter('JAEGER');

const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'browser',
  }),
});

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register({
                    contextManager: new ZoneContextManager(),   // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
                    propagator: new B3Propagator(),
                  });

 registerInstrumentations({
   instrumentations: [
     getWebAutoInstrumentations({
       // load custom configuration for xml-http-request instrumentation
       '@opentelemetry/instrumentation-xml-http-request': {
         clearTimingResources: true,
       },
     }),
   ],
 });

registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
  ],
});

const tracer = provider.getTracer('example-tracer-web');

const app = express();
app.get("/", (req, res) => {
// const span = tracer.startSpan('span1');
  res.send("Hello World");
//   span.end();
});

//datadogRum.init({
//    applicationId: '862704ee-ab47-4698-ae65-41218a27a703',
//    clientToken: 'pubd70d07ee0ffb62998e80ad000aff4b06',
//    site: 'us5.datadoghq.com',
//    service: 'myapp',
//    env: '<ENV_NAME>',
//    // Specify a version number to identify the deployed version of your application in Datadog
//    // version: '1.0.0',
//    sessionSampleRate: 100,
//    sessionReplaySampleRate: 26,
//    trackUserInteractions: true,
//    trackResources: true,
//    trackLongTasks: true,
//    defaultPrivacyLevel: 'mask-user-input',
//});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

function getExporter(exporterType) {
    switch (exporterType) {
        case 'OTLP':
            console.log("OTLP Set  ")
            return new OTLPTraceExporter({
                serviceName: "auto-instrumentations-web",
                url: "http://localhost:55680"
//               url: "http://localhost:55680/v1/traces"
            });

        case 'JAEGER':
        default:
            console.log("Jaeger Set  ")
            return new JaegerExporter({
                serviceName: "auto-instrumentations-web",
                endpoint: 'http://localhost:14268/api/traces'

            })
    }
}