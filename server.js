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
require('./app/config/googlepassport');
require('./app/config/facebookpassport');
const homeController = require('./app/http/controllers/JobseekerController/homeController')
const PORT = process.env.PORT || 3000

const app = express();
app.use(flash())
app.use(cors());
app.use(express.static('public'))

//database connection
db.connect((err) => {
    if(err) console.log("Connection failed" + err);
    else console.log("Database connected");
});


//session
app.use(cookieSession({
    name: 'jobboard',
    keys: ['key1', 'key2']
}))

app.use(session({
    secret: 'usersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 },
    store: new MongoStore({
        url: 'mongodb://localhost:27017/jobBoard',
        collection: 'userSession'
      })
}))

// app.use('/employer', session({
//     secret: 'employersecret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 },
//     store: new MongoStore({
//         url: 'mongodb://localhost:27017/jobBoard',
//         collection: 'employerSession'
//       })
// }))


//passport setup
app.use(passport.initialize());
app.use(passport.session());

//view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',  homeController().home)
app.use('/user', jobseekerRouter);
app.use('/employer', employerRouter);
app.use('/admin', adminRouter);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})