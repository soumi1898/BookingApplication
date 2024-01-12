// Sample backend code using Node.js, Express, and MySQL
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const User = require('./models/user');


const app = express();
const port = 4000;

// Set up MySQL connection

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysqlpass@18',
  database: 'node-complete',
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Display the form and user list on page load
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    res.render('index', { users: result });
  });
});

// Handle form submission
app.post('/addUser', (req, res) => {
  const { userName, emailId, phoneNumber } = req.body;
    User.create({
        userName: userName,
        phoneNumber: phoneNumber,
        emailId: emailId
    })
    .then(result=>{
      console.log(res);
      res.redirect('/');
    })
    .catch(err=>console.log(err));
  // const sql = 'INSERT INTO users (userName, emailId, phoneNumber) VALUES (?, ?, ?)';
  // db.query(sql, [userName, emailId, phoneNumber], (err, result) => {
  //   if (err) throw err;
  //   res.redirect('/');
  // });
});

// Handle user deletion
app.get('/deleteUser/:id', (req, res) => {
  const userId = req.params.id;
  console.log("will delete");

  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Handle user editing (render form with user details for editing)
app.get('/editUser/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.render('edit', { user: result[0] });
  });
});

// Handle form submission for editing user
app.post('/editUser/:id', (req, res) => {
  const userId = req.params.id;
  const { userName, emailId, phoneNumber } = req.body;
  const sql = `UPDATE users SET userName=?, emailId=?, phoneNumber=? WHERE id=${userId}`;
  db.query(sql, [userName, emailId, phoneNumber], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));