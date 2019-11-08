import { DataQuery, DataSourceJsonData } from '@grafana/ui';
import { FieldDTO, FieldType } from '@grafana/data';

// http://localhost:9411/api/v2/traces?serviceName=canary-demo&annotationQuery=http.path=/quick
export interface ZipkinQuery extends DataQuery {
  serviceName: string;
  annotationQuery: string;
  limit: number;
}

export interface ZipkinOptions extends DataSourceJsonData {
  url: string;
}

// responses from the Zipkin API
export interface ZipkinSpan {
  traceId: string;
  id: string;
  timestamp: number;
  duration: number;
  tags: {[key: string]: string};
}

export class ZipkinTraceFieldValue {
  timestamp: number;
  durationSeconds: number;
  link: string;

  constructor(zipkinUrl: string, span: ZipkinSpan[]) {
    const rootSpan = span[0];
    this.timestamp = rootSpan.timestamp / 1000; // span timestamps are in uS
    this.durationSeconds = rootSpan.duration / 1000 / 1000; // span durations are in uS
    this.link = `${zipkinUrl}/zipkin/traces/${rootSpan.traceId}`;
  }
}

export class ZipkinTracesField implements FieldDTO<ZipkinTraceFieldValue> {
  name: string;
  type = FieldType.other;
  values: ZipkinTraceFieldValue[];

  constructor(zipkinUrl: string, target: string, traces: ZipkinSpan[][]) {
    this.name = `zipkin-${target}`;
    this.values = traces.map(trace => new ZipkinTraceFieldValue(zipkinUrl, trace));
  }
}
