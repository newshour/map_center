/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
      NODE_HOST: process.env.NODE_HOST || "127.0.0.1",
      NODE_PORT: process.env.NODE_PORT || 8000,
      banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
        "<%= pkg.homepage ? '* ' + pkg.homepage + '\n' : '' %>" +
        "* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author %>; */"
    },
    lint: {
      server: [
        "grunt.js",
        "backend/*.js",
        "backend/swarm/*.js"
      ],
      client: [
        "backend/www/scripts/app.js",
        "backend/www/scripts/modules/*.js",
        "frontend/scripts/*.js",
        "shared/*.js"
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
    qunit: {
      all: ["frontend/test/index.html"]
    },
    test: {
        "backend": ["backend/test/*.js"]
    },
    requirejs: {
      "adminapp": {
        options: {
          mainConfigFile: "backend/www/scripts/main-config.js"
        }
      }
    },
    copy: {
      // This copy target should only be run in development as it inserts
      // require.js in the application's position, thus allowing dependencies
      // to be resolved at run time.
      "adminapp-dev": {
        options: {
          processName: function(fileName) {
            if (/require.*\.js$/i.test(fileName)) {
              fileName = "require.js";
            }
            return fileName;
          }
        },
        files: {
          "backend/www/scripts/": "backend/www/scripts/lib/require-2.0.6.js"
        }
      },
      "adminapp": {
        options: {
          flatten: true,
          // Inject NODE_HOST and NODE_PORT values into files as they are
          // copied
          processContent: function(content) {
            return content.replace(/\{\{\s*(NODE_HOST|NODE_PORT)\s*\}\}/g,
                function(match, varName) {
                    return grunt.config("meta." + varName);
                }
            );
          }
        },
        files: {
          "backend/www/scripts/shared": [
            "shared/livemap_status.js",
            "shared/livemap_popcorn.js",
            "shared/livemap_connection.js"
          ],
          "backend/www/scripts/shared/lib": "shared/lib/*",
          "frontend/dist/lib/map_center/modules/shared": [
            "shared/livemap_status.js",
            "shared/livemap_popcorn.js",
            "shared/livemap_connection.js"
          ],
          "frontend/dist/lib/map_center/modules/shared/lib": "shared/lib/*"
        }
      }
    },
    concat: {
      dist: {
        src: [
            "frontend/dist/lib/map_center/modules/shared/lib/*.js",
            "frontend/dist/lib/map_center/modules/shared/livemap_status.js",
            "frontend/dist/lib/map_center/modules/shared/livemap_connection.js",
            "frontend/dist/lib/map_center/modules/shared/livemap_popcorn.js",
            "frontend/scripts/ui_realtime.js"
        ],
        dest: "frontend/dist/lib/map_center/modules/livemap.js"
      },
      playback: {
        src: [
            "frontend/dist/lib/map_center/modules/shared/lib/popcorn*.js",
            "frontend/dist/lib/map_center/modules/shared/livemap_status.js",
            "frontend/dist/lib/map_center/modules/shared/livemap_popcorn.js",
            "frontend/scripts/ui_playback.js"
        ],
        dest: "frontend/dist/lib/map_center/modules/livemap-playback.js"
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
      }
    },
    watch: {
      files: "<config:lint.files>",
      tasks: "lint"
    },
    jshint: {
      server: {
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
          node: true,
          es5: true
        }
      },
      client: {
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
          require: true,
          define: true
        }
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks("grunt-contrib");

  // Default task.
  grunt.registerTask("default", "lint test concat min jst copy:adminapp requirejs");
  grunt.registerTask("dev", "lint test concat jst copy");

};
