
// Require the node-sentiment module
var sentiment = require('node-sentiment');
 
// Use the module to get sentiment from texts.
 
// Vote: 'negative'

function getsentiment ( data){



for (var i = 0; i  < data.xlData.length; i++) {
    data.xlData[i]['Sentiment']  = sentiment( data.xlData[i]['Consumer complaint narrative'],'en').score;
}


return data;

}

module.exports = getsentiment;