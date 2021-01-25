const { json } = require('express');
const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');
const voluntarioMessages = require('../jsonMessages/voluntario');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function read(req, res) {
    const query = connect.con.query('SELECT * FROM voluntario',
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
                    res.send(rows);
                }
            }
        });
}

function readOnHold(req, res) {
    const situacao = "Em espera";
    const query = connect.con.query('SELECT * FROM voluntario WHERE situacao = ?', situacao,
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
    const query = connect.con.query('SELECT * FROM voluntario WHERE disponibilidade = ?', disponibilidade,
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

function updateVoluntary(req, res){
    const id_voluntario = req.sanitize('id_voluntario').escape();
    const nome_voluntario = req.sanitize('nome_voluntario').escape();
    const email = req.sanitize('email').escape();
    let problemas_saude = req.sanitize('problemas_saude').escape();
    let experiencia = req.sanitize('experiencia').escape();
    req.checkBody('nome_voluntario', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('email', jsonMessages.db.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
        req.checkBody('email', voluntarioMessages.voluntario.emailInvalido).isEmail();
        erros = req.validationErrors();
        if(erros){
            res.send(erros);
        }
        else{
            if(experiencia === ""){
                experiencia = 'Nenhuma';
            }
            if(problemas_saude === ""){
                problemas_saude = 'Nenhum';
            }
                update = [nome_voluntario, email, problemas_saude, experiencia, id_voluntario];
                const query = connect.con.query('UPDATE voluntario SET nome_voluntario = ?, email_voluntario = ?, problemas_saude = ?, experiencia = ? WHERE id_voluntario = ?', update,
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
};

function updateAcceptSituation(req, res){
    const id_voluntario = req.sanitize('id_voluntary').escape();
    const aceitarSituacao = 'Aprovado';
    const disponibilidade = 'Disponivel';
    const query = connect.con.query('SELECT situacao FROM voluntario WHERE id_voluntario = ?', id_voluntario,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const situacao = rows[0].situacao;
                    if(situacao === 'Em espera'){
                        const update = [aceitarSituacao, disponibilidade, id_voluntario];
                        const secondquery = connect.con.query('UPDATE voluntario SET situacao = ?, disponibilidade = ? WHERE id_voluntario = ?', update,
                            function (err, rows, fields) {
                                console.log(secondquery.sql);
                                if(!err){
                                    const thirdquery = connect.con.query('SELECT email_voluntario FROM voluntario WHERE id_voluntario = ?', id_voluntario,
                                    function (err, rows, fields) {
                                        console.log(thirdquery.sql);
                                        if(err){
                                            console.log(err);
                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                        } else{
                                            if(rows.length == 0){
                                                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                                            } else{
                                                const email_voluntario = rows[0].email_voluntario;
                                                console.log(email_voluntario);
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
                                                    to: email_voluntario,
                                                    cc: 'pmar.pw.2021@gmail.com',
                                                    subject: 'Candidatura aceite',
                                                    text: `Olá, vimos por este meio informar que a sua candidatura foi aceite.\nEntraremos em contacto consigo para as futuras ocorrencias.\nCom os melhores cumprimentos,\nA equipa PMar`
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
                                            }
                                        }
                                    });
                                } else{
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                }
                            });
                    }else{
                        res.status(voluntarioMessages.voluntario.situacaoInvalida.status).send(voluntarioMessages.voluntario.situacaoInvalida);
                    }
                }
            }
        });
}

function updateRejectSituation(req, res){
    const id_voluntario = req.sanitize('id_voluntary').escape();
    const aceitarSituacao = 'Rejeitado';
    const query = connect.con.query('SELECT situacao FROM voluntario WHERE id_voluntario = ?', id_voluntario,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const situacao = rows[0].situacao;
                    if(situacao === 'Em espera'){
                        const update = [aceitarSituacao, id_voluntario];
                        const secondquery = connect.con.query('UPDATE voluntario SET situacao = ? WHERE id_voluntario = ?', update,
                            function (err, rows, fields) {
                                console.log(secondquery.sql);
                                if(!err){
                                    const thirdquery = connect.con.query('SELECT email_voluntario FROM voluntario WHERE id_voluntario = ?', id_voluntario,
                                    function (err, rows, fields) {
                                        console.log(thirdquery.sql);
                                        if(err){
                                            console.log(err);
                                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                        } else{
                                            if(rows.length == 0){
                                                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                                            } else{
                                                const email_voluntario = rows[0].email_voluntario;
                                                console.log(email_voluntario);
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
                                                    to: email_voluntario,
                                                    cc: 'pmar.pw.2021@gmail.com',
                                                    subject: 'Candidatura recusada',
                                                    text: `Olá, vimos por este meio informar que infelizmente a sua candidatura foi recusada.\nAgradecemos pela sua participação.\nCom os melhores cumprimentos,\nA equipa PMar`
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
                                            }
                                        }
                                    });
                                } else{
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                }
                            });
                    } else{
                        res.status(voluntarioMessages.voluntario.situacaoInvalida.status).send(voluntarioMessages.voluntario.situacaoInvalida);
                    }
                }
            }
        });
}

function saveVoluntary(req, res){
    const nome_voluntario = req.sanitize('nome_voluntario').escape();
    const idade = req.sanitize('idade').escape();
    const email_voluntario = req.sanitize('email_voluntario').escape();
    var motivo_participacao = req.sanitize('motivo_participacao').escape();
    var problemas_saude = req.sanitize('problemas_saude').escape();
    var experiencia = req.sanitize('experiencia').escape();
    req.checkBody('nome_voluntario', voluntarioMessages.voluntario.requiredData).not().isEmpty();
    req.checkBody('idade', voluntarioMessages.voluntario.requiredData).not().isEmpty();
    req.checkBody('email_voluntario', voluntarioMessages.voluntario.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    }
    else{
        req.checkBody('nome_voluntario', voluntarioMessages.voluntario.nomeInvalido).isLength({ min: 3});
        req.checkBody('idade', voluntarioMessages.voluntario.idadeInvalida).isInt();
        req.checkBody('email_voluntario', voluntarioMessages.voluntario.emailInvalido).isEmail();
        req.checkBody('motivo_participacao', voluntarioMessages.voluntario.textoInvalido).isLength({ max: 80});
        req.checkBody('problemas_saude', voluntarioMessages.voluntario.textoInvalido).isLength({ max: 80});
        req.checkBody('experiencia', voluntarioMessages.voluntario.textoInvalido).isLength({ max: 80});
        erros = req.validationErrors();
        if(erros){
            res.send(erros);
        }
        else{
            if(idade<18){
                res.status(voluntarioMessages.voluntario.idadeProibida.status).send(voluntarioMessages.voluntario.idadeProibida);
            }
            else{
                if(motivo_participacao == ""){
                    motivo_participacao = null;
                }
                if(problemas_saude == ""){
                    problemas_saude = "Nenhum";
                }
                if(experiencia == ""){
                    experiencia = "Nenhuma";
                }
                const query = connect.con.query('SELECT email_voluntario FROM voluntario WHERE email_voluntario = ?', email_voluntario,
                function (err, rows, fields) {
                    console.log(query.sql);
                    if(err){
                        console.log(err);
                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                    } else{
                        if(rows.length == 0){
                            const update = [nome_voluntario, idade, email_voluntario, motivo_participacao, problemas_saude, experiencia];
                            const secondquery = connect.con.query('INSERT INTO voluntario SET nome_voluntario = ?, idade = ?, email_voluntario = ?, motivo_participacao = ?, problemas_saude = ?, experiencia = ?', update,
                                function (err, rows, fields) {
                                    console.log(secondquery.sql);
                                    if(!err){
                                        res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                                    } else{
                                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                    }
                                });
                        } else{
                            res.status(voluntarioMessages.voluntario.emailDuplicado.status).send(voluntarioMessages.voluntario.emailDuplicado);
                        }
                    }
                });
            }
        }
    }
}

module.exports = {
    read: read,
    readID: readID,
    readOnHold: readOnHold,
    readAvailable: readAvailable,
    updateVoluntary: updateVoluntary,
    updateAcceptSituation: updateAcceptSituation,
    updateRejectSituation: updateRejectSituation,
    saveVoluntary: saveVoluntary
}