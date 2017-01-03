import { parse } from 'url';
import { get } from 'lodash';
import 'ui/autoload/styles';
import 'plugins/security/views/login/login.less';
import chrome from 'ui/chrome';
//import parseNext from 'plugins/security/lib/parse_next';
import template from 'plugins/security/views/login/login.html';

const messageMap = {
  SESSION_EXPIRED: 'Your session has expired. Please log in again.'
};

chrome
.setVisible(false)
.setRootTemplate(template)
.setRootController('login', function ($http, $window, secureCookies, loginState) {
  const self = this;

  function setupScope() {
    const defaultLoginMessage = 'Login is currently disabled because the license could not be determined. '
      + 'Please check that Elasticsearch is running, then refresh this page.';
    self.allowLogin = loginState.allowLogin || true;
    self.loginMessage = loginState.loginMessage || defaultLoginMessage;
    self.isDisabled = false;
    self.isLoading = false;
    self.submit = (username, password) => {
      self.isLoading = true;
      self.error = false;
      $http.post('./api/security/v1/login', {username, password}).then(
        () => $window.location.href = `.${next}`,
        () => {
          setupScope();
          self.error = true;
          self.isLoading = false;
        }
      );
    };
  }
  setupScope();
});
