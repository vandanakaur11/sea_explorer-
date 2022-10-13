const basePath = process.cwd();
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);
const { nftModel, thumbnailModel } = require('../models/index')


exports.generateNft = async (req, res) => {
    let worker;
    if (isMainThread) {
        worker = new Worker('./Worker.js');
        worker.on('message', async (data) => {

            let { baseUrl, dataSet, dataSet: { userId, projectName, discription } } = data;

            const nftCollection = await nftModel.create({
                collectionName: projectName,
                discription: discription,
                userId: userId
            })

            nftCollection.save();

            await startCreating(baseUrl, dataSet, nftCollection._id, projectName, userId);

            return res.send({
                Error: false,
                message: "nft generated"
            })
        })
        worker.postMessage(JSON.stringify(req.body))
    }
}


exports.getThumbnails = async (req, res) => {
    let { id } = req.body;

    if (!id) {
        return res.send({
            Error: true,
            message: []
        })
    }

    try {
        const thumbnails = await thumbnailModel.find({
            userId: id
        })

        return res.send({
            Error: true,
            message: thumbnails
        })
    } catch (error) {
        return res.send({
            Error: true,
            message: `Internal server error: ${error.message}`
        })
    }
}


exports.getCollection = async (req, res) => {
    let { collection_id } = req.body;
    console.log(collection_id)
    if (!collection_id) {
        return res.send({
            Error: true,
            message: null
        })
    }

    try {

        const singleCollection = await nftModel.findById({
            _id: collection_id
        })

        if (!singleCollection) {
            return res.send({
                Error: true,
                message: null
            })
        }

        return res.send({
            Error: false,
            message: singleCollection
        })


    } catch (error) {

        return res.send({
            Error: true,
            message: `Internal server error: ${error.message}`
        })

    }
}