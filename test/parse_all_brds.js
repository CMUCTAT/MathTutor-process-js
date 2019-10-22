
/**
 * This iterates through each possible unit, takes the first BRD file, and converts it into an array of all valid CTAT HTML Elements.
 */
const Log = require('../util/Log');
const parse = require('../brd');
const fs = require('fs');

const ROOT_DIR = '/Users/kevindeland/git/svn/Mathtutor/';
const GRADES = ['6thGrade', '7thGrade', '8thGrade'];

const BRD_DIR = 'FinalBRDs';
const EXT = '.brd';

const simpleReplace = require('simple-replace');

fs.readFile('../template.html', 'utf8', function(err, template) {
    if (err) {
        throw err;
    }

//    let newFileContents = simpleReplace(template, replaceHash);

    GRADES.forEach(function(G_DIR) {

        fs.readdir(ROOT_DIR + G_DIR, function(err, files) {
            
            files.forEach((unit) => {
                if(/^\d\.\d+$/.test(unit)){ // only test folders that match format: d.dd where d are digits
                    let full_brd_path = ROOT_DIR + G_DIR + '/' + unit + '/' + BRD_DIR;
                    
                    fs.readdir(full_brd_path, function(err, files) {
                        if (!files || files.length === 0) {
                            Log.error("No files found for " + full_brd_path);
                            return;
                        }

                        // only selection .brd files
                        files.map((f) => /\.brd$/.test(f));

                        // only take the first .brd file
                        let file = full_brd_path + "/" + files[0];
                        Log.info("Extracting Elements from " + file);
                        parse.extractElements(file, extractCallbackFunction(unit, template));
                        
                    });
                    
                }
            });
        });
    });

    
});


function extractCallbackFunction(unit, template) {
    return function extractCallback(err, elements) {

        // TODO NEXT: ability to write out to files
        // TODO NEXT: better modularity
        let replaceHash = {
            unit: unit,
            content: elements.join('\n\t\t'),
            image: `./images/mathtutor_${unit}_full.png`
        }

        // sample image
        

        let newFileContents = simpleReplace(template, replaceHash);

        let filename = `interface_${unit}.html`;
        let filepath = `../output/${filename}`;
        fs.writeFile(filepath, newFileContents, (err) => {
            if (err) 
                throw err;//Log.error(`Error writing to file ${filepath}`);
            else
                Log.info(`Success writing to file ${filepath}`);
                              
        });
        

        /*elements.forEach(e => {
            console.log(unit + " -- " + e);
        });*/
        
    }

}
