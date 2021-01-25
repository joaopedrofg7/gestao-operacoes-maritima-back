const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');
const materialMessages = require('../jsonMessages/material');
const ocorrenciaMessages = require('../jsonMessages/ocorrencia');
const equipaMessages = require('../jsonMessages/equipa');
const voluntarioMessages = require('../jsonMessages/voluntario');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function read(req, res) {
    const query = connect.con.query('SELECT O.*, P.descricao_pedido FROM ocorrencia O, pedido P WHERE O.id_pedido = P.id_pedido',
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
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const query = connect.con.query('SELECT O.*, P.descricao_pedido FROM ocorrencia O, pedido P WHERE O.id_pedido = P.id_pedido AND O.id_ocorrencia = ?', id_ocorrencia,
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

function readFinished(req, res){
    const id_estado = 2;
    const query = connect.con.query('SELECT O.*, P.descricao_pedido FROM ocorrencia O, pedido P WHERE O.id_pedido = P.id_pedido AND O.id_estado = ?', id_estado,
        function (err, rows, fields){
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
        })
};

function readInProgress(req, res){
    const id_estado = 1;
    const query = connect.con.query('SELECT O.*, P.descricao_pedido FROM ocorrencia O, pedido P WHERE O.id_pedido = P.id_pedido AND O.id_estado = ?', id_estado,
        function (err, rows, fields){
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
        })
};

function readOnHold(req, res){
    const id_estado = 3;
    const query = connect.con.query('SELECT O.*, P.descricao_pedido FROM ocorrencia O, pedido P WHERE O.id_pedido = P.id_pedido AND O.id_estado = ?', id_estado,
        function (err, rows, fields){
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
        })
};

function updateAcceptOccurrence(req, res) {
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const id_estado = 1;
    const query = connect.con.query('SELECT id_estado FROM ocorrencia WHERE id_ocorrencia = ?', id_ocorrencia,
        function (err, rows, fields){
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const estado_ocorrencia = rows[0].id_estado;
                    if(estado_ocorrencia == 3){
                        const update = [id_estado, id_ocorrencia];
                        const secondquery = connect.con.query('UPDATE ocorrencia SET id_estado = ? WHERE id_ocorrencia = ?', update,
                            function (err, rows, fields) {
                                console.log(secondquery.sql);
                                if(!err){
                                    let transporter = nodemailer.createTransport(smtpTransport({
                                        service: 'Gmail',
                                        auth: {
                                            user: 'pmar.pw.2021@gmail.com',
                                            pass: "Pmarpw2021"
                                        },
                                        tls: {
                                            rejectUnauthorized: false
                                        }
                                    }));
                                    transporter.verify(function (error, success) {
                                        if (error) {
                                        console.log(error);
                                        }
                                        else {
                                        console.log('Email pronto a ser enviado');
                                        }
                                    });
                                    var mailOptions = {
                                        from: 'pmar.pw.2021@gmail.com',
                                        to: 'pw.policiamaritima@gmail.com',
                                        cc: 'pmar.pw.2021@gmail.com',
                                        subject: 'Ocorrencia aceite',
                                        text: `Olá, vimos por este meio informar que a ocorrencia com o id ` + id_ocorrencia + ` foi aceite.\nCom os melhores cumprimentos,\nA equipa Gestor de Operações PMar`
                                    };
                    
                                    transporter.sendMail(mailOptions, function(error, info){
                                        if(error){
                                            console.log(error);
                                        }
                                        else{
                                            console.log('Email enviado: ' + info.response);
                                        }
                                    });
                                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                                } else{
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                }
                            });
                    } else{
                        res.status(ocorrenciaMessages.ocorrencia.estadoErrado.status).send(ocorrenciaMessages.ocorrencia.estadoErrado);
                    }
                }
            }
        })
};

function updateFinishOccurrence(req, res) {
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const id_estado = 2;
    const data_fim_ocorrencia = new Date();
    const disponibilidade = "Disponivel";
    const update1 = [id_estado, data_fim_ocorrencia, id_ocorrencia];
    const query = connect.con.query('UPDATE ocorrencia SET id_estado = ?, data_fim_ocorrencia = ? WHERE id_ocorrencia = ?', update1,
        function (err, rows, fields) {
            console.log(query.sql);
            if(!err){
                //Voltar a guardar o material utilizado
                const secondquery = connect.con.query('SELECT id_material, quantidade_usada FROM ocorrencia_material WHERE id_ocorrencia = ?', id_ocorrencia,
                function (err, rows, fields) {
                    console.log(secondquery.sql);
                    if(err){
                        console.log(err);
                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                    } else{
                        if(!rows.length == 0){
                            let numeroRows = rows.length;
                            //console.log(numeroRows);
                            for(let i = 0; i < numeroRows; i++){
                                const id_material = rows[i].id_material;
                                const quantidade_usada = rows[i].quantidade_usada;
                                const thirdquery = connect.con.query('SELECT quantidade_disponivel FROM material WHERE id_material = ?', id_material,
                                    function (err, rows, fields) {
                                        console.log(thirdquery.sql);
                                        if(err){
                                            console.log(err);
                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                        } else{
                                            if(!rows.length == 0){
                                                let quantidade_disponivel = rows[0].quantidade_disponivel;
                                                quantidade_disponivel = quantidade_disponivel + quantidade_usada;
                                                const update2 = [quantidade_disponivel,id_material];
                                                const fourthquery = connect.con.query('UPDATE material SET quantidade_disponivel = ? WHERE id_material = ?', update2,
                                                    function (err, rows, fields) {
                                                        console.log(fourthquery.sql);
                                                        if(err){
                                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                                        }
                                                    });
                                            }
                                        }
                                    });
                            }
                        }
                    }
                });
                //Tornar disponivel os voluntarios
                const fifthquery = connect.con.query('SELECT id_voluntario FROM ocorrencia_voluntario WHERE id_ocorrencia = ?', id_ocorrencia,
                    function (err, rows, fields) {
                        console.log(fifthquery.sql);
                        if(err){
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        } else{
                            if(!rows.length == 0){
                                let numeroRows2 = rows.length;
                                for(let a = 0; a < numeroRows2; a++){
                                    const id_voluntario = rows[a].id_voluntario;
                                    const update3 = [disponibilidade,id_voluntario];
                                    const sixthquery = connect.con.query('UPDATE voluntario SET disponibilidade = ? WHERE id_voluntario = ?', update3,
                                        function (err, rows, fields) {
                                            console.log(sixthquery.sql);
                                            if(err){
                                                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                            }
                                        });
                                }
                            }
                        }
                    });
                //Tornar disponivel a equipa
                const seventhquery = connect.con.query('SELECT id_equipa FROM ocorrencia WHERE id_ocorrencia = ?', id_ocorrencia,
                    function (err, rows, fields) {
                        console.log(seventhquery.sql);
                        if(err){
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        } else{
                            if(!rows.length == 0){
                                const id_equipa = rows[0].id_equipa;
                                const update4 = [disponibilidade,id_equipa];
                                const eigthquery = connect.con.query('UPDATE equipa SET disponibilidade = ? WHERE id_equipa = ?', update4,
                                    function (err, rows, fields) {
                                        console.log(eigthquery.sql);
                                        if(err){
                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                        }
                                    });
                            }
                        }
                    });
                res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
            } else{
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
};

function updateOccurrenceTeam(req, res) {
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const id_equipa = req.sanitize('id_team').escape();
    const query = connect.con.query('SELECT disponibilidade FROM equipa WHERE id_equipa = ?', id_equipa,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const disponibilidade_atual = rows[0].disponibilidade;
                    if(disponibilidade_atual === 'Indisponivel'){
                        res.status(equipaMessages.equipa.equipaIndisponivel.status).send(equipaMessages.equipa.equipaIndisponivel);
                    } else{
                        const disponibilidade = 'Indisponivel';
                        const update2 = [disponibilidade, id_equipa];
                        const secondquery = connect.con.query('UPDATE equipa SET disponibilidade = ? WHERE id_equipa = ?', update2,
                            function (err, rows, fields) {
                                console.log(secondquery.sql);
                                if(!err){
                                    const update = [id_equipa, id_ocorrencia];
                                    const secondquery = connect.con.query('UPDATE ocorrencia SET id_equipa = ? WHERE id_ocorrencia = ?', update,
                                        function (err, rows, fields) {
                                            console.log(secondquery.sql);
                                            if(!err){
                                                res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                                            } else{
                                                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                            }
                                        });
                                } else{
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                }
                            });
                    }
                }
            }
        });
};

function saveOccurrenceMaterial(req, res){
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const id_material = req.sanitize('id_material').escape();
    let quantidade_usada = req.sanitize('quantidade_usada').escape();
    quantidade_usada = parseInt(quantidade_usada, 10);
    if(quantidade_usada == 0){
        res.status(materialMessages.material.quantidadeNecessaria.status).send(materialMessages.material.quantidadeNecessaria);
    } else{
        let quantidade_disponivel;
        const query = connect.con.query('SELECT quantidade_disponivel FROM material WHERE id_material = ?', id_material,
            function (err, rows, fields) {
                console.log(query.sql);
                if(err){
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                } else{
                    if(rows.length == 0){
                        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                    } else{
                        quantidade_disponivel = rows[0].quantidade_disponivel;
                        quantidade_disponivel = quantidade_disponivel - quantidade_usada;
                        if(quantidade_disponivel>=0){
                            const update1 = [quantidade_disponivel,id_material];
                                const secondquery = connect.con.query('UPDATE material SET quantidade_disponivel = ? WHERE id_material = ?', update1,
                                    function (err, rows, fields) {
                                        console.log(secondquery.sql);
                                        if(err){
                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                        }
                                    });
                            const update2 = [id_ocorrencia,id_material,quantidade_usada];
                            const thirdquery = connect.con.query('INSERT INTO ocorrencia_material SET id_ocorrencia = ?, id_material = ?, quantidade_usada = ?', update2,
                                function (err, rows, fields) {
                                    console.log(thirdquery.sql);
                                    if(!err){
                                        res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                                    } else{
                                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                    }
                                });
                        }
                        else{
                            res.status(materialMessages.material.materialInsuficiente.status).send(materialMessages.material.materialInsuficiente);
                        }
                    }
                }
            });
    }
};

function saveOccurrenceVoluntary(req, res){
    const id_ocorrencia = req.sanitize('id_occurrence').escape();
    const id_voluntario = req.sanitize('id_voluntary').escape();
    const query = connect.con.query('SELECT * FROM voluntario WHERE id_voluntario = ?', id_voluntario,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const disponibilidade_atual = rows[0].disponibilidade;
                    if(disponibilidade_atual === "Indisponivel"){
                        res.status(voluntarioMessages.voluntario.voluntarioIndisponivel.status).send(voluntarioMessages.voluntario.voluntarioIndisponivel);
                    } else{
                        const disponibilidade = "Indisponivel";
                        const update = [disponibilidade,id_voluntario];
                        const secondquery = connect.con.query('UPDATE voluntario SET disponibilidade = ? WHERE id_voluntario = ?', update,
                        function (err, rows, fields) {
                            console.log(secondquery.sql);
                            if(err){
                                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                            } else{
                                const update2 = [id_ocorrencia,id_voluntario];
                                const thirdquery = connect.con.query('INSERT INTO ocorrencia_voluntario SET id_ocorrencia = ?, id_voluntario = ?', update2,
                                function (err, rows, fields) {
                                    console.log(thirdquery.sql);
                                    if(!err){
                                        res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                                    } else{
                                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
}

module.exports = {
    read: read,
    readID: readID,
    readFinished: readFinished,
    readInProgress: readInProgress,
    readOnHold: readOnHold,
    updateAcceptOccurrence: updateAcceptOccurrence,
    updateFinishOccurrence: updateFinishOccurrence,
    updateOccurrenceTeam: updateOccurrenceTeam,
    saveOccurrenceMaterial: saveOccurrenceMaterial,
    saveOccurrenceVoluntary: saveOccurrenceVoluntary
}