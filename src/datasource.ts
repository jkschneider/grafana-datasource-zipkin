import {
  DataFrameDTO,
  TimeRange
} from '@grafana/data';
import { BackendSrv } from '@grafana/runtime';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/ui';

import { ZipkinQuery, ZipkinOptions, ZipkinSpan, ZipkinTracesField } from './types';

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

  static BUCKET_RANGES = [[0.001, 1], [1, 10], [10, 100], [100, 300], [300, 1_000], [1_000, 10_000], [10_000, Infinity]];

  queryForTarget = (target: ZipkinQuery, range: TimeRange): Promise<DataFrameDTO> => {
    const rangeTo = range.to.unix() * 1000;
    const rangeFrom = range.from.unix() * 1000;

    return Promise.all(
      [...new Array(10)].map((_,i) =>
        Promise.all(
          ZipkinDatasource.BUCKET_RANGES.map(([minDurationMs, maxDurationMs]) => {
            const queryTo = rangeFrom + (i+1) * (rangeTo - rangeFrom) / 10;
            const queryParams = [
              `serviceName=${target.serviceName}`,
              `endTs=${queryTo}`,
              `lookback=${(range.to.unix()-range.from.unix())*1000}`,
              `minDuration=${minDurationMs * 1000}`,
              `limit=${target.limit || 100}`
            ];
            if (maxDurationMs < Infinity) {
              queryParams.push(`maxDuration=${maxDurationMs * 1000}`);
            }
            return this.doRequest('/api/v2/traces', ...queryParams)
            .catch(() => Promise.resolve([]));
          })
        )
        .then((listsOfTraces: ZipkinSpan[][][]) => listsOfTraces.reduce((acc, val) => acc.concat(val), []))
      )
    )
    .then((listsOfTraces: ZipkinSpan[][][]) => {
      const traces = listsOfTraces.reduce((acc, val) => acc.concat(val), []);
      return {
        name: `zipkin-${target.refId}`,
        fields: [new ZipkinTracesField(this.url, target.refId, traces)],
        labels: { dataType: 'zipkin' },
        length: 1,
      } as DataFrameDTO;
    });
  };

  query(options: DataQueryRequest<ZipkinQuery>): Promise<DataQueryResponse> {
    if (options.targets.length <= 0) {
      return Promise.resolve({ data: [] });
    }

    return Promise.all(options.targets.map(target => this.queryForTarget(target, options.range)))
      .then(dataFrames => ({ data: dataFrames }));
  }

  testDatasource() {
    return this.backendSrv.get(this.url + '/api/v2/traces').then(response => {
      if (response.status === 200) {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      }
      return { status: 'error', message: response.error };
    });
  }

  doRequest(path: string, ...q: string[]) {
    return this.backendSrv.get(this.url + path + (q ? `?${q.join('&')}` : ''));
  }
}
