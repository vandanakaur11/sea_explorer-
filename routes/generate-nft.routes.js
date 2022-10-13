const express = require('express');
// const basePath = process.cwd();
const authMiddleWare = require('../middlewares/auth.middleware');
// const basePath = process.cwd();
// const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);

const { generateNft, getThumbnails, getCollection } = require('../controllers/generator.controller')

const app = express();

const router = express.Router();


router.get('/', (req, res) => {
    res.send({
        Error: false,
        message: 'nft route work fine!'
    })
})

router.post('/generate', generateNft);

router.post('/get-thumbnails', getThumbnails);

router.post('/get-collection', getCollection);

exports.GenerateNfts = app.use('/nft', router);