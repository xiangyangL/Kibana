import {constant} from 'lodash';
import registry from 'ui/registry/chrome_nav_controls';
import uiModules from 'ui/modules';
import template from 'plugins/security/views/nav_control/nav_control.html';
//import 'plugins/security/services/shield_user';
//import '../account/account';
import PathProvider from 'plugins/zdos_main/services/path';
//import XPackInfoProvider from 'plugins/xpack_main/services/xpack_info';

registry.register(constant({
  name: 'security',
  order: 1000,
  template
}));

const module = uiModules.get('security', ['kibana']);
module.controller('securityNavController', ($scope, globalNavState, kbnBaseUrl) => {
  /*const xpackInfo = Private(XPackInfoProvider);
  const showSecurityLinks = xpackInfo.get('features.security.showLinks');
  if (Private(PathProvider).isLoginOrLogout() || !showSecurityLinks) return;
  */

  $scope.user = {'username':'Bruce', 'full_name':'Bruce Cao'};
  $scope.route = `${kbnBaseUrl}#/account`;

  $scope.formatTooltip = tooltip => {
    // If the sidebar is open then we don't need to show the tooltip.
    if (globalNavState.isOpen()) {
      return;
    }
    return tooltip;
  };
});
