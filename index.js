const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const models = require("./models.js");
const { reject } = require("lodash");
const app = express();

const movies = models.movie;
const users = models.user;

mongoose.connect("mongodb://127.0.0.1/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.get("/", (req, res) => {
  res.send("This is my practice for backend development");
});

//get request to get a list of data about all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get request to get info on movie using title
app.get("/movies/:title", (req, res) => {
  movies
    .findOne({ title: req.params.title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get request to get movie names based on genre
app.get("/movies/genre/:name", (req, res) => {
  movies
    .find({ "genre.name": req.params.name })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets data about movies from director
app.get("/movies/director/:directorName", (req, res) => {
  movies
    .findOne({ "director.name": req.params.directorName })
    .then((movies) => {
      res.json(movies.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets all users
app.get("/users", (req, res) => {
  users
    .find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//gets a user by username
app.get("/users/:userName", (req, res) => {
  users
    .findOne({ userName: req.params.userName })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//POST for user registration
app.post("/users", (req, res) => {
  users
    .findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + "already exists.");
      } else {
        users
          .create({
            userName: req.body.userName,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//PUT for updating users info using username
app.put("/users/:userName", (req, res) => {
  return new Promise((resolve, reject) => {
    users
      .findOneAndUpdate(
        { userName: req.params.userName },
        {
          $set: {
            userName: req.body.userName,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }
      ) //This line makes sure the updated document is returned
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

//POST for adding a movie to favorites
app.post("/users/:userName/movies/:MovieID", (req, res) => {
  return new Promise((resolve, reject) => {
    users
      .findOneAndUpdate(
        { userName: req.params.userName },
        {
          $push: { FavoriteMovies: req.params.MovieID },
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

//Delete for removing movie from list of favorites
app.delete("/users/:userName/movies/:MovieID", (req, res) => {
  return new Promise((resolve, reject) => {
    users
      .findOneAndUpdate(
        { userName: req.params.userName },
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
app.delete("/users/:userName", (req, res) => {
  users
    .findOneAndRemove({ userName: req.params.userName })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.userName + " was not found");
      } else {
        res.status(200).send(req.params.userName + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use(express.static("public"));

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(8080, () => console.log("listening on port 8080"));
