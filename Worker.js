'use strict';
const { parentPort, isMainThread } = require('worker_threads');
const fs = require('fs');
const basePath = process.cwd();


if (!isMainThread) {

    parentPort.on('message', (data) => {

        let parseToJson = JSON.parse(data);
        let { projectName, discription, collectionSize, width, height, userId } = parseToJson;


        if (fs.existsSync(`${basePath}/${userId}layers`)) {
            fs.rmdirSync(`${basePath}/${userId}layers`, { recursive: true });
        }
        fs.mkdirSync(`${basePath}/${userId}layers`);
        let layersArray = [];
        const { Layers } = parseToJson;

        Layers.forEach(layer => {
            layersArray.push({ name: layer.name });
            let layerFolder = `${basePath}/${userId}layers/${layer.name}`;

            fs.mkdirSync(layerFolder);

            layer.images.forEach((ele) => {
                ele._d = ele._d.replace('data:image/png;base64,', '');
                ele._d = ele._d.replace('data:image/jpeg;base64,', '');
                const buffer = Buffer.from(ele._d, 'base64');
                fs.writeFileSync(`${layerFolder}/${ele.imageName}`, buffer);
            });

        });

        parentPort.postMessage({
            baseUrl: `${basePath}/${userId}layers`, dataSet: {
                projectName, discription, collectionSize, width, height, layersArray, userId
            }
        });
        // buildSetup();
        // startCreating()
        // fs.rmdirSync(`${basePath}/layers2`);
        process.exit(1);
    })
}