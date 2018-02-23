//import dependency
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config=require('./config/database');

//call connect function so mangoose connect to database
mongoose.connect(config.database);
//putting something so we can sure we were connected
mongoose.connection.on('connected',()=>{
    console.log('connected to  database::: '+config.database);
});
//On error
mongoose.connection.on('error',(err)=>{
    console.log('DataBase Error::: '+err);
});

//load the server in app
const app = express();

//users routes files
const users=require('./routes/users');

//port number
const port = 3000;

//cors middleware
app.use(cors());

//set static folders
app.use(express.static(path.join(__dirname,'public')));

//body parser middleware
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//user route use
app.use('/users',users);

//index route
app.get('/',(req, res)=> {
    res.send('Invalid EndPoint');
});

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});

//start server 
app.listen(port, () => {
    console.log('Server Started Port No::: ' + port)
});
