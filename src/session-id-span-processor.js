import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';

const SESSION_ID_BYTES = 16;
const SHARED_CHAR_CODES_ARRAY = Array(32);

export class SessionIdSpanProcessor extends SimpleSpanProcessor{

     onStart(span, parentContext) {
         const sessionIdGenerator = this._generateSessionId(); // Initialize the session ID generator
         const sessionId = sessionIdGenerator(); // Generate a session ID
        console.log("session.id  "+sessionId);
        span.setAttribute('session.id', this._sessionId);
     }

  _generateSessionId() {
    return () => {
      for (let i = 0; i < SESSION_ID_BYTES * 2; i++) {
        SHARED_CHAR_CODES_ARRAY[i] = Math.floor(Math.random() * 16) + 48;
        // valid hex characters in the range 48-57 and 97-102
        if (SHARED_CHAR_CODES_ARRAY[i] >= 58) {
          SHARED_CHAR_CODES_ARRAY[i] += 39;
        }
      }
      return String.fromCharCode.apply(
        null,
        SHARED_CHAR_CODES_ARRAY.slice(0, SESSION_ID_BYTES * 2),
      );
    };
  }
}

