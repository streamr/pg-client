/* jshint indent:2,camelcase:false */
/* global module,require */
module.exports = function (grunt) {
  "use strict";

  // Load all grunt tasks defined in package.json
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({


    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        'jshintrc': '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'src/assets/js/*.js',
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
