const { userModel } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { config } = require('../config');
const randomStr = require('randomstring');
const { sendMail } = require('../utils/node.mailer');

exports.signup = async (req, res) => {
    let { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.send({
            Error: true,
            message: "please provide all fields"
        })
    }

    try {
        const isUser = await userModel.findOne({ email });
        if (isUser) {
            return res.send({
                Error: true,
                message: 'user already exsist'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const createUser = await userModel.create({
            firstname,
            lastname,
            email,
            password: hashPassword
        });

        createUser.save();

        return res.send({
            Error: false,
            mesage: "user created sucessfully"
        })


    } catch (error) {
        return res.send({
            error: true,
            message: `internal server error: ${error.message}`
        });
    }
}

exports.login = async (req, res) => {

    let { email, password } = req.body;

    if (!email || !password) {
        return res.send({
            Error: false,
            message: 'please provide all fields'
        });
    }

    try {
        const user = await userModel.findOne({ email }).exec();
        if (!user) {
            return res.send({
                Error: true,
                message: "please enter a correct email!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send({
                Error: true,
                message: 'please enter a correct password'
            });
        }

        const payload = {
            email: user.email,
            id: user._id
        }

        const token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: '365d'
        });

        return res.send({
            email,
            token,
            Error: false,
            message: 'user login  sucessfully'
        });
    } catch (error) {
        return res.send({
            Error: true,
            message: `internal server error: ${error.message}`
        });
    }
}

exports.requestOtp = async (req, res) => {
    let { email } = req.body;

    if (!email) {
        return res.send({
            Error: true,
            message: 'please provide email address'
        })
    }

    try {

        const isUser = await userModel.findOne({ email });
        if (!isUser) {
            return res.send({
                Error: true,
                message: 'User not found!'
            })
        }

        const OtpCode = randomStr.generate(6);

        const createOpt = await userModel.findOneAndUpdate({ email }, {
            code: OtpCode,
            Otpexpiry: new Date(+new Date() + 300000)
        });

        await sendMail(email, OtpCode);


        return res.send({
            Error: false,
            message: 'email send successfully'
        });

    } catch (error) {
        return res.send({
            Error: true,
            message: `internal server error: ${error.message}`
        });
    }
};


exports.verifyOtp = async (req, res) => {
    let { email, code } = req.body;
    console.log(req.body)
    if (!email || !code) {
        return res.send({
            Error: true,
            message: 'please enter a valid code'
        });
    }

    try {

        const isValid = await userModel.findOne({
            email,
            code,
            Otpexpiry: {
                $gte: new Date()
            }
        });

        if (isValid) {
            return res.send({
                Error: false,
                message: true,
            })
        }

        return res.send({
            Error: true,
            message: 'invalid otp or otp expired!'
        })

    } catch (error) {
        return res.send({
            Error: true,
            message: `internal server error: ${error.message}`
        });
    }
}



exports.changePassword = async (req, res) => {
    let { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.send({
            Error: true,
            message: 'Please enter a password'
        });
    }

    try {

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(newPassword, salt)

        const changePass = await userModel.findOneAndUpdate({ email }, {
            password: hashPass
        });

        return res.send({
            Error: false,
            message: true
        });



    } catch (error) {
        return res.send({
            Error: true,
            message: `internal server error: ${error.message}`
        });
    }
}

exports.loginWithSoical = async (req, res) => {
    let { socialId } = req.body;

    if (!socialId) {
        return res.send({
            Error: true,
            message: 'Social id require'
        })
    }
    try {
        let user = await userModel.findOne({
            'googleId.id': socialId
        }).exec();

        if (user) {

            const payload = {
                email: user.googleId.email,
                id: user._id
            }

            const token = jwt.sign(payload, config.JWT_SECRET, {
                expiresIn: '2d'
            });

            return res.send({
                email: user.googleId.email,
                token,
                Error: false,
                message: 'user login  sucessfully'
            });

        }

        if (!user) {
            user = await userModel.findOne({ 'discordId.id': socialId }).exec()
            if (user) {

                const payload = {
                    email: user.discordId.email,
                    id: user._id
                }

                const token = jwt.sign(payload, config.JWT_SECRET, {
                    expiresIn: '2d'
                });

                return res.send({
                    email: user.discordId.email,
                    token,
                    Error: false,
                    message: 'user login  sucessfully'
                });

            }

        }

        if (!user) {
            return res.send({
                Error: true,
                message: 'auth failed or user not found'
            });
        }




    } catch (error) {
        return res.send({
            Error: true,
            message: `internal server error: ${error.message}`
        })
    }
}

exports.getUserInformation = async (req, res) => {
    return res.send({
        Error: false,
        message: req.user
    })
}