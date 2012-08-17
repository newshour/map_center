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
    // Compile Underscore.js-compatable templates into JavaScript functions for
    // run-time efficiency and simplified maintenance
    jst: {
      adminapp: {
        options: {
          namespace: "JST"
        },
        files: {
          "backend/www/scripts/jst.js": "backend/templates/*.html"
        }
      }
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
      },
      adminapp: {
        src: [
            "backend/scripts/lib/jquery*.js",
            "backend/scripts/lib/underscore*.js",
            "backend/scripts/lib/backbone*.js",
            "backend/scripts/lib/moment*.js",
            "frontend/scripts/lib/popcorn*.js",
            "frontend/scripts/livemap_status.js",
            "frontend/scripts/livemap_popcorn.js",
            "backend/www/scripts/jst.js",
            "backend/scripts/app.js"
        ],
        dest: "backend/www/scripts/app.js"
      }
    },
    min: {
      dist: {
        src: ["<banner:meta.banner>", "<config:concat.dist.dest>"],
        dest: "<config:concat.dist.dest>"
      },
      playback: {
        src: ["<banner:meta.banner>", "<config:concat.playback.dest>"],
        dest: "<config:concat.playback.dest>"
      },
      adminapp: {
        src: ["<banner:meta.banner>", "<config:concat.adminapp.dest>"],
        dest: "<config:concat.adminapp.dest>"
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

  grunt.loadNpmTasks("grunt-contrib");

  // Default task.
  grunt.registerTask("default", "lint jst concat min");
  grunt.registerTask("dev", "lint jst concat");

};
