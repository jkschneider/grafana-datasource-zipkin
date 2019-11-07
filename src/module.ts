import { ZipkinDatasource } from './datasource';
import { ZipkinAnnotationsQueryCtrl } from './ZipkinAnnotationsQueryCtrl';

class ZipkinConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  ZipkinDatasource as Datasource,
  ZipkinConfigCtrl as ConfigCtrl,
  ZipkinAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
