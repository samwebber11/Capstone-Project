const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model("users");
const keys = require("../config/db");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const returnedPassport = (passport) => {
    passport.use(
        new JwtStrategy(opts, function(jwt_payload,done){
            User.findById(jwt_payload.id)
                .then(user => {
                    if(user) {
                        return done(null,user);
                    }
                    return done(null,false);
                })
                .catch(err => console.log(err));
        })
    );
};

module.exports = returnedPassport;