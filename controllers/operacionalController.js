const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');
const operacionalMessages = require('../jsonMessages/operacionais');
const equipaMessages = require('../jsonMessages/equipa');

function read(req, res) {
    const query = connect.con.query('SELECT * FROM operacional',
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

function readID(req, res){
    const id_operacional = req.sanitize('id_operational').escape();
    const query = connect.con.query('SELECT * FROM operacional WHERE id_operacional = ?', id_operacional,
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

function updatePoints(req, res){
    const id_operacional = req.sanitize('id_operational').escape();
    var pontos = req.sanitize('pontos').escape();
    pontos = parseInt(pontos, 10);
    if(pontos == 0){
        res.status(operacionalMessages.operacional.pontosNecessarios.status).send(operacionalMessages.operacional.pontosNecessarios);
    } else{
        const query = connect.con.query('SELECT pontos_gamificacao FROM operacional WHERE id_operacional = ?', id_operacional,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const pontos_atuais = rows[0].pontos_gamificacao;
                    pontos = pontos + pontos_atuais;
                    const update = [pontos,id_operacional];
                    const query = connect.con.query('UPDATE operacional SET pontos_gamificacao = ? WHERE id_operacional = ?', update,
                        function (err, rows, fields) {
                            console.log(query.sql);
                            if(!err){
                                res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                            } else{
                                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                            }
                        });
                }
            }
        });
    }
};

function updateOperationalTeam(req, res){
    const id_operacional = req.sanitize('id_operational').escape();
    const id_equipa = req.sanitize('id_team').escape();
        const query = connect.con.query('SELECT * FROM operacional WHERE id_operacional = ?', id_operacional,
            function (err, rows, fields) {
                console.log(query.sql);
                if(err){
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                } else{
                    if(rows.length == 0){
                        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                    } else{
                            const secondquery = connect.con.query('SELECT * FROM equipa WHERE id_equipa = ?', id_equipa,
                                function (err, rows, fields) {
                                    console.log(secondquery.sql);
                                    if(err){
                                        console.log(err);
                                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                    } else{
                                        if(rows.length == 0){
                                            res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                                        } else{
                                            const disponibilidade = rows[0].disponibilidade;
                                            if(disponibilidade === "Indisponivel"){
                                                res.status(equipaMessages.equipa.equipaIndisponivel.status).send(equipaMessages.equipa.equipaIndisponivel);
                                            } else{
                                                const update = [id_equipa,id_operacional];
                                                const thirdquery = connect.con.query('UPDATE operacional SET id_equipa = ? WHERE id_operacional = ?', update,
                                                    function (err, rows, fields) {
                                                        console.log(thirdquery.sql);
                                                        if(!err){
                                                            res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                                                        } else{
                                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                                        }
                                                    });
                                            }
                                        }
                                    }
                                });
                    }
                }
            });
};

function updateHorario(req, res){
    const id_operacional = req.sanitize('id_operational').escape();
    const horario = req.sanitize('horario').escape();
    req.checkBody('horario', jsonMessages.db.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
        const query = connect.con.query('SELECT * FROM operacional WHERE id_operacional = ?', id_operacional,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const update = [horario,id_operacional];
                    const query = connect.con.query('UPDATE operacional SET horario = ? WHERE id_operacional = ?', update,
                        function (err, rows, fields) {
                            console.log(query.sql);
                            if(!err){
                                res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                            } else{
                                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                            }
                        });
                }
            }
        });
    }
};


function updateOperacional(req, res){
    const id_operacional = req.sanitize('id_operacional').escape();
    let id_equipa = req.sanitize('id_equipa').escape();
    let horario = req.sanitize('horario').escape();
    req.checkBody('horario', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('id_equipa', jsonMessages.db.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
                update = [horario, id_equipa, id_operacional];
                const query = connect.con.query('UPDATE operacional SET horario = ?, id_equipa = ? WHERE id_operacional = ?', update,
                    function (err, rows, fields) {
                        console.log(query.sql);
                        if(!err){
                            res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                        } else{
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        }
                    });
        }
    };
	
	
function readAvailable (req, res) {
    const disponibilidade = "disponível";
    const query = connect.con.query('SELECT * FROM operacional WHERE disponibilidade = ?', disponibilidade,
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

function readEquipa(req, res){
    const id_equipa = req.sanitize('id_equipa').escape();
    const query = connect.con.query('select count(id_operacional) as total from operacional where id_equipa = ?', id_equipa,
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
    read: read,
    readID: readID,
    updatePoints: updatePoints,
    updateOperationalTeam: updateOperationalTeam,
    updateHorario: updateHorario,
	 readEquipa: readEquipa,
	 readAvailable: readAvailable,
	 updateOperacional: updateOperacional
}