const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

  let get_all_books = new Promise((reslove, reject) => {
    const all_books = JSON.stringify(books, null, 4);
    if (all_books.length == 0) {
      reject("Data Not found")
    } else {
      reslove(all_books)
    }
  });

  get_all_books.then(
    (data) => res.send(data),
  ).catch(err => {
    res.send(err)
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let get_book_by_isbn = new Promise((reslove, reject) => {
    if (typeof books[isbn] !== "undefined") {
      reslove(books[isbn])
    } else {
      reject("Data Not found")
    }
  });

  get_book_by_isbn.then(
    (data) => res.send(data),
  ).catch(err => {
    res.send(err)
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_author = Object.values(books).filter((book) => book.author === author);

  let get_book_by_author = new Promise((reslove, reject) => {
    if (filtered_author.length == 0) {
      reject("Data Not found")
    } else {
      reslove(filtered_author)
    }
  });

  get_book_by_author.then(
    (data) => res.send(data),
  ).catch(err => {
    res.send(err)
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_title = Object.values(books).filter((book) => book.title === title);

  let get_book_by_title = new Promise((reslove, reject) => {
    if (filtered_title.length == 0) {
      reject("Data Not found")
    } else {
      reslove(filtered_title)
    }
  });

  get_book_by_title.then(
    (data) => res.send(data),
  ).catch(err => {
    res.send(err)
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let get_book = books[isbn];
  let book_reviews = get_book['reviews']
  if (Object.keys(book_reviews).length == 0) {
    return res.status(204).json({message: "Can't be found"});
  }
  res.send(book_reviews)
});

module.exports.general = public_users;
