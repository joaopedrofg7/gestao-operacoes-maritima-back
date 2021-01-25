const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');

function readOperacionaisDashboard(req, res) {
    const query = connect.con.query('select disponibilidade, count(id_operacional) as quantidade_operacional from operacional where disponibilidade in (select disponibilidade from operacional) group by disponibilidade',
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

function readTop3Local(req, res) {
    const query = connect.con.query('select O.id_local, L.morada, count(O.id_local) as quantidade_local from ocorrencia O, localizacao L where O.id_local = L.id_local group by id_local order by count(id_local) desc limit 3;',
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

function readOcorenciasAno(req, res) {
    const query = connect.con.query('SELECT count(*) AS Total, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-01") ) AS Janeiro, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-02") ) AS Fevereiro, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-03") ) AS Março, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-04") ) AS Abril, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-05") ) AS Maio, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-06") ) AS Junho, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-07") ) AS Julho, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-08") ) AS Agosto, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-09") ) AS Setembro, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-010") ) AS Outubro, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-11") ) AS Novembro, ( SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m") = DATE_FORMAT(CURDATE(), "%Y-12") ) AS Dezembro FROM ocorrencia',
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

function readNumNivel(req, res) {
    const query = connect.con.query('select id_nivel, count(id_nivel) as quantidade_nivel from ocorrencia where id_nivel in (select id_nivel from ocorrencia)  group by id_nivel',
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
    readOperacionaisDashboard: readOperacionaisDashboard,
    readTop3Local: readTop3Local,
    readNumNivel: readNumNivel,
    readOcorenciasAno: readOcorenciasAno
 }