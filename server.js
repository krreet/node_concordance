
// task
// Reetesh Kumar
// http://reet.herokuapp.com
// https://github.com/krreet/node_concordance

// Using express: http://expressjs.com/

var tfidf;
var readyForLda = false;
let ldaOutput = '';
var filestfidf = [];
var rowNum = 0;
var express = require('express');

var lda = require('./lda');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

// This is for hosting files
// Anything in the public directory will be served
// This is just like python -m SimpleHTTPServer
// We could also add routes, but aren't doing so here
app.use(express.static('public'));
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// The 'fs' (file system) module allows us to read and write files
// http://nodejs.org/api/fs.html
// This is how we'll load data
var fs = require('fs');

// And we'll look at all files in the jane austen directory
var files = fs.readdirSync('excel');

// Pulling our concordance object from a separate "module" - concordance.js
var concordance = require('./concordance');
var concordance_tfidf = require('./concordance_tfidf');
var sentiment = require('./sentiment');

var XLSX = require('xlsx')
var workbook = XLSX.readFile('excel/CC Product.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
data = {};

data.xlData = xlData;
data.sheetname = sheet_name_list[0];

// var textdata =
// data.xlData.map(e => e['Consumer complaint narrative']).join("\n");

//console.log(textdata);

var fileCount = 0;
var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves","xxxx","xx"];

// An object that acts as dictionary of words and counts


var wordcounts;
// data is an array of arrays
//processFile(textdata);
var datalength = data.xlData.length;
//console.log(xlData);
// Read the file as utf8 and process the data
// Notice how this is in a loop to parse all files

function start(type) {


  if (type == 'normal') {
    wordcounts = new concordance.Concordance(stopWords);
    for (var i = 0; i < data.xlData.length; i++) {
      // Note the callback is processFile

      processFile(data.xlData[i]['Consumer complaint narrative'], type);
    }
  }
  else {


    for (var i = 0; i < data.xlData.length; i++) {
      // Note the callback is processFile
      //console.log(data.xlData[i]['Consumer complaint narrative']);
      //var idata ={ data : data.xlData[i]['Consumer complaint narrative'] };
      //files.data = [];
      filestfidf.push(data.xlData[i]['Consumer complaint narrative']);


    }
    //console.log(files);
    processFile(data.xlData[rowNum]['Consumer complaint narrative'], type);

    // tfidf_allwords[i] = data.xlData[i]['Consumer complaint narrative'];
    // d
    //fs.readFile('austen/'+files[i], 'utf8', processFile);
  }
}


start('normal');
// How many files have been read?
// This helps us know when we are done
//var fileCount = 0;

// An object that acts as dictionary of words and counts
//var wordcounts = new concordance.Concordance();
//console.log(wordcounts);
// This callback is triggered for every file
function processFile(datathis, type) {
  // If there's a problem
  // if (err) {
  //   console.log('ooops, there was an error reading this file');
  //   throw err;
  // }
  if (type == 'tfidf') {
    tfidf = new concordance_tfidf.TFIDF(stopWords);

    // Process this data into the tfidf object
    // console.log(datathis);
    tfidf.termFreq(datathis);
    // Now we need to read all the rest of the files
    // for document occurences

    for (var i = 0; i < filestfidf.length; i++) {

      tfidf.docFreq(filestfidf[i]);
    }
    tfidf.finish(filestfidf.length);
    tfidf.sortByScore();
    readyForLda = true;

  } else if (type == 'normal') {
    // Send the data into the concordance
    wordcounts.process(datathis);

    // This file finished
    fileCount++;

    // Is this the last file?
    if (fileCount >= datalength) {
      wordcounts.sortByCount();


    }
  }
}

function getLda() {

  if (readyForLda) {


    if (ldaOutput) {

      return ldaOutput;
    } else {

      //ldaOutput = lda(filestfidf[1], 2,4);
      getldaasync();
      async function getldaasync() {

        console.log('calling');

        var value = await lda(filestfidf.slice(0, 100).join('\n'), 2, 4);
        console.log(value);


      }

      console.log('called');
      //lda(filestfidf.slice(0,1000).join('\n'), 2,4).then(function(value) {
      //console.log(value);
      //     // expected output: Array [1, 2, 3]
      //   });





    }

  } else {

    return "lda not ready";
  }

}

// Route for sending all the concordance data
app.get('/all', showAll);

// Route for sending all the concordance data
app.get('/tfidf', showTFIDF);

// Route for sending all the concordance data
app.get('/lda', showLDA);


// Route for sending all the concordance data
app.get('/sentiment', showSNT);
app.post('/allstopWords', function (req, res) {
  //  console.log(req.body);
  stopWords = req.body.stopWords.split(',');
  //console.log(stopWords);
  start('normal');

  // showAll(req, res);
})


app.get('/gettext/:rowNum', showText);
// Callback
function showAll(req, res) {
  // Send the entire concordance
  // express automatically renders objects as JSON
  res.send(wordcounts);
}

function showText(req, res) {
  // Send the entire concordance
  // express automatically renders objects as JSON
  var rowNum = req.params.rowNum
  res.send(data.xlData[rowNum]['Consumer complaint narrative']);
}

function showSNT(req, res) {
  // Send the entire concordance
  // express automatically renders objects as JSON
  //console.log('getting sentiment');
  res.send(sentiment(data));
}
function showLDA(req, res) {
  // Send the entire concordance
  // express automatically renders objects as JSON
  //console.log(readyForLda);
  res.send(getLda());
}


function showTFIDF(req, res) {
  // Send the entire concordance
  // express automatically renders objects as JSON
  if (req.query.rowNum) {
    rowNum = req.query.rowNum;
  }
  start('tfidf');
  res.send(tfidf);
}
