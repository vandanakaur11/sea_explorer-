
const { config } = require('../config/index');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const { userModel } = require('../models/index')
// const { connectDatabase } = require("./db");


passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALL_BACK_URL,
    passReqToCallback: true
},
    async function (accessToken, refreshToken, profile, email, done) {

        const { id, emails, name: { givenName: firstname, familyName: lastname } } = email;
        const _e = emails[0].value;

        try {
            console.log(id);
            const IsUser = await userModel.findOne({ 'googleId.id': id })

            if (IsUser) {

                return done(null, email);
            }
            if (!IsUser) {

                userModel.diffIndexes();
                const createUser = await userModel.create({
                    firstname,
                    lastname,
                    googleId: {
                        email: _e,
                        id: id
                    }
                });
                createUser.save();
                return done(null, email);
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            return done(null, '')
        }
    }
));

passport.use(new DiscordStrategy({
    clientID: config.DISCORD_CLIENT_ID,
    clientSecret: config.DISCORD_CLIENT_SECRET,
    callbackURL: config.DISCORD_CALL_BACK_URL,
    scope: ['identify', 'email', 'guilds', 'guilds.join']
},
    async function (accessToken, refreshToken, profile, done) {
        let { id, username, email } = profile;
        try {
            const IsUser = await userModel.findOne({ 'discordId.id': id })
            if (IsUser) {
                return done(null, profile);
            }
            if (!IsUser) {

                userModel.diffIndexes();
                const createUser = await userModel.create({
                    firstname: username,
                    lastname: '',
                    discordId: {
                        email: email,
                        id: id
                    }
                });
                console.log(createUser)
                createUser.save();
                return done(null, profile);
            }
        } catch (error) {

            console.log(`Error: ${error.message}`);
            return done(null, '')
        }

    }
))




passport.serializeUser((email, done) => {

    done(null, email);

})

passport.deserializeUser(function (email, done) {

    done(null, email)

})