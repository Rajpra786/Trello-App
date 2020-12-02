const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const {auth} = require('./middleware/auth');
const path = require('path'); 

const {
    RegisterUser,
    LoginUser,
    LogoutUser,
    getUsers,
    Validate    
} = require('./controller/authController');

const {
    createBoard,
    updateBoard,
    addTask,
    getBoard,
    getUserDetails,
    updateTask
} = require('./controller/oprController');

var port = process.env.PORT || 8081;

//Connect to MongoDB Atlas
mongoose.Promise = global.Promise
mongoose.connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//API Endpoints
app.post('/api/register', RegisterUser);
app.post('/api/login', LoginUser);
app.post('/api/boards/createboard', auth, createBoard);
app.post('/api/boards/updateboard', auth, updateBoard);
app.post('/api/boards/addtask',auth,addTask);
app.post('/api/boards/updatetask',auth,updateTask);

app.get('/api/validate',auth,Validate);
app.get('/api/users',auth,getUsers);
app.get('/api/boards', auth, getUserDetails);
app.get('/api/boards/:id/Dashboard', auth, getBoard);
app.get('/api/logout', auth, LogoutUser);

// To serve React build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
}

app.listen(port, () => {
  console.log(`Server running at Port:${port}/`);
});

