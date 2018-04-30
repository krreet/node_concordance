// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

function setup() {
  noCanvas();
  noLoop();
  loadJSON('/all', gotData);
  button = createButton('Click here to submit your own stop words and then reload the page');
button.position(1100, 200);
button.mousePressed(greet);
}



function greet() {
  var stopWords = document.getElementById('stopWords').value;
  console.log(stopWords);
  var url = '/allstopWords';
var postData = { stopWords: stopWords };
httpPost(url, 'json', postData, function(result) {
 // removeClass('count');
  //gotData(result);
  
});
 
}



function gotData(data) {
  var words = data.keys;

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var count = data.dict[word];
    divMaker(word, count, i);
  }
}

function divMaker(word, count, index) {
  setTimeout(makeDiv, index*10);
  function makeDiv() {
    var span = createSpan(word + ": " + count + " ");
    span.class('count');
    span.parent('results');
  }
}
