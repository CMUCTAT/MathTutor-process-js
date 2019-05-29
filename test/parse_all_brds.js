
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
                    files.map(function(f) {
                        return /\.brd$/.test(f);
                    });
                    

                    let file = full_brd_path + "/" + files[0]; // take the last .brd file
                    Log.info("Extracting Elements from " + file);
                    parse.extractElements(file, extractCallbackFunction(unit));
                    
                });
                
            }
        });
    });
});

function extractCallbackFunction(unit) {
    return function extractCallback(err, elements) {

        console.log("unit: " + unit);

        elements.forEach(e => {
            console.log(unit + " -- " + e);
        });
    }

}
