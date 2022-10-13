const express = require('express');
const { signup, login, requestOtp, verifyOtp, changePassword, loginWithSoical, getUserInformation } = require('../controllers/user.controller');
const authMiddleWare = require('../middlewares/auth.middleware');


const app = express();

const router = express.Router();

router.get('/', (req, res) => {
    res.send({
        Error: false,
        message: 'user route works!'
    })
})

router.post('/signup', signup);

router.post('/login', login);

router.post('/request-otp', requestOtp);

router.post('/verify-otp', verifyOtp);

router.post('/change-password', changePassword);

router.post('/loginWithSocial', loginWithSoical);

router.post('/auth/check', authMiddleWare, (req, res) => {
    return res.send({
        Error: false,
        message: true
    })
});

router.post('/user-info', authMiddleWare, getUserInformation)


exports.UserRoutes = app.use('/user', router);