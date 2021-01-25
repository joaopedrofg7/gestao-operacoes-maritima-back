const connect = require('../../database');
const jsonMessages = require('../../jsonMessages/bd');
const utilizadorMessages = require('../../jsonMessages/utilizador');

module.exports = function (req, res, next) {
  const email_utilizador = req.sanitize('email_utilizador').escape();
  const query = connect.con.query('SELECT id_cargo FROM utilizador WHERE email_utilizador = ?', email_utilizador,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        return res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
      } else{
        if(rows.length == 0){
            res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
        } else{
          const id_cargo = rows[0].id_cargo;
          if (id_cargo == 2 || id_cargo == 4) {
            return next()
          } else {
            return res.status(utilizadorMessages.utilizador.acessoNegado.status).send(utilizadorMessages.utilizador.acessoNegado);
          }
        }
      }
    });
};