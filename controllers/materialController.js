const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');
const materialMessages = require('../jsonMessages/material');

function read(req, res) {
    const query = connect.con.query('SELECT * FROM material',
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
    const id_material = req.sanitize('id_material').escape();
    const query = connect.con.query('SELECT * FROM material WHERE id_material = ?', id_material,
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

function updateQuantity(req, res){
    const id_material = req.sanitize('id_material').escape();
    let quantidade_nova = req.sanitize('quantidade_nova').escape();
    quantidade_nova = parseInt(quantidade_nova, 10);
    if(quantidade_nova == 0){
        res.status(materialMessages.material.quantidadeNecessaria.status).send(materialMessages.material.quantidadeNecessaria);
    } else{
        let quantidade_disponivel;
        let quantidade_total;
        const query = connect.con.query('SELECT quantidade_disponivel, quantidade_total FROM material WHERE id_material = ?', id_material,
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
                        quantidade_total = rows[0].quantidade_total;
                        quantidade_disponivel = quantidade_disponivel + quantidade_nova;
                        quantidade_total = quantidade_total + quantidade_nova;
                        const update = [quantidade_disponivel,quantidade_total,id_material];
                        const secondquery = connect.con.query('UPDATE material SET quantidade_disponivel = ?, quantidade_total = ? WHERE id_material = ?', update,
                            function (err, rows, fields) {
                                console.log(secondquery.sql);
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

function updateQuantityDamaged(req, res){
    const id_material = req.sanitize('id_material').escape();
    let quantidade_estragada = req.sanitize('quantidade_estragada').escape();
    quantidade_estragada = parseInt(quantidade_estragada, 10);
    if(quantidade_estragada == 0){
        res.status(materialMessages.material.quantidadeNecessaria.status).send(materialMessages.material.quantidadeNecessaria);
    } else{
        let quantidade_disponivel;
        let quantidade_total;
        const query = connect.con.query('SELECT quantidade_disponivel, quantidade_total FROM material WHERE id_material = ?', id_material,
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
                        quantidade_total = rows[0].quantidade_total;
                        quantidade_disponivel = quantidade_disponivel - quantidade_estragada;
                        quantidade_total = quantidade_total - quantidade_estragada;
                        if(quantidade_total<0){
                            res.status(materialMessages.material.materialInsuficiente.status).send(materialMessages.material.materialInsuficiente);
                        } else{
                            const update = [quantidade_disponivel,quantidade_total,id_material];
                            const secondquery = connect.con.query('UPDATE material SET quantidade_disponivel = ?, quantidade_total = ? WHERE id_material = ?', update,
                                function (err, rows, fields) {
                                    console.log(secondquery.sql);
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
};

function saveMaterial(req, res) {
    const nome_material = req.sanitize('nome_material').escape();
    const descricao_material = req.sanitize('descricao_material').escape();
    const quantidade_disponivel = req.sanitize('quantidade').escape();
    const quantidade_total = req.sanitize('quantidade').escape();
    req.checkBody('nome_material', jsonMessages.db.requiredData).not().isEmpty();
    req.checkBody('descricao_material', jsonMessages.db.requiredData).not().isEmpty();
    var erros = req.validationErrors();
    if(erros){
        res.send(erros);
    } else{
        if(quantidade_disponivel == 0){
            res.status(materialMessages.material.quantidadeNecessaria.status).send(materialMessages.material.quantidadeNecessaria);
        } else{
            const query = connect.con.query('SELECT nome_material FROM material WHERE nome_material = ?', nome_material,
            function (err, rows, fields) {
                console.log(query.sql);
                if(err){
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                } else{
                    if(rows.length == 0){
                        const update = [nome_material,descricao_material,quantidade_disponivel,quantidade_total];
                        const secondquery = connect.con.query('INSERT INTO material SET nome_material = ?, descricao_material = ?, quantidade_disponivel = ?, quantidade_total = ?', update,
                            function (err, rows, fields) {
                            console.log(secondquery.sql);
                                if(!err){
                                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                                } else{
                                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                                }
                            });
                    } else{
                        res.status(materialMessages.material.materialExistente.status).send(materialMessages.material.materialExistente);
                    }
                }
            });
        }
    }
};

module.exports = {
    read: read,
    readID: readID,
    updateQuantity: updateQuantity,
    updateQuantityDamaged: updateQuantityDamaged,
    saveMaterial: saveMaterial
}