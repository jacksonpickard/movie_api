const express = require("express");
const morgan = require("morgan");
const app = express();

const uuid = require("uuid");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// logger in terminal with morgan
app.use(morgan("common"));

const cors = require("cors");

// Add access control and allow origin headers
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  origin: '*'
}));

// import auth file, passport module, and passport file
const auth = require("./auth.js")(app);
// app.use(auth);


const passport = require("passport");
require("./passport.js");

const mongoose = require("mongoose");
const { restart } = require('nodemon');
const models = require("./models.js");

const Movies = models.Movie;
const Users = models.User;

// express validator for server-side validation
const { check, validationResult } = require('express-validator');

// allows mongoose to connect to database for CRUD operations on docs within REST API
// mongoose.connect("mongodb://127.0.0.1/cfDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// connects database on Atlas to Heroku API
mongoose.connect( "mongodb+srv://myFlixDBadmin:Hannah4225!@myflixdb.mqx7tfr.mongodb.net/myFlixDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//automatically route request to send back response with a file in the /Public root folder. express.static to serve documentaion.html from public folder
app.use(express.static("public"));



// ENDPOINTS

app.get("/", (req, res) => {
  res.send("This is my practice for backend development");
});

//get request to get a list of data about all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies
      .find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get request to get info on movie using title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
  Movies
    .findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get request to get movie names based on genre
app.get("/movies/genre/:genreName",
passport.authenticate("jwt", {session: false}),
(req, res) => {
  Movies
    .findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets data about movies from director
app.get("/movies/director/:directorName", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
  Movies
    .findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets all users
app.get("/users", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
  Users
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets a user by username
app.get("/users/:Username", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
  Users
    .findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//POST for user registration
app.post(
  "/register", 
    [
        check('Username', 'Username must have a minimum of 5 characters').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    // console.log(hashedPassword)
    // console.log(req.body)
  Users
    .findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).json({ error: 'Username or Email already exists' });
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({error: error});
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//PUT for updating users info using username
app.put("/users/:Username", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
  return new Promise((resolve, reject) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users
      .findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          }
        },
        { new: true }, //This line makes sure the updated document is returned
        )
      .then(
        (updatedUser) => {
          resolve(response.json(updatedUser));
        },
        (err) => {
          console.error(err);
          reject(res.status(500).send("Error: " + err));
        }
      );
  });
});

//POST for adding a movie to favorites
app.post("/users/:Username/movies/:MovieID", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
  return new Promise((resolve, reject) => {
    Users
      .findOneAndUpdate(
        { Username: req.params.Username },
        {
          $push: { FavoriteMovies: req.params.MovieID },
        },
        { new: true },
      )
      .then(
        (updatedUser) => {
          resolve(response.json(updatedUser));
        },
        (err) => {
          console.error(err);
          reject(res.status(500).send("Error: " + err));
        }
      );
  });
});

//Delete for removing movie from list of favorites
app.delete("/users/:Username/movies/:MovieID", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
  return new Promise((resolve, reject) => {
    Users
      .findOneAndUpdate(
        { Username: req.params.Username },
        {
          $pull: { FavoriteMovies: req.params.MovieID },
       },
        { new: true }
      )
      .then(
        (updatedUser) => {
          resolve(res.json(updatedUser));
        },
        (err) => {
          console.error(err);
          reject(res.status(500).send("Error: " + err));
        }
      );
  });
});

//DELETE for unregistering
app.delete("/users/:Username",
passport.authenticate("jwt", {session: false}), 
(req, res) => {
  Users
    .findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});

// app.listen(process.env.PORT || 8080, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });
