var lda = require('lda');




// Example document.

async  function ldaGenerator(text, topics , terms ){

//     console.log('lda gen called');

// //var text = 'Cats are small. Dogs are big. Cats like to chase mice. Dogs like to eat bones.';

// // Extract sentences.
// var documents = text.match( /[^\.!\?]+[\.!\?]+/g );

// // Run LDA to get terms for 2 topics (5 terms each).
//  resolvelda(documents, topics , terms).then(function(value) {
//     console.log(value);
//     // expected output: Array [1, 2, 3]
//   });

// return result;
}


function resolvelda(text, topics , terms) {

    // Extract sentences.
var documents = text.match( /[^\.!\?]+[\.!\?]+/g );
    return new Promise(resolve => {
     
        resolve(getfdata(documents, topics , terms));

        
     
    });
  };


 var getfdata = (documents, topics , terms) => {
            
    var fs = require('fs');
var json = JSON.stringify(lda(documents, topics , terms));
fs.writeFile('lda.json', json, 'utf8', () => console.log('writing complete'));

return true;
 
}
module.exports = resolvelda;