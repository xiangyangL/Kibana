import _ from 'lodash';
import Plugin from './plugin';
import { basename, join } from 'path';

module.exports = class PluginApi {
  constructor(kibana, pluginPath) {
    // 参数kibana实际是 kbn_server
    //kbn_server中的config为空，因此将kbn_server里settings的内容给config

    //注销原先代码
    this.config = kibana.config;
    this.settings = kibana.settings;
    this.rootDir = kibana.rootDir;
    this.package = require(join(pluginPath, 'package.json'));
    this.Plugin = Plugin.scoped(kibana, pluginPath, this.package);
  }

  get uiExports() {
    throw new Error('plugin.uiExports is not defined until initialize phase');
  }

  get autoload() {
    console.warn(
      `${this.package.id} accessed the autoload lists which are no longer available via the Plugin API.` +
      'Use the `ui/autoload/*` modules instead.'
    );

    return {
      directives: [],
      filters: [],
      styles: [],
      modules: [],
      require: []
    };
  }
};
