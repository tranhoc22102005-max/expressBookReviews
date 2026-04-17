const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  // logic here
});

public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn]);
});

public_users.get('/author/:author',function (req, res) {
  // logic here
});

public_users.get('/title/:title',function (req, res) {
  // logic here
});

public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

// TASK 10: Lấy toàn bộ sách bằng Async/Await Axios
public_users.get('/books/async', async function (req,res) {
    try {
        let response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// TASK 11: Tìm sách theo ISBN bằng Promise Axios
public_users.get('/books/isbn/promise/:isbn', function (req,res) {
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({message: "Error fetching by ISBN"}));
});

// TASK 12: Tìm sách theo Tác giả bằng Promise Axios
public_users.get('/books/author/promise/:author', function (req,res) {
    axios.get(`http://localhost:5000/author/${req.params.author}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({message: "Error fetching by Author"}));
});

// TASK 13: Tìm sách theo Tiêu đề bằng Promise Axios
public_users.get('/books/title/promise/:title', function (req,res) {
    axios.get(`http://localhost:5000/title/${req.params.title}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({message: "Error fetching by Title"}));
});

module.exports.general = public_users;
