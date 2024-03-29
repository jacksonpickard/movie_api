const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy ({
    usernameField: 'Username',
    passwordField: 'Password'
},  (username, password, callback) => {
        console.log(username + ' / ' + password);
        Users.findOne({ Username: username }).then(user => {
          console.log(user);
          // if there is no such user in database, error message is passed to callback function
          if (!user) {
              console.log('incorrect username');
              return callback({message: 'Incorrect username or password.'}, false);
          }

          if (!user.validatePassword(password)) {
              console.log('incorrect password');
              return callback({message: 'Incorrect password.'}, false);
          }

          console.log('finished');
          return callback(null, user);
        }).catch(error => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            
        });
}));

passport.use(new JWTStrategy ({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));



