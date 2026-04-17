const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Dành cho Task 11

// --- TASK 7: Đăng ký User mới ---
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// --- TASK 2: Lấy danh sách toàn bộ sách ---
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// --- TASK 3: Tìm sách theo ISBN ---
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
});
  
// --- TASK 4: Tìm sách theo Tác giả (Author) ---
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  return res.status(200).send(matchingBooks);
});

// --- TASK 5: Tìm sách theo Tiêu đề (Title) ---
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);
  return res.status(200).send(matchingBooks);
});

// --- TASK 6: Lấy danh sách Review của sách ---
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});


/* =========================================================
   TASK 11: ASYNC/AWAIT & PROMISES VỚI AXIOS
   (Phần này dùng để lấy điểm Task 11 theo yêu cầu của IBM)
   ========================================================= */

/* =========================================================
   TASK 11, 12, 13, 14: ASYNC/AWAIT & PROMISES VỚI AXIOS
   ========================================================= */

// Get all books - async/await
public_users.get('/books/async', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Get book by ISBN - Promises
public_users.get('/books/isbn/:isbn', (req, res) => {
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({message: "Book not found by ISBN"}));
});

// Get book by Author - async/await
public_users.get('/books/author/:author', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({message: "Book not found by Author"});
    }
});

// Get book by Title - Promises
public_users.get('/books/title/:title', (req, res) => {
    axios.get(`http://localhost:5000/title/${req.params.title}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({message: "Book not found by Title"}));
});
