
const passport = require('passport'); //for enable passport features.
const LocalStrategy = require('passport-local').Strategy; //for local strategy.
const bcrypt = require('bcrypt'); //for match encrypted database password with client password.
const authModel = require('./models/auth-model'); //for database query execution.
const JwtStrategy = require('passport-jwt').Strategy; //for request authentication.
const ExtractJwt = require('passport-jwt').ExtractJwt; //for extract JWT token.
const strategy = require('passport-facebook');

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = 'secret123';
const FacebookStrategy = strategy.Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    function (username, password, done) {
        authModel.findOne(username, function (err, result) {
            if (err) { return done(err); }
            if (result.length === 0) {
                return done(null, false, { message: 'Incorrect username.' })
            }

            const user = result[0];
            bcrypt.compare(password, user.password, function (err, result) {
                if (!result) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
        })
    }))

passport.use(new JwtStrategy(options, function (jwtPaylaod, done) {
    authModel.findById(jwtPaylaod.sub, function (err, result) {
        if (err) {
            return done(err, false);
        }

        if (result.length === 0) {
            return done(null, false);
        }

        return done(null, result[0]);
    })
}))

passport.use(new FacebookStrategy({
    clientID: '3646390595433545',
    clientSecret: 'e688c28ed305af1061cf9b3ff2fce624',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: 3646390595433545,
//             clientSecret: 'e688c28ed305af1061cf9b3ff2fce624',
//             callbackURL: "http://localhost:3000/auth/facebook/callback",
//             profileFields: ["email", "name"],
//             enableProof: true
//         },
//         function (accessToken, refreshToken, profile, done) {
//             const { email, first_name, last_name } = profile._json;
//             const userData = {
//                 email,
//                 firstName: first_name,
//                 lastName: last_name
//             };
//             console.log(userData)

//             // new userModel(userData).save();
//             done(null, profile);
//         }
//     )
// );