/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
      banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
        "<%= pkg.homepage ? '* ' + pkg.homepage + '\n' : '' %>" +
        "* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author %>; */"
    },
    lint: {
      files: [
        "grunt.js",
        "frontend/scripts/livemap_connection.js",
        "frontend/scripts/livemap_status.js",
        "frontend/scripts/livemap_popcorn.js",
        "frontend/scripts/livemap_ui.js",
        "frontend/scripts/livemap_playback.js"
      ]
    },
    concat: {
      dist: {
        src: [
            "frontend/scripts/lib/*.js",
            "frontend/scripts/livemap_status.js",
            "frontend/scripts/livemap_connection.js",
            "frontend/scripts/livemap_popcorn.js",
            "frontend/scripts/livemap_ui.js"
        ],
        dest: "frontend/dist/lib/map_center/modules/livemap.js"
      },
      playback: {
        src: [
            "frontend/scripts/lib/popcorn*.js",
            "frontend/scripts/livemap_status.js",
            "frontend/scripts/livemap_popcorn.js",
            "frontend/scripts/livemap_playback.js"
        ],
        dest: "frontend/dist/lib/map_center/modules/livemap-playback.js"
      }
    },
    min: {
      dist: {
        src: ["<banner:meta.banner>", "<config:concat.dist.dest>"],
        dest: "frontend/dist/lib/map_center/modules/livemap.js"
      },
      playback: {
        src: ["<banner:meta.banner>", "<config:concat.playback.dest>"],
        dest: "frontend/dist/lib/map_center/modules/livemap-playback.js"
      }
    },
    watch: {
      files: "<config:lint.files>",
      tasks: "lint"
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        console: true,
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask("default", "lint concat min");
  grunt.registerTask("dev", "lint concat");

};
