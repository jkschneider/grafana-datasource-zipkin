import { DataQuery, DataSourceJsonData } from '@grafana/ui';
import { AnnotationEvent } from '@grafana/data';

// http://localhost:9411/api/v2/traces?serviceName=canary-demo&annotationQuery=http.path=/quick
export interface ZipkinQuery extends DataQuery {
  serviceName: string;
  annotations: ZipkinAnnotation[];
}

export interface ZipkinAnnotation {
  key: string;
  value?: string;
}

export interface ZipkinOptions extends DataSourceJsonData {
  url: string;
}

/*
[
  [
    {
      "traceId": "5f189d597c991577",
      "id": "5f189d597c991577",
      "kind": "SERVER",
      "name": "get /quick",
      "timestamp": 1570737975329018,
      "duration": 329,
      "localEndpoint": {
        "serviceName": "canary-demo",
        "ipv4": "192.168.99.1"
      },
      "remoteEndpoint": {
        "ipv4": "127.0.0.1",
        "port": 49361
      },
      "tags": {
        "http.method": "GET",
        "http.path": "/quick",
        "mvc.controller.class": "DemoController",
        "mvc.controller.method": "quick"
      }
    }
  ],
  ...
*/

// responses from the Zipkin API
export interface ZipkinSpan {
  traceId: string;
  id: string;
  timestamp: number;
  duration: number;
  tags: {[key: string]: string};
}

export interface ZipkinAnnotationEvent extends AnnotationEvent {
  value: number; // for y-axis plotting
}
