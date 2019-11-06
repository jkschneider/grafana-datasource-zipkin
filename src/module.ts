import { ZipkinDatasource } from './datasource';
import { ZipkinQueryEditor } from './components';

class ZipkinConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  ZipkinDatasource as Datasource,
  ZipkinQueryEditor as QueryEditor,
  ZipkinConfigCtrl as ConfigCtrl,
};
