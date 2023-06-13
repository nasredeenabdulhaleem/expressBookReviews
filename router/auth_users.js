const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  const username = req.session.authorization['username'];
  console.log('user', username);
  let book = books[isbn]
  if (book) {// Book identifier
    const reviews = book.reviews;
    if (!reviews[isbn]) {
      // No existing reviews for the ISBN, add a new entry
      reviews[isbn] = {
        [username]: review
      };
    } else {
      // Check if the user already has a review for the ISBN
      if (reviews[isbn][username]) {
        // User already has a review, modify the existing one
        reviews[isbn][username] = review;
      } else {
        // User doesn't have a review, add a new one
        reviews[isbn][username] = review;
      }

      reviews[username] = review;
      return res.send(`Review added successfully`)
    }
  }
  else {
    return res.status(404).json({ "message": `Book with Isbn ${isbn} not found` })
  }
  res.send("Request not completed successfully")

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;

  let book = books[isbn]

  if (!book) {
    res.send('Invalid request');
    return;
  }
  const reviews = book.reviews;

  if (!reviews) {
    res.send('No reviews found for the provided ISBN');
    return;
  }

  // Check if the user has a review for the provided ISBN
  if (!reviews[username]) {
    res.send('User does not have a review for the provided ISBN');
    return;
  }

  // Delete the user's review
  delete reviews[username];

  res.send('Review deleted successfully');
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
