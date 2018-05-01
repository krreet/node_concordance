

function setup() {



  noLoop();
  noCanvas();

  loadJSON('/tfidf', gotData);



}



function gotData(data) {
  var words = data.keys;
  var list = [];
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var count = data.dict[word].tfidf*100;
   
    var listelem = {};
		listelem.text =word;
		listelem.size = count;
	//	listelem.push(element, counts[element]);
		
    list.push(listelem);
  }
    list =	list.slice(0, 1000);
    var options = {
      gridSize: 18,
      weightFactor: 3,
      fontFamily: 'Finger Paint, cursive, sans-serif',
      color: '#f0f0c0',
      hover: window.drawBox,
      click: function(item) {
        alert(item[0] + ': ' + item[1]);
      },
      backgroundColor: '#001f00',
      list: list
      };
    // console.log(list);
    //WordCloud(document.getElementById('defaultCanvas0'), options );
    d3.wordcloud()
    .size([windowWidth, windowHeight])
    .selector('#wordcloud')
    .words(list).onwordclick(function(d, i) {
      window.location = "https://www.google.co.uk/search?q=" + d.text;
      }).spiral('archimedean')
    .start();
  
  }

	

