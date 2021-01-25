const connect = require('../../database');
const jsonMessages = require('../../jsonMessages/bd');

module.exports = function (req, res, next) {
  const email_utilizador = req.sanitize('email_utilizador').escape();
  const query = connect.con.query('SELECT * FROM utilizador WHERE email_utilizador = ?', email_utilizador,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        return res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      }
      if (!rows.length) {
        return next()
      } else {
        return res.status(jsonMessages.db.duplicatedEmail.status).send(jsonMessages.db.duplicatedEmail);
      }
    });
};