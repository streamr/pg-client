/* jshint indent:2,camelcase:false */
/* global module,require */
module.exports = function (grunt) {
  "use strict";

  // Load all grunt tasks defined in package.json
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({


    pkg: grunt.file.readJSON('package.json'),

    handlebars: {
      marvin: {
        options: {
          namespace: "marvin.templates",
          // Transform paths to sensible template names -> Extract filename, remove ext
          processName: function (name) {
            var path = name.split('/');
            var filename = path[path.length - 1];
            var parts = filename.split('.');
            parts.pop(); //removes extension
            return parts.join('.');
          }
        },
        files: {
          "dist/javascripts/marvin_templates.js": "www/templates/*.hbs",
        }
      }
    },


    jshint: {
      options: {
        'jshintrc': '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'www/javascripts/*.js',
      ]
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: [
          'src/*.html'
        ],
      },
      js: {
        files: [
          '<%= jshint.all %>'
        ]
      }
    },

    // Shortcuts for some often used commands
    shell: {
      options: {
        stderr: true,
      },
      server: {
        options: {
          stdout: true,
        },
        command: 'cd src && python -m SimpleHTTPServer'
      },
    },

    clean: {
      dist: [
        'dist',
        'ghdist',
      ],
    },

    concurrent: {
      server: {
        tasks: ['watch', 'shell:server'],
        options: {
          logConcurrentOutput: true,
        }
      }
    },

  });


  // Default task
  grunt.registerTask('default', [
    'server',
  ]);
  grunt.registerTask('server', [
    'concurrent:server',
  ]);
};
