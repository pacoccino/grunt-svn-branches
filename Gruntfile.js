/*
 * grunt-svn-branches
 * https://github.com/pboisson/gruntinit
 *
 * Copyright (c) 2015 Pacien Boisson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    branche_auto: {
      options: {
        branches: [
          {
            svnDevUrl:      "http://svn.domain.com/svn/rep/Solution/temp",
            svnProjectName: "roger"
          }
        ],
        login: "login",
        pass: "pass"
      },
      preprod: {
        options: {
          destination: 'preprod'
        }
      },
      sprint: {
        options: {
          destination: 'sprint'
        }
      },
      prod: {
        options: {
          destination: 'prod'
        }
      },
      multiple: {
        options: {
          branches: [
            {
              svnDevUrl:      "http://svn.domain.com/svn/rep/Solution/temp",
              svnBranchesUrl: "http://svn.domain.com/svn/rep/Solution/temp/branches",
              svnProjectName: "roger"
            },
            {
              svnDevUrl:      "http://svn.domain.com/svn/rep/Solution/tmp",
              svnProjectName: "cactus"
            }
          ],
          destination: 'fake'
        }
      }
    },

    // Unit tests.
    simplemocha: {
      options: {
        timeout: 500,
        ui: 'bdd',
        reporter: 'dot'
      },
      lib: { src: ['test/*.js'] }
    }

  });

// Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

// These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.loadNpmTasks('grunt-prompt');

  grunt.registerTask('multest', ['branche_auto:multiple']);

  grunt.registerTask('test', ['simplemocha']);

// By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
