/// This script parses a BRD file (aka XML) and extracts the 
/// information needed to piece together the starting state
/// of a Flash/HTML interface.


const fs = require('fs'),
    xml2js = require('xml2js');

const parser = new xml2js.Parser();

let filename = "/Users/kevindeland/git/svn/Mathtutor/7thGrade/7.16/FinalBRDs/Problem1.brd";

fs.readFile(filename, function(err, data) {
    parser.parseString(data, function (err, result) {
        extractHtmlElements(result);
        console.log('Done');
    });
});

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


    let elements  

    messages.forEach(function(message) {

        let verb = message.verb[0];

        switch(verb) {

        case "NotePropertySet":
            //console.dir(message);
            console.log('VerbSet: ' + verb);

            let MessageType = message.properties[0].MessageType[0];

            switch (MessageType) {
            case "StartProblem":
                console.log("StartProblem");
                break;

            case "InterfaceAction":
                console.log("InterfaceAction");
                let SAI = {
                    s: message.properties[0].Selection[0].value[0],
                    a: message.properties[0].Action[0].value[0],
                    i: message.properties[0].Input[0].value[0]
                };

                console.log(SAI);
                break;
            }
            
            break;

        case "SendNoteProperty":
            //console.log('VerbSend: ' + verb);
            const Type = message.properties[0].WidgetType[0];
            const Name = message.properties[0].DorminName[0];
            console.log('Type: ' + Type + ', Name: ' + Name);
            
            break;
        }
    });

}
