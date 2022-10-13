const jwt = require('jsonwebtoken');
const { config } = require('../config/index');
const { userModel } = require('../models/index');

module.exports = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.send({
            Error: true,
            message: false,
        })
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById({ _id: decoded.id });
        if (!user) {
            return res.send({
                Error: true,
                message: false,
            })
        }
        if (user) {
            user.password = ''
            req.user = user;
            next();
        }
    } catch (error) {
        // console.log("token Error", error.message);
        return res.send({
            Error: true,
            message: false,
        })
    }
}