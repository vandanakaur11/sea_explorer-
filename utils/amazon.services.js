const AWS = require('aws-sdk');
const { config } = require('../config/index');
const { nftModel, thumbnailModel } = require('../models/index')

const s3 = new AWS.S3({
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY
});

// const params = {
//     Bucket: config.S3_BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: "eu-west-1"
//     }
// }

// s3.createBucket(params, (err, data) => {
//     if (err.code !== 'BucketAlreadyOwnedByYou') console.log('bucket created successfully', data)
// })



exports.uploadImage = (fileName, fileContent, id, editcount, projectName, userId) => {

    const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent
    }
    if (editcount === 1) {

        s3.upload(params, async (err, data) => {
            let { Location } = data;
            await nftModel.findByIdAndUpdate(id,
                { $push: { images: { $each: [Location] } } }
            );
            const thumbnale = await thumbnailModel.create({
                collectionName: projectName,
                thumbnail: Location,
                collectionRef: id,
                userId: userId
            });
            thumbnale.save();
        })

    } else {
        s3.upload(params, async (err, data) => {
            let { Location } = data;
            await nftModel.findByIdAndUpdate(id,
                { $push: { images: { $each: [Location] } } }
            )

        })
    }


}