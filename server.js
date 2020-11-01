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
const cookieSession = require('cookie-session')
require('./app/config/googlepassport');
require('./app/config/facebookpassport');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000


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

app.use(express.static('public'))


//passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: "thisissecretkey"}))

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', jobseekerRouter);
app.use('/employer', employerRouter);
app.use('/admin', adminRouter);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})