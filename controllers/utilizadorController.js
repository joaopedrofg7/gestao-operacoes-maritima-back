const connect = require('../database');
const bcrypt = require('bcrypt');
const jsonMessages = require('../jsonMessages/bd');
const utilizadorMessages = require('../jsonMessages/utilizador');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const niceware = require('niceware');

//NAO MOSTRAR A PASSWORD - ALTERAR

function read(req, res) {
    const query = connect.con.query('SELECT * FROM utilizador',
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
    const username = req.sanitize('username').escape();
    //const username = req.user.username;
    const query = connect.con.query('SELECT * FROM utilizador WHERE username = ?', username,
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

function readProfile(req, res) {
    //const username = req.sanitize('username').escape();
    const username = req.user.username;
    const query = connect.con.query('SELECT * FROM utilizador WHERE username = ?', username,
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

function updateProfile(req ,res){
    let email_comparar;
    const username = req.user.username;
    //const username = req.sanitize('username').escape();
    const saltRounds = 10;
    const nome = req.sanitize('nome').escape();
    const email_utilizador = req.sanitize('email_utilizador').escape();
    const nova_password = req.sanitize('nova_password').escape();
    const repetir_password = req.sanitize('repetir_password').escape();
    const thirdquery = connect.con.query('SELECT email_utilizador FROM utilizador WHERE username = ?', username,
    function (err, rows, fields) {
        console.log(thirdquery.sql);
        if(err){
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        } else{
            if(rows.length == 0){
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            } else{
                email_comparar = rows[0].email_utilizador;
                console.log(email_comparar);
                req.checkBody('nome', jsonMessages.db.requiredData).not().isEmpty();
                req.checkBody('email_utilizador', jsonMessages.db.requiredData).not().isEmpty();
                req.checkBody('nova_password', jsonMessages.db.requiredData).not().isEmpty();
                req.checkBody('repetir_password', jsonMessages.db.requiredData).not().isEmpty();
                var erros = req.validationErrors();
                if(erros){
                    res.send(erros);
                } else{
                    req.checkBody('email_utilizador', utilizadorMessages.utilizador.emailInvalido).isEmail();
                    erros = req.validationErrors();
                    const query = connect.con.query('SELECT email_utilizador FROM utilizador WHERE email_utilizador = ?', email_utilizador,
                    function (err, rows, fields) {
                        console.log(query.sql);
                        if(err){
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        } else{
                            if(rows.length == 0 || email_comparar === email_utilizador){
                                if(erros){ 
                                    res.send(erros);
                                } else{
                                    if(nova_password !== repetir_password){
                                        res.status(utilizadorMessages.utilizador.passwordIncompativel.status).send(utilizadorMessages.utilizador.passwordIncompativel);
                                    } else{
                                        bcrypt.hash(nova_password, saltRounds, function(err, hash) {
                                            update = [nome,email_utilizador,hash,username];
                                            const secondquery = connect.con.query('UPDATE utilizador SET nome = ?, email_utilizador = ?, password = ? WHERE username = ?', update,
                                                function (err, rows, fields) {
                                                    console.log(secondquery.sql);
                                                    if(!err){
                                                        res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                                                    } else{
                                                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                                    }
                                                });
                                        });
                                    }
                                }
                            } else{
                                res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
                            }
                        }
                    });
                }
            }
        }
    });
};

function userRecoverPassword(req, res) {
    const email_utilizador = req.sanitize('email_utilizador').escape();
    const saltRounds = 10;
    req.checkBody('email_utilizador', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('email_utilizador', utilizadorMessages.utilizador.emailInvalido).isEmail();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
        const query = connect.con.query('SELECT email_utilizador FROM utilizador WHERE email_utilizador = ?', email_utilizador,
        function (err, rows, fields) {
            console.log(query.sql);
            if(err){
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            } else{
                if(rows.length == 0){
                    res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
                } else{
                    const result = niceware.generatePassphrase(16);
                    const nova_password = result[0];
                    bcrypt.hash(nova_password, saltRounds, function(err, hash) {
                        console.log(hash);
                        const update = [hash,email_utilizador];
                        const secondquery = connect.con.query('UPDATE utilizador SET password = ? WHERE email_utilizador = ?', update,
                            function (err, rows, fields) {
                                console.log(secondquery.sql);
                                if(err){
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                    return;
                                }
                            });
                    });
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
                        to: email_utilizador,
                        cc: 'pmar.pw.2021@gmail.com',
                        subject: 'Recuperação de password',
                        text: `Olá, a sua nova password é ` + nova_password + `.\nNão se esqueça de alterar para uma nova password através do seu perfil.\nCom os melhores cumprimentos,\nA equipa PMar`
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log('Email enviado: ' + info.response);
                        }
                    });
                    res.status(utilizadorMessages.utilizador.emailEnviado.status).send(utilizadorMessages.utilizador.emailEnviado);
                }
            }
        });
    }
};

function updateUserProfile(req ,res){
    let email_comparar;
    const username = req.user.username;
    const nome = req.sanitize('nome').escape();
    const email_utilizador = req.sanitize('email_utilizador').escape();
    const thirdquery = connect.con.query('SELECT email_utilizador FROM utilizador WHERE username = ?', username,
    function (err, rows, fields) {
        console.log(thirdquery.sql);
        if(err){
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        } else{
            if(rows.length == 0){
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            } else{
                email_comparar = rows[0].email_utilizador;
                console.log(email_comparar);
                req.checkBody('nome', jsonMessages.db.requiredData).not().isEmpty();
                req.checkBody('email_utilizador', jsonMessages.db.requiredData).not().isEmpty();
                var erros = req.validationErrors();
                if(erros){
                    res.send(erros);
                } else{
                    req.checkBody('email_utilizador', utilizadorMessages.utilizador.emailInvalido).isEmail();
                    erros = req.validationErrors();
                    const query = connect.con.query('SELECT email_utilizador FROM utilizador WHERE email_utilizador = ?', email_utilizador,
                    function (err, rows, fields) {
                        console.log(query.sql);
                        if(err){
                            console.log(err);
                            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                        } else{
                            if(rows.length == 0 || email_comparar === email_utilizador){
                                if(erros){ 
                                    res.send(erros);
                                } else{
                                    let update = [nome,email_utilizador,username];
                                    const secondquery = connect.con.query('UPDATE utilizador SET nome = ?, email_utilizador = ? WHERE username = ?', update,
                                        function (err, rows, fields) {
                                            console.log(secondquery.sql);
                                            if(!err){
                                                res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                                            } else{
                                                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                            }
                                        });
                                }
                            } else{
                                res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
                            }
                        }
                    });
                }
            }
        }
    });
};

function updateUserPassword(req ,res){
    const username = req.user.username;
    const saltRounds = 10;
    const nova_password = req.sanitize('nova_password').escape();
    const repetir_password = req.sanitize('repetir_password').escape();
    const thirdquery = connect.con.query('SELECT * FROM utilizador WHERE username = ?', username,
    function (err, rows, fields) {
        console.log(thirdquery.sql);
        if(err){
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        } else{
            if(rows.length == 0){
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            } else{
                req.checkBody('nova_password', jsonMessages.db.requiredData).not().isEmpty();
                req.checkBody('repetir_password', jsonMessages.db.requiredData).not().isEmpty();
                var erros = req.validationErrors();
                if(erros){
                    res.send(erros);
                } else{
                    if(nova_password !== repetir_password){
                        res.status(utilizadorMessages.utilizador.passwordIncompativel.status).send(utilizadorMessages.utilizador.passwordIncompativel);
                    } else{
                        bcrypt.hash(nova_password, saltRounds, function(err, hash) {
                            update = [hash,username];
                            const secondquery = connect.con.query('UPDATE utilizador SET password = ? WHERE username = ?', update,
                                function (err, rows, fields) {
                                    console.log(secondquery.sql);
                                    if(!err){
                                        res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                                    } else{
                                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                    }
                                });
                        });
                    }
                }
            }
        }
    });
};

module.exports = {
    read: read,
    readID: readID,
    readProfile: readProfile,
    updateProfile: updateProfile,
    userRecoverPassword: userRecoverPassword,
    updateUserProfile: updateUserProfile,
    updateUserPassword: updateUserPassword
}