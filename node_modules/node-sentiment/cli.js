#! /usr/bin/env node
var sentiment = require('./index');

var sQuery = process.argv.slice(2)[0];
if (typeof sQuery !== 'string') {
  sQuery = '';
}
oSentiment = new sentiment(sQuery);

console.log('Result: ' + oSentiment.vote, oSentiment);
