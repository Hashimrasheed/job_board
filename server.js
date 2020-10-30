const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const jobseekerRouter = require('./routes/jobseekerRouter');
const employerRouter = require('./routes/employerRouter');
const adminRouter = require('./routes/adminRouter');

const app = express();

const PORT = process.env.PORT || 3000

app.use(express.static('public'))


app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use('/', jobseekerRouter);
app.use('/employer', employerRouter);
app.use('/admin', adminRouter);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})