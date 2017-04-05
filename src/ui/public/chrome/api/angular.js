import _ from 'lodash';
import { format as formatUrl, parse as parseUrl } from 'url';

import modules from 'ui/modules';
import Notifier from 'ui/notify/notifier';
import { UrlOverflowServiceProvider } from '../../error_url_overflow';

const URL_LIMIT_WARN_WITHIN = 1000;
//建立映射替换面包屑里的英文
const zdosMapping = [];
zdosMapping['/management'] = ['管理'];
zdosMapping['/dev_tools/console'] = ['开发者工具','控制台'];
zdosMapping['/visualize/step/1'] = ['管理','步骤',1];
zdosMapping['/visualize/step/2'] = ['管理','步骤',2];
zdosMapping['/management/kibana/indices/logstash-*'] = ['管理','zdos','索引','logstash-*'];
zdosMapping['/management/kibana/objects'] = ['管理','zdos','对象'];
zdosMapping['/management/kibana/settings'] = ['管理','zdos','设置'];
zdosMapping['/management/kibana/index/'] = ['管理','zdos','索引'];
zdosMapping['/management/kibana/indices/logstash-*/create-field/'] = ['管理','zdos','索引','logstash-*','创建字段'];
zdosMapping['/management'] = ['管理'];

module.exports = function (chrome, internals) {
  chrome.getFirstPathSegment = _.noop;
  chrome.getBreadcrumbs = _.noop;

  chrome.setupAngular = function () {
    let kibana = modules.get('kibana');

    _.forOwn(chrome.getInjected(), function (val, name) {
      kibana.value(name, val);
    });

    kibana
    .value('kbnVersion', internals.version)
    .value('buildNum', internals.buildNum)
    .value('buildSha', internals.buildSha)
    .value('serverName', internals.serverName)
    .value('uiSettings', internals.uiSettings)
    .value('sessionId', Date.now())
    .value('chrome', chrome)
    .value('esUrl', (function () {
      let a = document.createElement('a');
      a.href = chrome.addBasePath('/elasticsearch');
      return a.href;
    }()))
    .config(chrome.$setupXsrfRequestInterceptor)
    .config(['$compileProvider', function ($compileProvider) {
      if (!internals.devMode) {
        $compileProvider.debugInfoEnabled(false);
      }
    }])
    .run(($location, $rootScope, Private) => {
      chrome.getFirstPathSegment = () => {
        return $location.path().split('/')[1];
      };

      chrome.getBreadcrumbs = () => {
        let path = $location.path();
        let length = path.length - 1;

        // trim trailing slash
        if (path.charAt(length) === '/') {
          length--;
        }
        // 注销原先代码
        // return path.substr(1, length)
        //   .replace(/_/g, ' ') // Present snake-cased breadcrumb names as individual words
        //   .split('/');
        // console.log('******************************++++++++++++++++++++++++++++--------------------------');
        // console.log(path);
        // console.log(path.substr(1,length)
        //   .replace(/_/g, ' ')
        //   .split('/')
        // );
        //加入判断，若映射数据中有该路径，则返回汉化的映射数据
        if (zdosMapping[path]) {
          return zdosMapping[path];
        } else {
          //若映射数据中没有该路径，则按原先方法处理
          return path.substr(1,length)
            .replace(/_/g, ' ')
            .split('/');
        }
      };

      const notify = new Notifier();
      const urlOverflow = Private(UrlOverflowServiceProvider);
      const check = (event) => {
        if ($location.path() === '/error/url-overflow') return;

        try {
          if (urlOverflow.check($location.absUrl()) <= URL_LIMIT_WARN_WITHIN) {
            notify.directive({
              template: `
                <p>
                  The URL has gotten big and may cause Kibana
                  to stop working. Please either enable the
                  <code>state:storeInSessionStorage</code>
                  option in the <a href="#/management/kibana/settings">advanced
                  settings</a> or simplify the onscreen visuals.
                </p>
              `
            }, {
              type: 'error',
              actions: [{ text: 'close' }]
            });
          }
        } catch (e) {
          const { host, path, search, protocol } = parseUrl(window.location.href);
          // rewrite the entire url to force the browser to reload and
          // discard any potentially unstable state from before
          window.location.href = formatUrl({ host, path, search, protocol, hash: '#/error/url-overflow' });
        }
      };

      $rootScope.$on('$routeUpdate', check);
      $rootScope.$on('$routeChangeStart', check);
    });

    require('../directives')(chrome, internals);

    modules.link(kibana);
  };

};
