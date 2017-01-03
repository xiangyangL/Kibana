export default (server) => {
  const ttl = server.config().get('zdos.security.sessionTimeout');
  return () => ttl && Date.now() + ttl;
};
