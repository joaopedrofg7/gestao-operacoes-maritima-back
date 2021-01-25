const express = require('express');
//const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

//const cors = require("cors");
/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
require('./loader');