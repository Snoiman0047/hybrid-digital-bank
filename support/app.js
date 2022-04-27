'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const uploadAudio = require('./aws')

var app = express();

app.use(bodyParser.json());

// Set response headers.
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});



// POST: get bot response for user request.
app.post('/api/message', async function (req, res) {
    let botJsonRes = {
        'output': { 'text': getBotResponse(req.body.input.text)}
    }
    return res.json(botJsonRes);
});

// Analyze the user request and return the bot response.
async function getBotResponse(userRequest) {
    
    // Persisted to S3 object store prior to userRequest analysis.
    uploadS3(userRequest, 'User')

    // Analys userRequest and return bot response.
    let botResp = analysUserRequest(userRequest)

    // Persisted to S3 object store prior return bot response.
    uploadS3(botResp, 'Bot')

    return botResp
}

// Analys user request and return bot response.
function analysUserRequest(data){
  const { prompts, replies, alternative, defult} = require('./constants.js')
  let product;
  
  // Regex remove non word/space chars
  // Trim trailing whitespce
  // Remove digits - not sure if this is best
  // But solves problem of entering something like 'hi1'

  let text = data.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  text = text
    .replace(/ a /g, " ")   // 'tell me a story' -> 'tell me story'
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .replace(/r u/g, "are you");

    if (compare(prompts, replies, text)) { 
      // Search for exact match in `prompts`
      product = compare(prompts, replies, text);
    } else if (text.match(/thank/gi)) {
      product = "You're welcome!"
    } else if (text.match(/(help)/gi)) {
      // If no match, check if message contains `help`
      product = defult[0];
    } else if (text.match(/(account|account|credit card|pay|bill|transaction|transact|amount|money|balance)/gi)) {
      // If no match, check if message contains `account`
      product = defult[1];
    } else {
      // If all else fails: random alternative
      product = alternative[Math.floor(Math.random() * alternative.length)];
    }
  
  return product;
} 

// Returns an appropriate bot response.
function compare(promptsArray, repliesArray, string) {
    let reply;
    let replyFound = false;
    for (let x = 0; x < promptsArray.length; x++) {
      for (let y = 0; y < promptsArray[x].length; y++) {
        if (promptsArray[x][y] === string) {
          let replies = repliesArray[x];
          reply = replies[Math.floor(Math.random() * replies.length)];
          replyFound = true;
          // Stop inner loop when input value matches prompts
          break;
        }
      }
      if (replyFound) {
        // Stop outer loop when reply is found instead of interating through the entire array
        break;
      }
    }
    return reply;
}

// Upload massage txt file to S3 object store.
async function uploadS3(data, sender){
  const link = await uploadAudio.uploadText(sender + '-' + Date.now() + '.txt', process.env.AWS_BUCKET_NAME, data)
  return link;
}


module.exports = app;

