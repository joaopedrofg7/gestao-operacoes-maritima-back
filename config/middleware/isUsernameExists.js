const connect = require('../../database');
const jsonMessages = require('../../jsonMessages/bd');

module.exports = function (req, res, next) {
  const username = req.sanitize('username').escape();
  const query = connect.con.query('SELECT * FROM utilizador WHERE username = ?', username,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        return res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      }
      if (!rows.length) {
        return next()
      } else {
        return res.status(jsonMessages.db.duplicatedUsername.status).send(jsonMessages.db.duplicatedUsername);
      }
    });
};