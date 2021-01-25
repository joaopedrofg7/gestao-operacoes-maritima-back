const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');
const equipaMessages= require('../jsonMessages/equipa');

function read(req, res) {
    const query = connect.con.query('SELECT * FROM equipa',
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

function readID(req, res) {
    const id_equipa = req.sanitize('id_team').escape();
    const query = connect.con.query('SELECT * FROM equipa WHERE id_equipa = ?', id_equipa,
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

function readAvailable(req, res) {
    const disponibilidade = "Disponivel";
    const query = connect.con.query('SELECT * FROM equipa WHERE disponibilidade = ?', disponibilidade,
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

function saveTeam(req, res) {
    const nome_equipa = req.sanitize('nome_equipa').escape();
    req.checkBody('nome_equipa', jsonMessages.db.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
            const query = connect.con.query('SELECT nome_equipa FROM equipa WHERE nome_equipa = ?', nome_equipa,
            function (err, rows, fields) {
                console.log(query.sql);
                if(err){
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                } else{
                    if(rows.length == 0){
                        const update = [nome_equipa];
                        const secondquery = connect.con.query('INSERT INTO equipa SET nome_equipa = ?', update,
                            function (err, rows, fields) {
                            console.log(secondquery.sql);
                                if(!err){
                                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                                } else{
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                }
                            });
                    } else{
                        res.status(equipaMessages.equipa.equipaExistente.status).send(equipaMessages.equipa.equipaExistente);
                    }
                }
            });
        
    }
};

module.exports = {
    read: read,
    readAvailable: readAvailable,
    readID: readID,
    saveTeam: saveTeam
}