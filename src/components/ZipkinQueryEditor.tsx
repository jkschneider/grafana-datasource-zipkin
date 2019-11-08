import React, { useState } from 'react';
import { Input, QueryEditorProps, FormLabel } from '@grafana/ui';

import { ZipkinDatasource } from '../datasource';
import { ZipkinQuery, ZipkinOptions } from '../types';

export type Props = QueryEditorProps<ZipkinDatasource, ZipkinQuery, ZipkinOptions>;

export const ZipkinQueryEditor = (props: Props) => {
  const { query, onRunQuery, onChange } = props;
  const [serviceName, setServiceName] = useState(query.serviceName || '');
  const [annotationQuery, setAnnotationQuery] = useState(query.annotationQuery || '');
  const [limit, setLimit] = useState(query.limit || 100);

  const executeOnChangeAndRunQueries = () => {
    onChange({ ...query, serviceName: serviceName, annotationQuery: annotationQuery });
    onRunQuery();
  };

  return (
    <div className="gf-form-group">
      <div className="gf-form-inline">
        <div className="gf-form">
          <FormLabel width={7}>Service name</FormLabel>
          <Input
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            onBlur={executeOnChangeAndRunQueries}
          />
        </div>
      </div>
      <div className="gf-form-inline">
        <div className="gf-form">
          <FormLabel width={7}>Tags</FormLabel>
          <Input
            value={annotationQuery}
            placeholder="http.uri=/foo and retried"
            onChange={e => setAnnotationQuery(e.target.value)}
            onBlur={executeOnChangeAndRunQueries}
          />
        </div>
      </div>
      <div className="gf-form-inline">
        <div className="gf-form">
          <FormLabel width={7}>Limit</FormLabel>
          <Input
            value={limit}
            placeholder="100"
            onChange={e => setLimit(parseInt(e.target.value, 10))}
            onBlur={executeOnChangeAndRunQueries}
          />
        </div>
      </div>
    </div>
  );
};
