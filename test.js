const express = require('express')
const app = express()
const port = 3000
// const fs = require('fs')

const dialogflow = require('@google-cloud/dialogflow');

const projectId = 'demoagent-psyi';
const sessionId = '123456';

const sessionClient = new dialogflow.SessionsClient();

const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);


app.post('/', (req, res) => {
  res.json(req.body);
//   res.send("Logs")
});



app.post('/textQuery', async (req, res) => {
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

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  });