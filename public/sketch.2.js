// task
// Reetesh Kumar
// http://reet.herokuapp.com
// https://github.com/krreet/node_concordance

function setup() {
  noCanvas();
  noLoop();
  loadJSON('/tfidf', gotData);
  button = createButton('Click here to submit your own stop words and then reload the page');
  button.position(1100, 200);
  button.mousePressed(greet);




  input = createInput();
  input.position(20, 65);

  button2 = createButton('submit and reload page');
  button2.position(input.x + input.width, 65);
  button2.mousePressed(sendRowNum);

  greeting = createElement('h2', 'Enter Row Number for tfidf');
  greeting.position(20, 5);

  textAlign(CENTER);
  textSize(50);
}



function greet() {
  var stopWords = document.getElementById('stopWords').value;
  //console.log(stopWords);
  var url = '/allstopWords';
  var postData = { stopWords: stopWords };
  httpPost(url, 'json', postData, function (result) {
    // removeClass('count');
    //gotData(result);
    

  });
  location.reload();
}

function sendRowNum() {
  var rowNum = input.value();
  console.log(rowNum);
  var url = '/tfidf?rowNum=' + rowNum;

  httpGet(url, 'jsonp', false, function (response) {
    // when the HTTP request completes, populate the variable that holds the
    // earthquake data used in the visualization.

  });
  location.reload();
}



function gotData(data) {
  var words = data.keys;

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var count = data.dict[word].tfidf * 100;

    divMaker(word, count, i);
  }
}

function divMaker(word, count, index) {
  setTimeout(makeDiv, index * 10);
  function makeDiv() {
    var span = createSpan(word + ": " + count + "%");
    span.class('count');
    span.parent('results');
  }
}
