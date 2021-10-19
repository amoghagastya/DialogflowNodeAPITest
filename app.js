const express = require('express');
const router = express.Router();

const projectId = 'demoagent-psyi';
// sessionId: String representing a random number or hashed user identifier
const sessionId = '111111111';
// queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
const queries = [
  'Hi there',
  'events'  // Rooms are defined on the Dialogflow agent, default options are A, B, or C
]
// languageCode: Indicates the language Dialogflow agent should use to detect intents
const languageCode = 'en';
require('dotenv').config()

// Imports the Dialogflow library
const dialogflow = require('@google-cloud/dialogflow');
const Axios = require('axios');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

// const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: query,
//         languageCode: languageCode,
//       },
//     },
//   };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );


async function executeQueries(projectId, sessionId, queries, languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log(`Detected intent: ${intentResponse.queryResult.intent.displayName}`);

      console.log(
        `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      );
      // Use the context from this response for next queries
      context = intentResponse.queryResult.outputContexts;
    } catch (error) {
      console.log(error);
    }
  }
}


  async function eventQueries(projectId, sessionId, event, languageCode) {
      // Keeping the context across queries let's us simulate an ongoing conversation with the bot
      let context;
      let intentResponse;
      
        try {
          console.log(`Sending Query:}`);
          intentResponse = await sessionClient.detectEventIntent(event);
          console.log(intentResponse)
          console.log(`Detected intent: ${intentResponse.queryResult.intent.displayName}`);
    
          console.log(
            `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
          );
          // Use the context from this response for next queries
          context = intentResponse.queryResult.outputContexts;
        } catch (error) {
          console.log(error);
        }
  }

  async function detectEventIntent(
      projectId,
      sessionId,
      eventName,
      languageCode
    ) {
      const {struct} = require('pb-util');
    
      // Imports the Dialogflow library
      const dialogflow = require('@google-cloud/dialogflow');
    
      // Instantiates a session client
      const sessionClient = new dialogflow.SessionsClient();
    
      // The path to identify the agent that owns the created intent.
      const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
      );
    
      // The text query request.
      const request = {
        session: sessionPath,
        queryInput: {
          event: {
            name: eventName,
          //   parameters: struct.encode({foo: 'bar'}),
            languageCode: languageCode,
          },
        },
      };
    
      const [response] = await sessionClient.detectIntent(request);
      console.log('Detected intent');
      const result = response.queryResult;
      // Instantiates a context client
      const contextClient = new dialogflow.ContextsClient();
    
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log('  No intent matched.');
      }
      const parameters = JSON.stringify(struct.decode(result.parameters));
      console.log(`  Parameters: ${parameters}`);
      if (result.outputContexts && result.outputContexts.length) {
        console.log('  Output contexts:');
        result.outputContexts.forEach(context => {
          const contextId =
            contextClient.matchContextFromProjectAgentSessionContextName(
              context.name
            );
          const contextParameters = JSON.stringify(
            struct.decode(context.parameters)
          );
          console.log(`    ${contextId}`);
          console.log(`      lifespan: ${context.lifespanCount}`);
          console.log(`      parameters: ${contextParameters}`);
        });
      }
    }

  const event_name = 'billcheck'
  // executeQueries(projectId, sessionId, queries, languageCode);
  detectEventIntent(projectId, sessionId, event_name, languageCode);
  