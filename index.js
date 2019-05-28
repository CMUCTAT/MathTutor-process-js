/// This script parses a BRD file (aka XML) and extracts the 
/// information needed to piece together the starting state
/// of a Flash/HTML interface.


const fs = require('fs'),
      xml2js = require('xml2js');

const args = require('optimist').argv;
const winston = require('winston')
const Log = winston.createLogger({
    level: 'info',
    format: winston.format.simple(), // NEXT add comments
    transports: [
        new winston.transports.Console()
    ]
});
const xml_parser = new xml2js.Parser();

const csv = require('csv-parser');

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
    fs.readFile(brd_file, function(err, data) {
        xml_parser.parseString(data, function (err, result) {
            let elements = extractHtmlElements(result);

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

                            const MAX_LENGTH = 30;
                            let short_input = row[problem_name].length > 30 ? row[problem_name].substring(0, 30) + "..." : row[problem_name];
                            Log.warn(short_input + " --> " + variable);
                        }
                    });
                }
            });
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


/**
 * Extract all HTML elements, along with their updates.
 * BRD/XML --> {
 *   name: the name/id of the element,
 *   type: the CTAT type,
 *   startState: the startState (e.g. for text... what does it contain?)
 * }
 */
function extractHtmlElements(xmlData) {

    const messages = xmlData.stateGraph.startNodeMessages[0].message;


    let elements = {};

    messages.forEach(function(message) {

        let verb = message.verb[0];

        switch(verb) {

        case "NotePropertySet":

            Log.verbose('VerbSet: ' + verb);

            let MessageType = message.properties[0].MessageType[0];

            switch (MessageType) {
            case "StartProblem":
                Log.verbose("StartProblem");
                break;

            case "InterfaceAction":
                Log.verbose("InterfaceAction");
                let SAI = {
                    s: message.properties[0].Selection[0].value[0],
                    a: message.properties[0].Action[0].value[0],
                    i: message.properties[0].Input[0].value[0]
                };

                if (elements[SAI.s]) {
                    elements[SAI.s].input = SAI.i,
                    elements[SAI.s].action = SAI.a
                } else {
                    elements[SAI.s] = {
                        id: SAI.s,
                        input: SAI.i,
                        action: SAI.a
                    }
                }
                break;
            }
            
            break;

        case "SendNoteProperty":

            try {
                Log.verbose('VerbSend: ' + verb);
                const Type = message.properties[0].WidgetType[0];
                const Name = message.properties[0].DorminName[0];
                Log.verbose('Type: ' + Type + ', Name: ' + Name);

                if (elements[Name]) {
                    elements[Name].type = Type;
                } else {
                    elements[Name] = {
                        id: Name,
                        type: Type
                    }
                }
            } catch (e) {
                //console.log(e);
            }
            break;
        }
    });


    return elements;

}
