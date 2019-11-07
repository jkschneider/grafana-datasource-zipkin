import { ZipkinAnnotationEvent } from './types';

import {
  AnnotationQueryRequest,
  DataQueryRequest,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/ui';

import { BackendSrv } from '@grafana/runtime';

import { ZipkinQuery, ZipkinOptions, ZipkinSpan } from './types';

export class ZipkinDatasource extends DataSourceApi<ZipkinQuery, ZipkinOptions> {
  type: string;
  url: string;

  /** @ngInject */
  constructor(
    instanceSettings: DataSourceInstanceSettings<ZipkinOptions>,
    private backendSrv: BackendSrv,
  ) {
    super(instanceSettings);
    this.type = 'Zipkin';
    this.url = instanceSettings.jsonData.url;
  }

  query(options: DataQueryRequest<any>): Promise<any> {
    return Promise.resolve({});
  }

  testDatasource() {
    return this.backendSrv.get(this.url + '/api/v2/traces').then(response => {
      if (response.status === 200) {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      }
      return { status: 'error', message: response.error };
    });
  }

  annotationQuery(options: AnnotationQueryRequest<ZipkinQuery>): Promise<ZipkinAnnotationEvent[]> {
    console.log(options);
    return this.doRequest('/api/v2/traces',
      `serviceName=${options.annotation.serviceName}`,
      `e=${options.range.to.unix()}`)
      .then((traces: ZipkinSpan[][]) => {
        return traces.map(trace => {
          const rootSpan = trace[0];
          return {
            id: rootSpan.traceId,
            time: rootSpan.timestamp,
            value: rootSpan.duration, // TODO is this cumulative or should we sum over all spans?
          } as ZipkinAnnotationEvent;
        });
      })
      .catch(() => Promise.resolve([]));
  }

  doRequest(path: string, ...q: string[]) {
    return this.backendSrv.get(this.url + path + (q ? `?${q.join('&')}` : ''));
  }
}

/*
export interface AnnotationEvent {
  id?: string;
  annotation?: any;
  dashboardId?: number;
  panelId?: number;
  userId?: number;
  login?: string;
  email?: string;
  avatarUrl?: string;
  time?: number;
  timeEnd?: number;
  isRegion?: boolean;
  title?: string;
  text?: string;
  type?: string;
  tags?: string[];

  // Currently used to merge annotations from alerts and dashboard
  source?: any; // source.type === 'dashboard'
}
*/
