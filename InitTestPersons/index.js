const axios = require('axios');
const subscriptionKey = 'fill-this';

async function createPerson(context, personGroupId, personData)
{
    let returnData = {
        status: null,
        data: null
    };

    // Create person group person
    // https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons

    try {
        const personCreateResponse = await axios.post(
            `https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons/`,
            personData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': subscriptionKey
                }
            });

        returnData.status = personCreateResponse.status;
        returnData.data = personCreateResponse.data;

    }
    catch(error)
    {
        returnData.status = error.response.status;
        returnData.data = error.response.data;
    }

    return returnData;

}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Example image
    // https://faceregonizerstorage.file.core.windows.net/facetestapp07112018-content-2a29/faceTestImages/Family1-Dad1.jpg


    // https://westus.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes]</Subscription>&subscription-key=<Subscription key>
    // https://northeurope.api.cognitive.microsoft.com/face/v1.0

    // Create person group
    // https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}


    const personGroupId = '07112018testgroup';


    try {
        const personGroupResponse = await axios.put(
            'https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/' + personGroupId,
            {
                name: "Test group 1"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': subscriptionKey }
            });

    } catch (error) {
        context.log('PersonGroupResponse error');
        context.log('Status ' + error.response.status);
        context.log('Data ' + error.response.data);
        if(error.response.status)
        context.res = {
            status: error.response.status,
            body: error.response.data
        };
    }


    const personCreateResponse = await createPerson(context, personGroupId, { name: 'Max Tester'});
    if(personCreateResponse.status == 200)
    {
        context.log("Person created successfully");
        context.log("Person id " + personCreateResponse.data.personId);
    }

    context.res = {
        status: personCreateResponse.status,
        body: personCreateResponse.data
    };

    // Add face to person group person
    // https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces[?userData][&targetFace]

    // Train person group
    // https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/train


    // Detect face in Image
    // https://northeurope.api.cognitive.microsoft.com/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes]

    // User detected faceId to identify person in Image
    // https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239

};