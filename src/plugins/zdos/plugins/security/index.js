import { join, resolve } from 'path';
import hapiAuthBasic from 'hapi-auth-basic';
import hapiAuthCookie from 'hapi-auth-cookie';
import hapiRbac from 'hapi-rbac';
import getBasicValidate from './server/lib/get_basic_validate';
import getCookieValidate from './server/lib/get_cookie_validate';
import initAuthenticateApi from './server/routes/api/v1/authenticate';
import initLoginView from './server/routes/views/login';
import initLogoutView from './server/routes/views/logout';
import createExpose from './server/lib/create_expose';
import createScheme from './server/lib/login_scheme';

export default function (kibana) {
  return new kibana.Plugin({
    id: 'security',
    publicDir: resolve(__dirname, 'public'),
    configPrefix: 'zdos.security',
    require: ['kibana'],
    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        cookieName: Joi.string().default('sid'),
        encryptionKey: Joi.string().default('password-should-be-32-characters'),
        sessionTimeout: Joi.number().allow(null).default(null),
        secureCookies: Joi.boolean().default(false)
      }).default();
    },
    uiExports: {
      chromeNavControls: ['plugins/security/views/nav_control'],
      app: [{
        id: 'login',
        title: 'Login',
        icon: 'plugins/security/public/images/kibana.svg',
        main: 'plugins/security/views/login',
        hidden: true,
        injectVars(server) {
          const { showLogin, loginMessage, allowLogin } = {showLogin:true, allowLogin:true,loginMessage:'Welcom to ZDOS!'};
          return {
            loginState: {
              showLogin,
              allowLogin,
              loginMessage
            }
          };
        }
      }, {
        id: 'logout',
        title: 'Logout',
        icon: 'plugins/security/public/images/kibana.svg',
        main: 'plugins/security/views/logout',
        hidden: true
      }],
      hacks: [
        'plugins/security/hacks/on_session_timeout',
        'plugins/security/hacks/on_unauthorized_response'
      ],
      injectDefaultVars: function (server) {
        const config = server.config();
        return {
          secureCookies: config.get('zdos.security.secureCookies'),
          sessionTimeout: config.get('zdos.security.sessionTimeout')
        };
      }
    },
    init: function (server) {
      console.log('******************** ZDOS Security *************************' + resolve(__dirname, 'public'));
      const config = server.config();
      //validateConfig(config, message => server.log(['security', 'warning'], message));

      const thisPlugin = this;
      const cookieName = config.get('zdos.security.cookieName');
      server.register([hapiAuthBasic,hapiAuthCookie /*, hapiRbac*/], (err) => {

        if (err) {
          throw err;
        }

        server.auth.scheme('login', createScheme({
          redirectUrl: (path) => loginUrl(config.get('server.basePath'), path),
          strategies: ['security-cookie', 'security-basic']
        }));

        server.auth.strategy('session', 'login', 'required');
        server.auth.strategy('security-basic', 'basic', false, {
          validateFunc: getBasicValidate(server)
        });

        server.auth.strategy('security-cookie', 'cookie', false, {
          cookie: cookieName,
          password: config.get('zdos.security.encryptionKey'),
          clearInvalid: true,
          validateFunc: getCookieValidate(server),
          isSecure: config.get('zdos.security.secureCookies'),
          path: config.get('server.basePath') + '/'
        });

        console.log('register authication successfully');
        console.log('it will redirect to:' + loginUrl(config.get('server.basePath'),'/'));
      });

      createExpose(server);
      initAuthenticateApi(server);
      initLoginView(server, thisPlugin);
      initLogoutView(server, thisPlugin);
    }
  });
}

function loginUrl(baseUrl, requestedPath) {
  const next = encodeURIComponent(requestedPath);
  return `${baseUrl}/login?next=${next}`;
}
