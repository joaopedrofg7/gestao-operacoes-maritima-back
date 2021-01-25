const db = require("../models");
const crypto = require('crypto');
const jsonMessages = require('../jsonMessages/bd');
const loginMessages = require('../jsonMessages/login');
const utilizadorMessages = require('../jsonMessages/utilizador');

var exports = module.exports = {};

exports.signup = function(req, res){
    const username = req.sanitize('username').escape();
    const nome = req.sanitize('nome').escape();
    const email_utilizador = req.sanitize('email_utilizador').escape();
    const password = req.sanitize('password').escape();
    const password_confirmar = req.sanitize('password_confirmar').escape();
    const id_cargo = 2;
    req.checkBody('username', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('nome', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('email_utilizador', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('password', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('password_confirmar', jsonMessages.db.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
        req.checkBody('email_utilizador', utilizadorMessages.utilizador.emailInvalido).isEmail();
        erros = req.validationErrors();
        if(erros){
            res.send(erros);
        } else{
            if(password === password_confirmar){
                db.User.create({
                    username: username,
                    nome: nome,
                    email_utilizador: email_utilizador,
                    password: password,
                    id_cargo: id_cargo
                  }).then(function () {
                    res.status(loginMessages.user.signupSuccess.status).send(loginMessages.user.signupSuccess);
                  }).catch(function (err) {
                    console.log(err);
                    res.json(err);
                  });
            } else{
                res.status(utilizadorMessages.utilizador.passwordIncompativel.status).send(utilizadorMessages.utilizador.passwordIncompativel);
            }
        }
    }
};

exports.signin = function(req, res){
    res.status(loginMessages.user.invalid.status).send(loginMessages.user.invalid);
};

exports.signinSuccess = function(req, res){
    res.status(loginMessages.user.signinSuccess.status).send(loginMessages.user.signinSuccess);
};

exports.logout = function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.status(loginMessages.user.logoutError.status).send(loginMessages.user.logoutError);
        } else{
            res.status(loginMessages.user.logoutSuccess.status).send(loginMessages.user.logoutSuccess);
        }
    })
};