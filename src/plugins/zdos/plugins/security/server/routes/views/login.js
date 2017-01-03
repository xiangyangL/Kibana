import { get } from 'lodash';

export default (server, uiExports) => {
  const config = server.config();
  const cookieName = config.get('zdos.security.cookieName');
  const login = uiExports.apps.byId.login;

  server.route({
    method: 'GET',
    path: '/login',
    handler(request, reply) {

      const showLogin = true;

      const isUserAlreadyLoggedIn = !!request.state[cookieName];
      if (isUserAlreadyLoggedIn || !showLogin) {
        const next = get(request, 'query.next', '/');
        return reply.redirect(`${config.get('server.basePath')}${next}`);
      }
      return reply.renderAppWithDefaultConfig(login);
    },
    config: {
      auth: false
    }
  });
};
