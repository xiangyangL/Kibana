//import getClient from './get_client_shield';
import mysql from 'mysql';
import Promise from 'bluebird';
import basicAuth from './basic_auth';

export default function createExports(server, dbSettings) {
  const callWithRequest = function () {
    return function (request) {
      return true;
    };
  };
  server.expose('getUser', (request) => {
    const {username, password} = basicAuth.parseHeader(request.headers.authorization);

    return new Promise(function (resolve, reject) {
      //注销原先代码
      // let connection = mysql.createConnection({
      //   host:'127.0.0.1',
      //   port:3360,
      //   user:'zdos',
      //   password:'zdht@123',
      //   database:'zdos'
      // });
      let connection = mysql.createConnection(dbSettings.db);

      connection.connect(function (err) {
        if (err) {
          return reject(err);
        }
      });
      const columns = ['alias', 'name', 'surname'];
      connection.query('SELECT ?? FROM users WHERE alias = ?  AND passwd = md5(?) ',
                        [columns, username, password],
                        function (error, results, fields) {
                          if (error) {
                            connection.end();
                            return reject(error);
                          }
                          if (results.length !== 1) {
                            connection.end();
                            return reject(new Error('empty record or incorrect record'));
                          } else {
                            let user = {};
                            user.username = results[0].alias;
                            user.firstname = results[0].name;
                            user.lastname = results[0].surname;
                            connection.end();
                            resolve(true);
                          }
                        });
    });
  });
};
