const mongoose = require("mongoose");


const Scheema = mongoose.Schema;

const thumbnailScheema = new Scheema(
    {
        collectionName: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        collectionRef: {
            type: String
        },
        userId: {
            type: String
        }
    },
    { timestamps: true }
);



exports.thumbnailModel = mongoose.model("thumbnails", thumbnailScheema);
