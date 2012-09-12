/*
 * Grunt Task File
 * ---------------
 *
 *  Task: setServiceLocation
 *  Description: Programmatically inject the service location into built files
 *  Dependencies: none
 *
 */

var fs = require("fs");

module.exports = function(grunt) {

  grunt.registerMultiTask("setServiceLocation", "", function() {

    var replacementCount = 0;
    var contents;

    try {
      contents = fs.readFileSync(this.file.src).toString();
    } catch(err) {
      grunt.log.error(err);
      return false;
    }

    contents = contents.replace(/{{\s*(NODE_HOST|NODE_PORT)\s*}}/g,
        function(string, varName) {
            replacementCount++;
            return grunt.config("meta." + varName);
        }
    );

    if (replacementCount === 0) {
      grunt.log.error("Replacement string not found.");
      return false;
    }

    grunt.log.writeln("Replaced " + replacementCount +
      " occurences of service location.");

    try {
      fs.writeFileSync(this.file.dest, contents);
    } catch(err) {
      grunt.log.error(err);
      return false;
    }
  });

};
