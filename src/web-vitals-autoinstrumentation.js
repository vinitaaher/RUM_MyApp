 // web-vitals-autoinstrumentation.js

 import { onFID, onLCP, onCLS} from 'web-vitals';
 import { InstrumentationBase } from '@opentelemetry/instrumentation';
 import { trace, context } from '@opentelemetry/api';
 import { hrTime } from '@opentelemetry/core';
 import{sessionId}from'./session.js'

 export class WebVitalsInstrumentation extends InstrumentationBase {
  // function that creates a span for each web vital and reports the data
  // as attributes
  onReport(metric, parentSpanContext) {
    const now = hrTime();


    // start the span
    const webVitalsSpan = trace
      .getTracer('web-vitals-instrumentation')
      .startSpan(metric.name, { startTime: now }, parentSpanContext);


    // add core web vital attributes
    webVitalsSpan.setAttributes({
      ['web_vital.name']: metric.name,
      ['web_vital.id']: metric.id,
      ['web_vital.navigationType']: metric.navigationType,
      ['web_vital.delta']: metric.delta,
      ['web_vital.rating']: metric.rating,
      ['web_vital.value']: metric.value,
      // can expand these into their own attributes!
      ['web_vital.entries']: JSON.stringify(metric.entries),
       ['sessionId']: sessionId,
    });


    // end the span
    webVitalsSpan.end();
  }


  enable() {
  if (this.enabled) {
    return;
  }
  this.enabled = true;
  // create a parent span that will have all web vitals spans as children
  const parentSpan = trace.getTracer('web-vitals-instrumentation').startSpan('web-vitals');
  const ctx = trace.setSpan(context.active(), parentSpan);
  parentSpan.end();


  // Capture First Input Delay
  onFID((metric) => {
    this.onReport(metric, ctx);
  });


  // Capture Cumulative Layout Shift
  onCLS((metric) => {
    this.onReport(metric, ctx);
  });


  // Capture Largest Contentful Paint
  onLCP((metric) => {
    this.onReport(metric, ctx);
  });
  }
  }