const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');

function readID(req, res){
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const query = connect.con.query('Select O.id_voluntario, V.nome_voluntario From voluntario V, ocorrencia_voluntario O WHERE O.id_voluntario= V.id_voluntario AND O.id_ocorrencia = ?', id_ocorrencia,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    res.send(rows);
                }
            }
        });
};

module.exports = {
    readID: readID
}