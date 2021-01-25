const connect = require('../database');
const jsonMessages = require('../jsonMessages/bd');


function readOccurenceAddress(req, res){
    const id_local = req.sanitize('id_local').escape();
    const query = connect.con.query('SELECT morada FROM localizacao WHERE id_local = ?', id_local,
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
   readOccurenceAddress: readOccurenceAddress
}