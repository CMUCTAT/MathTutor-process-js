
const parse = require('../brd');

const args = require('optimist').argv;

let filename = 'sample_brd_705.brd';
if (args.b) {
    filename = args.b;
}

parse.extractElements(filename, function(err, elements) {
    console.log(elements);
});
