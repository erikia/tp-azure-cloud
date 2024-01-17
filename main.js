import axios from 'axios';

const axios = require('axios');

AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName=tpazurecomptestockage;AccountKey=hI1e61iUYbjJFtV3m3BHjV4kdRVUkcLgK/idpcKwKX7ymzK4rj5J20UD1TpZh9juTk0bqWfeE+xs+AStl9FTSw==;BlobEndpoint=https://tpazurecomptestockage.blob.core.windows.net/;FileEndpoint=https://tpazurecomptestockage.file.core.windows.net/;QueueEndpoint=https://tpazurecomptestockage.queue.core.windows.net/;TableEndpoint=https://tpazurecomptestockage.table.core.windows.net/"

module.exports = async function (context, myBlob) {
    const cognitiveServiceApiKey = process.env.COGNITIVE_SERVICE_KEY;
    const cognitiveServiceEndpoint = process.env.COGNITIVE_SERVICE_ENDPOINT;
    const imageUrl = context.bindingData.uri;

    const headers = {
        'Ocp-Apim-Subscription-Key': cognitiveServiceApiKey,
        'Content-Type': 'application/json'
    };

    const body = {
        url: imageUrl
    };

    try {
        let response = await axios.post(`${cognitiveServiceEndpoint}/vision/v3.2/analyze?visualFeatures=Description`, body, { headers: headers });
        let description = response.data.description.captions[0].text;

        context.bindings.outputBlob = description;
        context.done();
    } catch (error) {
        context.log.error('Cognitive Service call error: ', error);
        context.done(error);
    }
};