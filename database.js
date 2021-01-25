/*async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://BU0SSpz9lq:E8bz70O3Az@remotemysql.com:3306/BU0SSpz9lq");
    console.log("Conexão com MySQL estabelecida!");
    global.connection = connection;
    return connection;
}
connect();

//async function verVoluntarios(){
    //const conn = await connect();
    //return await conn.query('SELECT nome_voluntario FROM voluntario;');
//}

module.exports = {}*/

const mysql = require('mysql');

module.exports = {
    con: mysql.createConnection({
        host: 'remotemysql.com',
        user: 'BU0SSpz9lq',
        password: 'E8bz70O3Az',
        database: 'BU0SSpz9lq',
        port: 3306
    })
};
/*module.exports = {
    con: mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'fernandes1',
        database: 'BU0SSpz9lq',
        port: 3306
    })
};*/