import { pick } from 'lodash';
import { join } from 'path';

export default class UiNavLink {
  constructor(uiExports, spec) {
    this.id = spec.id;
    this.title = spec.title;
    this.order = spec.order || 0;
    this.url = `${uiExports.urlBasePath || ''}${spec.url}`;
    this.description = spec.description;
    this.icon = spec.icon;
    this.linkToLastSubUrl = spec.linkToLastSubUrl === false ? false : true;
    this.hidden = spec.hidden || false;
    this.disabled = spec.disabled || false;
    this.tooltip = spec.tooltip || '';
    // console.log('ui_nav_link***********************spec');
    // console.dir(spec);

    //控制台打印结果如下

    // ui_nav_link***********************spec
    // { id: 'kibana',
    //   title: 'ZDOS',
    //   order: 0,
    //   description: 'the ZDOS you know and love',
    //   icon: undefined,
    //   url: '/app/kibana' }
    // ui_nav_link***********************spec
    // { id: 'kibana:dashboard',
    //   title: '仪表盘',
    //   order: -1003,
    //   url: '/app/kibana#/dashboard',
    //   description: 'compose visualizations for much win',
    //   icon: 'plugins/kibana/assets/dashboard.svg' }
    // ui_nav_link***********************spec
    // { id: 'kibana:discover',
    //   title: '数据分析',
    //   order: -1002,
    //   url: '/app/kibana#/discover',
    //   description: 'interactively explore your data',
    //   icon: 'plugins/kibana/assets/discover.svg' }
    // ui_nav_link***********************spec
    // { id: 'kibana:visualize',
    //   title: '数据可视化',
    //   order: -1001,
    //   url: '/app/kibana#/visualize',
    //   description: 'design data visualizations',
    //   icon: 'plugins/kibana/assets/visualize.svg' }
    // ui_nav_link***********************spec
    // { title: '开发工具',
    //   order: 9001,
    //   url: '/app/kibana#/dev_tools',
    //   description: 'development tools',
    //   icon: 'plugins/kibana/assets/wrench.svg' }
    // ui_nav_link***********************spec
    // { id: 'kibana:management',
    //   title: '管理',
    //   order: 9003,
    //   url: '/app/kibana#/management',
    //   description: 'define index patterns, change config, and more',
    //   icon: 'plugins/kibana/assets/settings.svg',
    //   linkToLastSubUrl: false }
    // ui_nav_link***********************spec
    // { id: 'timelion',
    //   title: 'Timelion',
    //   order: -1000,
    //   description: 'Time series expressions for everything',
    //   icon: 'plugins/timelion/icon.svg',
    //   url: '/app/timelion' }
  }

  toJSON() {
    return pick(this, ['id', 'title', 'url', 'order', 'description', 'icon', 'linkToLastSubUrl', 'hidden', 'disabled', 'tooltip']);
  }
}
