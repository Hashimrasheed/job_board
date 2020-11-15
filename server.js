const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./app/config/connection');
const cors = require('cors');
const jobseekerRouter = require('./routes/jobseekerRouter');
const employerRouter = require('./routes/employerRouter');
const adminRouter = require('./routes/adminRouter');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash')
const cookieSession = require('cookie-session')
const fileUpload = require('express-fileupload');
require('./app/config/googlepassport');
require('./app/config/facebookpassport');
const PORT = process.env.PORT || 3000

const app = express();
app.use(flash())
app.use(fileUpload());
app.use(cors());
app.use(express.static('public'))

//database connection
db.connect((err) => {
    if(err) console.log("Connection failed" + err);
    else console.log("Database connected");
});


//user session
app.use('/user', session({
    name: 'userCookie',
    secret: 'usersecret',
    store: new MongoStore({
         url: 'mongodb://localhost:27017/jobBoard',
         collection: 'userSession'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

//employer session
app.use('/employer', session({
    name: 'employerCookie',
    secret: 'employersecret',
    store: new MongoStore({
         url: 'mongodb://localhost:27017/jobBoard',
         collection: 'employerSession'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

//admin session
app.use('/admin', session({
    name: 'adminCookie',
    secret: 'adminsecret',
    store: new MongoStore({
         url: 'mongodb://localhost:27017/jobBoard',
         collection: 'adminSession'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

//passport setup
app.use(passport.initialize());
app.use(passport.session());

// locals middlewares
app.use('/user', (req, res, next) => {
      res.locals.usersession = req.session.user;
    next();
  });

//view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect('/user')
});
app.use('/user', jobseekerRouter);
app.use('/employer', employerRouter);
app.use('/admin', adminRouter);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})