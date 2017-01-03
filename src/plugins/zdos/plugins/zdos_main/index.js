import { join, resolve } from 'path';

export default function (kibana) {
  return new kibana.Plugin({
    id: 'zdos_main',
    publicDir: resolve(__dirname, 'public'),
    require: ['kibana'],
    uiExports: {
    },
    init: function (server) {
      console.log('******************** ZDOS Main *************************');
    }
  });
}
