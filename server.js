const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken"); // jwt needs to be installed "npm i jsonwebtoken"
const expressJwt = require("express-jwt"); // express-jwt needs to be installed
const { error } = require("console");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Origin", "Content-type,Authorization");
  next();
});

// Using the body-parser, tells the server what type of data to expect.
// body-parser has to be imported "npm i body-parser"
app.use(bodyParser.json());
const PORT = 3000;
const secretKey = "My super secret key";

const jwtMw = expressJwt.expressjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

// Test data
let users = [
  {
    id: 1,
    username: "Jenn",
    password: "456",
  },
  {
    id: 2,
    username: "Fabio",
    password: "123",
  },
  {
    id: 3,
    username: "John",
    password: "789",
  },
];

app.post("/api/login", (req, res) => {
  // destructuring the data
  const { username, password } = req.body;
  let foundUser = null; // Variable to store the matching user
  // User validation logic
  let user;
  for (user of users) {
    if (username == user.username && password == user.password) {
      foundUser = user;
      break; // Exit the loop as soon as a match is found
    }
  }
  if (foundUser) {
    let token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
      expiresIn: "3m",
    });

    res.json({
      success: true,
      err: null,
      token: token, // We can remove the token: for short
    });
  } else {
    res.status(401).json({
      success: false,
      token: null,
      err: "username or password is incorrect",
    });
  }
});

// Protected routes
app.get("/api/dashboard", jwtMw, (req, res) => {
  console.log(req);
  res.json({
    success: true,
    dashboardContent: `<h1>Welcome to the Dashboard</h1>`,
  });
});

// app.get("/api/settings", jwtMw, (req, res) => {
//   res.json({
//     success: true,
//     settingsContent: "Settings Page",
//   });
// });

app.get("/api/settings", jwtMw, (req, res) => {
  res.json({
    success: true,
    settingsContent: `<h1>Welcome to the Settings Page</h1>`,
  });
});

// Adding a route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialErr: err,
      err: "username or password is incorrect 2",
    });
  } else {
    next(err);
  }
});
// Adding a route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serving on port: ${PORT}`); // using `` to wrap the variable
});
