"use strict";

/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        strict: true,
        globalstrict: true,
        node: true
      },
      lib: {
        files: {
          src: ['Gruntfile.js', 'lib/*.js', 'package.json']
        }
      },
      test: {
        options: {
          globals: {
            describe: true,
            it: true,
            after: true
          },
          files: {
            src: ['test/*.js']
          }
        }
      }
    }
  });

  // npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint']);
};
