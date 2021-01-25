const app = require('./server.js');
const router = require('./routes/mainRoutes.js');
const bodyParser = require("body-parser");
const expressSanitizer = require('express-sanitizer');
const validator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
var env = require('dotenv').config();
var exphbs = require('express-handlebars');
const passport = require('passport');
var models = require("./models");

//load passport strategies
//require('./config/passport.js')(passport, models.user);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//app.use(cookieParser);
app.use(expressSanitizer());
app.use(validator());

//Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized:true,
    cookie: {
        maxAge: 1 * 1 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//Handlebars
/*app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');*/

/*//app.use(cookieParser);
app.use(expressSanitizer());
app.use(validator());*/

//Importar as rotas
//require("./routes/mainRoutes")(app);
require('./routes/auth.js')(app);
app.use('/', router);

//Sincronizar a base de dados
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});