const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      res.send("user is sucessfully registered");
    } else {
      res.send("user already exists");
    }
  } else {
    res.send("username or password invalid format");
    return false;
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const allBooks = await books;

    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch {
    return res.status(500).json({message: "Internal Server Error"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try { 
    const fetchedbooks = await books;

    res.send(JSON.stringify(fetchedbooks[req.params.isbn], null, 4));
  } catch {
    return res.status(500).json({message: "Internal Server Error"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try { 
    let filtered = {};
    for (const value of Object.values(books)) {
      if (value.author === req.params.author) {
        filtered = value;
      }
    }
    res.send(JSON.stringify(filtered));
  } catch {
    return res.status(500).json({message: "Internal Server Error"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try { 
    let filtered = {};
    for (const value of Object.values(books)) {
      if (value.title === req.params.title) {
        filtered = value;
      }
    }
    res.send(JSON.stringify(filtered));
  } catch {
    return res.status(500).json({message: "Internal Server Error"});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try { 
    const fetchedbooks = await books;

    res.send(JSON.stringify(fetchedbooks[req.params.isbn].reviews, null, 4));
  } catch {
    return res.status(500).json({message: "Internal Server Error"});
  }
});

module.exports.general = public_users;
