const fs = require('fs');
const simpleReplace = require('simple-replace');

// Unit ID = 7.14
// HTML Array = [<div>.. </div>, etc]

// Just generate a thing that puts the UnitID in the Titles, and puts a bunch of HTML arrays in the body


let replaceHash = {
    unit: '7.14',
    content: ['<div id="ab1" class="CTATTextInput">Hello</div>','<div id="ab2" class="CTATTextInput">Goodbye</div>'].join('\n\t\t')
}


// Now do this for every single thing... the replaceHash should vary, obviously
// 'template.html' should only be loaded once (async.parallel??, just make everything else depend on it???)
fs.readFile('template.html', 'utf8', function(err, template) {
    if (err) {
        throw err;
    }

    let newFileContents = simpleReplace(template, replaceHash);

    console.log(newFileContents);
    
});
