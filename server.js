// import necessary depenencies
import "dotenv/config";
import express from "express";
import passport from "passport";
import session from "express-session";
// import passport.js
import "./utils/passport.js";

// intialize app and define the server port
const app = express();
const port = process.env.PORT || 8000;

// a middleware to access json data
app.use(express.json());

// use the session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // session secret
    resave: false,
    saveUninitialized: false,
  })
);

// initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// a view to check if the server is running properly
app.get("/", (req, res) => {
  res.send(`My Node.JS APP`);
});

// authetication route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Call back route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    access_type: "offline",
    scope: ["email", "profile"],
  }),
  (req, res) => {
    if (!req.user) {
      res.status(400).json({ error: "Authentication failed" });
    }
    // return user details
    res.status(200).json(req.user);
  }
);

// a function to start the server  and listen to the port defined
const start = async () => {
  try {
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

// call the start function
start();
