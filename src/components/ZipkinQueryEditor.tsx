import React, { useState } from 'react';
import { QueryEditorProps, FormLabel } from '@grafana/ui';

import { ZipkinDatasource } from '../datasource';
import { ZipkinQuery, ZipkinOptions } from '../types';

export type Props = QueryEditorProps<ZipkinDatasource, ZipkinQuery, ZipkinOptions>;

export const ZipkinQueryEditor = (props: Props) => {
  const { query, onRunQuery, onChange } = props;
  const [serviceName, setServiceName] = useState(query.serviceName || '');
  const [annotations, setAnnotations] = useState(query.annotations || []);

  const executeOnChangeAndRunQueries = () => {
    onChange({ ...query, serviceName: serviceName, annotations: annotations });
    onRunQuery();
  };

  return (
    <>
      <div className="gf-form-inline gf-form-inline--nowrap">
        <div className="gf-form flex-shrink-0">
          <FormLabel width={7}>Service Name</FormLabel>
        </div>
        <div className="gf-form gf-form--grow flex-shrink-1">
          <div className="slate-query-field__wrapper">
            <div className="slate-query-field">
              <input type="text"
                className="gf-form-input"
                placeholder="text $tagKey"
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                onBlur={executeOnChangeAndRunQueries} />
            </div>
          </div>
        </div>
      </div>
      <div className="gf-form-inline gf-form-inline--nowrap">
        <div className="gf-form flex-shrink-0">
          <FormLabel width={7}>Annotations</FormLabel>
        </div>
        <div className="gf-form gf-form--grow flex-shrink-1">
          <input type="text"
            className="gf-form-input"
            placeholder="http.path=/get,k2=v2"
            value={annotations.map(a => `${a.key}=${a.value}`).join(',')}
            onChange={e => setAnnotations(e.target.value.split(',').map(kv => {
              const [key, value] = kv.split('=');
              return { key: key, value: value };
            }))}
            onBlur={executeOnChangeAndRunQueries} />
        </div>
      </div>
    </>
  );
};
