const express = require('express');
const router = express.Router();
const app = express();

// const structjson = require('./structjson.js');
const dialogflow = require('@google-cloud/dialogflow');
// const uuid = require('uuid');
const Axios = require('axios');

const projectId = 'demoagent-psyi';
const sessionId = '123456';

const sessionClient = new dialogflow.SessionsClient();

const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

app.get('/test', async (req, res) => {
    res.send("Hello World")
})


router.post('/textQuery', async (req, res) => {
    //We need to send some information that comes from the client to Dialogflow API 
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: req.body.text,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.send(result)
})

    router.post('/eventQuery', async (req, res) => {
        //We need to send some information that comes from the client to Dialogflow API 
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    // The query to send to the dialogflow agent
                    name: req.body.event,
                    // The language used by the client (en-US)
                    languageCode: languageCode,
                },
            },
        };
    
        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
    
        res.send(result)
    })

    const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});


module.exports = router;

