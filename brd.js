
const Log = require('./util/Log');

const fs = require('fs'),
      xml2js = require('xml2js');
const xml_parser = new xml2js.Parser();


/**
 * Extract all HTML elements, along with their updates.
 * BRD/XML --> {
 *   name: the name/id of the element,
 *   type: the CTAT type,
 *   startState: the startState (e.g. for text... what does it contain?)
 * }
 */
function extractElements(filename, callback) {
    Log.debug('extracting elements from ' + filename);
    fs.readFile(filename, function(err, data) {
        xml_parser.parseString(data, function (err, xmlData) {

            let elements = processNodeMessages(xmlData.stateGraph.startNodeMessages[0].message);

            processEdges(xmlData.stateGraph.edge, elements);

            let all_html = [];

            Object.keys(elements).forEach(function(key) {

                // if (LOG_ELEMENTS) console.log(elements[key]);

                
                let html = getCtatHtml(elements[key], true);
                if (html) all_html.push(html);

            });
            callback(null, all_html);
        });
    });
}


/**
 * Convert element into its HTML form.
 * Setting 'includeInput' to true will insert starting input.
 */ 
function getCtatHtml(element, includeInput) {
    element.hClass = getCtatClass(element);

    if (element.hClass)
        return `<div id="${element.id}" class="${element.hClass}">${includeInput && element.input ? element.input : ''}</div>`;
    else 
        return null;
}

/**
 * takes in an element from XML and returns the CTAT Class...
*/
function getCtatClass(element) {
    if (element.type) {
        switch (element.type) {
            
        case 'commTextInput':
            return "CTATTextInput";

        case 'commTextArea':
            return "CTATTextField";
            
        case 'CommComboBox':
            return "CTATComboBox";

        case 'CommImage':
            return "UNKNOWN_IMAGE"; // note that this is different than a CTATImageButton
        }
        
    }

    if (element.action) {

        switch(element.action) {
        case 'UpdateTextArea':
            return "CTATTextField";

        case 'UpdateTextField':
            return "CTATTextInput";
        }
    }

    return 'UNKNOWN'; 
}


/** 
 * process the <edge></edge> XML.
 */
function processEdges(edges, elements) {
    edges.forEach(function(edge) {
        //console.log(edge);
        let message = edge.actionLabel[0].message[0];
        console.log(message);
        
        processMessage(message, elements);
    });
}


/**
   <startNodeMessages>
        <message>
            <verb>NotePropertySet</verb>
            <properties>
                <MessageType>StartProblem</MessageType>
                <ProblemName>Problem1</ProblemName>
            </properties>
        </message>
        <message>
            <verb>NotePropertySet</verb>
            <properties>
                <MessageType>InterfaceIdentification</MessageType>
                <Guid>9F81E9F944FFB82B89B16FCBA6DA70D4F2B7C8A</Guid>
            </properties>
        </message>
       ...
   </startNodeMessages>
 */
function processNodeMessages(messages) {
    let elements = {};

    messages.forEach(function(message) {
        processMessage(message, elements);
    });

    return elements;

}

/**
   <message>
      <verb>NotePropertySet</verb>
      <properties>
          <MessageType>InterfaceIdentification</MessageType>
          <Guid>9F81E9F944FFB82B89B16FCBA6DA70D4F2B7C8A</Guid>
      </properties>
   </message>
 */
function processMessage(message, elements) {

    let verb = message.verb[0];

    switch(verb) {

    case "NotePropertySet":
        processNotePropertySet(message, verb, elements);
        
        break;

    case "SendNoteProperty":
        processSendNoteProperty(message, verb, elements);
        break;
    }
}

/**
   <message>
      <verb>NotePropertySet</verb>
      <properties>
          <MessageType>InterfaceIdentification</MessageType>
          <Guid>9F81E9F944FFB82B89B16FCBA6DA70D4F2B7C8A</Guid>
      </properties>
   </message>
 */
function processNotePropertySet(message, verb, elements) {
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

        // NEXT handle multiple AI combos, e.g. UpdateTextArea and SetVisible
        if (elements[SAI.s]) {
            
            elements[SAI.s].input = SAI.i;
            elements[SAI.s].action = SAI.a;

/*            if (elements[SAI.s].AI) {
                elements[SAI.s].AI.push({input: SAI.i, action: SAI.a});
            } else {
                
                elements[SAI.s].AI = [{
                    input: SAI.i,
                    action: SAI.a
                }];
            }*/
            
        } else {
            elements[SAI.s] = {
                id: SAI.s,
                action: SAI.a
                /*AI: [
                    {
                        input: SAI.i,
                        action: SAI.a
                    }
                ]*/
            }
        }
        break;
    }

}

/**
   <message>
            <verb>SendNoteProperty</verb>
            <properties>
                <MessageType>InterfaceDescription</MessageType>
                <WidgetType>commTextArea</WidgetType>
                <DorminName>na2</DorminName>
                <UpdateEachCycle>false</UpdateEachCycle>
                <jessDeftemplates>
                    <value>(deftemplate textArea (slot name) (slot value))</value>
                </jessDeftemplates>
                <jessInstances>
                    <value>(assert ( textArea (name na2)))</value>
                </jessInstances>
            </properties>
        </message>
*/
function processSendNoteProperty(message, verb, elements) {
    try {
        Log.verbose('VerbSend: ' + verb);
        const p = message.properties[0];
        const Type = p.WidgetType[0];

        const NameParent = p.DorminName ? p.DorminName : p.CommName; // BRDs in 6thGrade have CommName, 7thGrade have DorminName
        const Name = NameParent[0];
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
        Log.error(e);
    }

}


module.exports = {
    extractElements: extractElements
}
