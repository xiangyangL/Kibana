import main from './plugins/zdos_main';
import security from './plugins/security';

//path未ymal配置文件路径，read_yaml_config读取配置文件
import { getConfig } from '../../server/path';
import readYamlConfig from '../../cli/serve/read_yaml_config';
const obj = readYamlConfig(getConfig());

//kibana.config



module.exports = function (kibana) {
  //将数据库配置数据加入kibana
  kibana.db = obj;

  return [
    main(kibana),
    security(kibana)
  ];
};
