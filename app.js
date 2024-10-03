const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const Student = require('./model/Student');
const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Home route to display students
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students });
});

// Route to save a new student
app.post('/save', async (req, res) => {
    const { rollnumber, name, degree, city } = req.body;
    const student = new Student({ rollnumber, name, degree, city });
    await student.save();
    res.redirect('/');
});

// Route to render the update form
app.get('/update/:rollnumber', async (req, res) => {
    const rollnumber = req.params.rollnumber;
    const student = await Student.findOne({ rollnumber: rollnumber });
    res.render('update', { student });
});

// Route to handle the update submission
app.post('/update/:rollnumber', async (req, res) => {
    const rollnumber = req.params.rollnumber;
    const { name, degree, city } = req.body;
    await Student.updateOne({ rollnumber: rollnumber }, { name, degree, city });
    res.redirect('/');
});

// Route to handle deleting a student
app.post('/delete/:rollnumber', async (req, res) => {
    const rollnumber = req.params.rollnumber;
    await Student.deleteOne({ rollnumber: rollnumber });
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on Port No: ${PORT}`);
});
