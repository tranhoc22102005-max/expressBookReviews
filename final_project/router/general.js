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

// Task 11 - Cách 1: Lấy toàn bộ sách bằng Promise/Axios
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

// Task 11 - Cách 2: Tìm sách theo ISBN bằng Promise
const getBookByISBNAsync = (isbn) => {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
};

// Task 11 - Cách 3: Tìm sách theo Tác giả bằng Async/Await
const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

// Task 11 - Cách 4: Tìm sách theo Tiêu đề bằng Promise
const getBookByTitleAsync = (title) => {
    return axios.get(`http://localhost:5000/title/${title}`)
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
};

module.exports.general = public_users;
