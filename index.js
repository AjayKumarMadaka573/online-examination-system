const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const examRoutes = require('./routes/exams');
const quotaRoutes = require('./routes/quotas');
const gradingRoutes = require('./routes/grading');
const resultRoutes = require('./routes/results');
const messageRoutes = require('./routes/instructions');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { applyDefaults } = require('./models/ExamAttempted');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'Ajay@143',
  resave: false,
  saveUninitialized: false
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/quotas', quotaRoutes);
app.use('/api/grading', gradingRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/messages', messageRoutes);

let MONGO_URI = "mongodb://localhost:27017/auth-app";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

function ValidateStudent(username, password) {
  // Validate Student
  return true; // Replace with actual validation logic
}

function ValidateTeacher(username, password) {
  // Validate Teacher
  return true; // Replace with actual validation logic
}

app.post('/StudentLogin', (req, res) => {
  console.log(req.body);
  const {username,password,dark} = req.body;

  const user = ValidateStudent(username, password);
  if (user) {
    console.log(username);
    req.session.student = JSON.stringify({username:username});
    if(dark===1){
    req.session.dark = "yes";
    }else{
      req.session.dark = "no";
    }
    res.status(302);
    res.json("success"); // Assuming the file exists
  } else {
    // Handle invalid login
    res.status(401).send('Invalid credentials');
  }
});

app.post('/TeacherLogin', (req, res) => { // Remove async from here
  console.log(req.body);
  const {username,password,dark} = req.body;
  const user = ValidateTeacher(username, password);
  if (user) {
    console.log(username);
    req.session.teacher = JSON.stringify({username:username});
    if(dark===1){
      req.session.dark = "yes";
      }else{
        req.session.dark = "no";
      }
    res.status(302);
   res.json("success");
  } else {
    // Handle invalid login
    res.status(401).send('Invalid credentials');
  }
});

app.post('/writingExam',(req,res)=>{
  const examId=req.body.examId;
  console.log(req.body.examId);
  req.session.exam = JSON.stringify({examId:examId});
  console.log(JSON.parse(req.session.exam));
  if(req.session.exam){
    res.json({data:"Success"});
  }else{
    res.json({data:"Error Occured"});
  }
});

app.get('/sendSessionDetails', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.send(req.session.user);
  } else {
    console.log("Error");
    res.status(401).json({ error: 'User not authenticated' });
  }
});

app.get('/getStudentDetails', (req, res) => {
  if (req.session.student) {
    console.log(req.session.student);
    console.log(req.session.dark);
    res.send({student:req.session.student,dark:req.session.dark});
  } else {
    console.log("Error");
    res.status(401).json({ error: 'User not authenticated' });
  }
});


app.get('/getTeacherDetails', (req, res) => {
  if (req.session.teacher) {
    console.log(req.session.teacher);
    res.send({teacher:req.session.teacher,dark:req.session.dark});
  } else {
    console.log("Error");
    res.status(401).json({ error: 'User not authenticated' });
  }
});

app.get('/getAttemptingExam',(req,res)=>{
  if(req.session.exam){
    console.log(req.session.user);
    const response = JSON.stringify({exam:req.session.exam,user:req.session.user});
    res.json(response);
  }else{
    res.json({data:"failed"});
  }
});

// GoTo Student Page

app.get('/Student',(req,res)=>{
  if(req.session.student){
    const filePath = path.join(__dirname, 'public', 'student.html');
    res.sendFile(filePath);
  }else{
    return res.status(401).json({ message: 'Unauthorized' });
  }
});



// GoTo Teacher Page

app.get('/Teacher',(req,res)=>{
  if(req.session.teacher){
    const filePath = path.join(__dirname, 'public', 'teacher.html');
    res.sendFile(filePath);
  }else{
    return res.status(401).json({ message: 'Unauthorized' });
  }
});


// GoTo Exam Page

app.get('/Exam',(req,res)=>{
  if(req.session.student){
    const filePath = path.join(__dirname, 'public', 'exam.html');
    res.sendFile(filePath);
  }else{
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Login
app.get('/Login',(req,res)=>{
  const filePath = path.join(__dirname, 'public', 'Login.html');
    res.sendFile(filePath);
});

// Logout


app.get('/Logout',(req,res)=>{
  if(req.session.student){
  delete req.session.student;
  } 
  if(req.session.teacher){
    delete req.session.teacher;
  }
    const filePath = path.join(__dirname, 'public', 'exam.html');
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
      }
    res.redirect('/Login');
  
});

});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
