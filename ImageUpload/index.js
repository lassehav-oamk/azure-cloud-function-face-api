const axios = require('axios');
const sharedCodeDemo = require('../Shared/sharedCodeDemo');
console.log('ImageUpload shared code sum result ' + sharedCodeDemo.sum(5, 10));

const axiosCustom = axios.create({
    baseURL: 'https://northeurope.api.cognitive.microsoft.com/face/v1.0',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env['FaceApiAccessKey']
    }
  });

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const contentLength = parseInt(req.headers['content-length']);

    // Get the multipart boundary marker, see multipart details https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html
    const boundaryMarkerIndex = req.headers['content-type'].indexOf("=");
    const boundary = req.headers['content-type'].substring(boundaryMarkerIndex+1);
    const data = req.body;

    // remove boundary from the end
    let testData = data.slice(0,contentLength - (boundary.length + 2 + 2 + 2 + 2)); // Add 2 for boundary prefix --, add 2 for last boundary postfix --, add 2*2 for linebreaks

    // Calculate the starting location of the image data in the body, the begninning has multipart header data such as seen below in example:
    //  ----------------------------495851880813268952814107
    //  Content-Disposition: form-data; name="image"; filename="upload_test.png"
    //  Content-Type: image/png
    //
    // *Data starts here*
    let lineBreakCounter = 0;
    let dataStartIndex = 0;
    for(let i = 0; i < testData.length; i++)
    {
        if(testData[i] == 13 && testData[i+1] == 10)
        {
            lineBreakCounter++;
            if(lineBreakCounter == 4)
            {
                dataStartIndex = i+2;
                break;
            }
        }
    }

    // remove the multipart header
    const finalImageData = testData.slice(dataStartIndex);
    const returnData = { status: null,
                         data: null };

    // Perform Azure Face API Detect request
    try {
        const response = await axiosCustom.post(`/detect`, finalImageData, { headers: { 'Content-Type': 'application/octet-stream' }});
        returnData.status = response.status;
        returnData.data = response.data;
    }
    catch(error)
    {
        returnData.status = error.response.status;
        returnData.data = error.response.data;
    }

    context.res = {
        body: returnData
    }

};