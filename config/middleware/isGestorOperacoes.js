const connect = require('../../database');
const jsonMessages = require('../../jsonMessages/bd');
const utilizadorMessages = require('../../jsonMessages/utilizador');

module.exports = function (req, res, next) {
  const username = req.user.username;
  const query = connect.con.query('SELECT id_cargo FROM utilizador WHERE username = ?', username,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        return res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      }
      const id_cargo = rows[0].id_cargo;
      if (id_cargo == 2) {
        return next()
      } else {
        return res.status(utilizadorMessages.utilizador.acessoNegado.status).send(utilizadorMessages.utilizador.acessoNegado);
      }
    });
};