/// This script parses a BRD file (aka XML) and extracts the 
/// information needed to piece together the starting state
/// of a Flash/HTML interface.

const args = require('optimist').argv;

const fs = require('fs');
const csv = require('csv-parser');

const parseBRD = require('./brd').extractElements;
const Log = require('./util/Log');

if (!args.g || !args.t || !args.p) {//(!args.i && args.i !== 0)) {
    Log.error('Run \'node index.js\' with the following args:' +
              '\n\t-g: behavior graph file (.brd filepath)' +
              '\n\t-t: text file with table of values (.txt filepath)' +
              '\n\t-p: problem name (e.g. Problem1)');
    process.exit();
}

let brd_file = args.g;
let txt_file = args.t;
let problem_name = args.p;

// NEXT: compose these two functions...
// NEXT: follow the below steps to map a Problem State to an HTML element ID

// elements.forEach((e) => { e.input.find("%(x)%"); row['Problem Name']]--> e.selection);
// find the %(x)% in row["Problem Name"].
// whichever row[problem_name] goes with it, map this to e.selection!


function doSomething(replace_vars) {

    parseBRD(brd_file, function(err, elements) {

        Object.keys(elements).forEach((key) => {
            //console.log(key);
            let value = elements[key];
            console.log("S: "+ value.id + "; I: " + value.input);

            let begin = value.input.indexOf("%(")
            let end = value.input.indexOf(")%");
            if ( begin >= 0) {
                Log.info("FOUND " + value.input);
                let variable = value.input.substring(begin, end+2);
                console.log("variable == " + variable);
                if(value.id == 'textone') console.log('b: ' + begin + '; e: ' + end);

                replace_vars.forEach((row) => {
                    if (row['Problem Name'] && row["Problem Name"] == variable) {
                        console.log("FOUND MATCH with " + variable);

                        const MAX_LENGTH = 40;
                        let short_input = row[problem_name].length > MAX_LENGTH ? row[problem_name].substring(0, MAX_LENGTH) + "..." : row[problem_name];
                        Log.warn(short_input + " --> " + variable + " --> " + value.id);
                    }
                });
            }
        });
    });
}

const results = [];
fs.createReadStream(txt_file)
    .pipe(csv({
        separator: '\t',
        mapHeaders: ({header, index}) => header
    }))
    .on('data', (data) => results.push(data))
    .on('end', () => {

        //console.log(results);

        results.forEach((row) => {
            //console.log(Object.keys(row));
            console.log(row['Problem Name'] + ' --> ' + row[problem_name]);
        });

        doSomething(results);
    });
    // NEXT: parse a table into set of keys mapping to arrays, e.g.
    // %(problemstatement)% -> {"Julie has... ", "A garden has...", "The democrats...", etc}


