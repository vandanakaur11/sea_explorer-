const mongoose = require("mongoose");
const findOrCreate = require('mongoose-find-or-create')

const Scheema = mongoose.Schema;

const userScheema = new Scheema(
    {
        firstname: {
            type: String,
            require: false,
            trime: true,
            unique: false,
            lowercase: true,
        },
        lastname: {
            type: String,
            require: false,
            trime: true,
            unique: false,
        },
        email: {
            type: String,
            trime: true,
            required: false,
            unique: false,

        },
        googleId: {
            id: { type: String, trime: true },
            email: { type: String, trime: true, unique: false },
            unique: false,
        },
        discordId: {
            id: { type: String, trime: true },
            email: { type: String, trime: true, unique: false },
            unique: false,
        },
        password: {
            type: String,
            require: false,
            trime: true,
            minlength: 6,
        },

        code: {
            type: String,
            require: false
        },
        Otpexpiry: {
            type: Date,
            required: false
        },
    },
    { timestamps: true }
);

userScheema.plugin(findOrCreate);

exports.userModel = mongoose.model("users", userScheema);
