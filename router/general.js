const express = require('express');
// let books = require("./booksdb.js");
const books = require('./booksdb.js');
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
  //Write your code here
 let username = req.body.username;
 let password = req.body.password;

 if (username && password) {
  if (!doesExist(username)) { 
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  } else {
    return res.status(404).json({message: "User already exists!"});    
  }
} 
return res.status(404).json({message: "Unable to register user."});
//  if (!username & !password){
//   return res.status(400).json({"message": "username or password not provided"})
//  }

// //  let exist = users.filter(user=>user.username === username);

//  if (doesExist(username)){

//   return res.status(408).json({"message": "username already exists"})
//  }


 

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  res.send(JSON.stringify(book,null,4))

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book = []
  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author === author) {
      book.push({ id: key, ...books[key] });
    }
  });

  
  res.send(JSON.stringify(book,null,4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book = []
  const keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title === title) {
      book.push({ id: key, ...books[key] });
    }
  });

  
  res.send(JSON.stringify(book,null,4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  res.send(JSON.stringify(book,null,4))
});

module.exports.general = public_users;
