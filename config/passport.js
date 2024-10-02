const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/users");
require("dotenv").config();

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
}

const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
    new Strategy(params, async (payload, done) => {
        try {
            const user = await User.findById(payload.id);
            if (!user) {
                console.log("User not found");
                return done(null, false);
            }
            console.log("User found:", user);
            return done(null, user);
        } catch (err) {
            console.error("Error during JWT authentication:", err);
            return done(err, false);
        }
    })
);

module.exports = passport;