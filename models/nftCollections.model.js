const mongoose = require("mongoose");


const Scheema = mongoose.Schema;

const nftCollectionScheema = new Scheema(
    {
        collectionName: {
            type: String,
            required: true,
        },
        discription: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: false
        },
        images: {
            type: Array
        }
    },
    { timestamps: true }
);



exports.nftModel = mongoose.model("nfts", nftCollectionScheema);
