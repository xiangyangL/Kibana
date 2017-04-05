import main from './plugins/zdos_main';
import security from './plugins/security';

module.exports = function (kibana) {
  return [
    main(kibana),
    security(kibana)
  ];
};
