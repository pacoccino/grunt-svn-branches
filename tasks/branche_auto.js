var Helper = require('../tasks/lib/helper');
var Svn = require('../tasks/lib/svn');
var gr_prompt = require('grunt-prompt/tasks/prompt');

var async = require('async');

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('branche_auto', 'Automatisation de creation de branches', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: '/',
      archiveFolder: 'Archives'
    });

    var argumentsNeeded = [
      'branches',
      'login',
      'pass'
    ];

    for(var i=0; i<argumentsNeeded.length; i++) {
      if(!options[argumentsNeeded[i]]) {
        grunt.fail.warn("Missing option", argumentsNeeded[i]);
      }
    }

    Helper.SEPARATOR = options.separator;
    Helper.ARCHIVEFOLDER = options.archiveFolder;

    var ce = function(cmd, config, cb) {

      grunt.log.writeln(cmd);
      //cb(null, config); return;

      Helper.cmdExec(cmd, function(strerr, stdout) {
        if(stdout) {
          grunt.log.writeln("Ok.");

          cb(null, config);
        }
        else {
          cb(strerr)
        }
      });
    };

    var createArchiveFolder = function(config, callback) {

      if(!config.archive.src && (!config.archive.dst || config.archive.noNeedDst)) {
        callback(null, config);
        return;
      }

      var destination = Helper.getArchiveFolderUrl(config);

      Svn.folderExists(config, destination, function(exists) {

        if(!exists) {

          var svnCmd = Svn.getMkdirCmd(destination);
          svnCmd = Svn.addMessage(svnCmd, "Creating archive folder");
          svnCmd = Svn.addCredentials(svnCmd, config);

          ce(svnCmd, config, callback);
        }
        else {
          callback(null, config);
        }
      });

    };

    var archiveSrcBranch = function(config, callback) {

      if(!config.archive.src) {
        callback(null, config);
        return;
      }


      var source = Helper.getSVNUrl(config, config.source);
      var destination = Helper.getArchiveUrl(config, config.source);

      var archFn = function() {

        var svnCmd = Svn.getCopyCmd(source, destination);
        svnCmd = Svn.addMessage(svnCmd, "Archive branch", config.svnProjectName);
        svnCmd = Svn.addCredentials(svnCmd, config);

        ce(svnCmd, config, callback);
      };

      Svn.folderExists(config, destination, function(exists) {

        if(exists) {

          var now = new Date();
          destination += '-' + now.getHours() +'-'+ now.getMinutes();

          Svn.folderExists(config, destination, function(existsHours) {
            if(!existsHours) {
              archFn();
            }
            else {
              grunt.log.error("Archive already created not so long ago, not archiving.")
              callback(null, config);
            }
          });
        }
        else {
          archFn();
        }
      });
    };

    var archiveDstBranch = function(config, callback) {

      if(config.archive.noNeedDst || !config.archive.dst) {
        callback(null, config);
        return;
      }

      var source = Helper.getSVNUrl(config, config.destination);
      var destination = Helper.getArchiveUrl(config, config.destination);

      var archFn = function() {

        var svnCmd = Svn.getCopyCmd(source, destination);
        svnCmd = Svn.addMessage(svnCmd, "Archive branch", config.svnProjectName);
        svnCmd = Svn.addCredentials(svnCmd, config);

        ce(svnCmd, config, callback);
      };

      Svn.folderExists(config, destination, function(exists) {

        if(exists) {

          var now = new Date();
          destination += '-' + now.getHours() +'-'+ now.getMinutes();

          Svn.folderExists(config, destination, function(existsHours) {
            if(!existsHours) {
              archFn();
            }
            else {
              grunt.log.error("Archive already created not so long ago, not archiving", config.svnProjectName)
              callback(null, config);
            }
          });
        }
        else {
          archFn();
        }
      });
    };

    var createDstFolder = function(config, callback) {

      var destination = Helper.getFolderUrl(config, config.destination);

      Svn.folderExists(config, destination, function(exists) {

        if(!exists) {

          var svnCmd = Svn.getMkdirCmd(destination);
          svnCmd = Svn.addMessage(svnCmd, "Creating destination folder");
          svnCmd = Svn.addCredentials(svnCmd, config);

          ce(svnCmd, config, callback);
        }
        else {
          callback(null, config);
        }
      });

    };

    var deleteDstBranch = function(config, callback) {

      if(config.archive.noNeedDst) {
        callback(null, config);
        return;
      }

      var destination = Helper.getSVNUrl(config, config.destination);

      var svnCmd = Svn.getDeleteCmd(destination);
      svnCmd = Svn.addMessage(svnCmd, "Delete branch", config.svnProjectName);
      svnCmd = Svn.addCredentials(svnCmd, config);

      ce(svnCmd, config, callback);
    };

    var copyBranch = function(config, callback) {

      var source = Helper.getSVNUrl(config, config.source);
      var destination = Helper.getSVNUrl(config, config.destination);

      var svnCmd = Svn.getCopyCmd(source, destination);
      svnCmd = Svn.addMessage(svnCmd, "Copy branch", config.svnProjectName);
      svnCmd = Svn.addCredentials(svnCmd, config);

      ce(svnCmd, config, callback);
    };

    var beginWaterfall = function(config, callback) {

      var source = Helper.getSVNUrl(config, config.source);
      var destination = Helper.getSVNUrl(config, config.destination);

      Svn.folderExists(config, source, function(exists) {
        if(exists) {

          Svn.folderExists(config, destination, function(exists) {
            if(!exists) {
              config.archive.noNeedDst = true;
            }

            callback(null, config);
          });
        }
        else {
          callback("Main branch does not exists:", config.svnProjectName);
        }
      });
    };

    var endWaterfall = function(config, callback) {

      callback(null, true);
    };

    var self = this;

    var createBranch = function(branch, callback) {

      if(!branch.svnDevUrl || !branch.svnProjectName) {
        grunt.log.error("Not enough parameters for branch, next one.");
        callback(null);
      }

      var config = {};
      config.archive = options.archive;
      config.source = options.source;
      config.destination = options.destination;

      config.login = options.login;
      config.pass = options.pass;

      config.svnDevUrl = branch.svnDevUrl;
      config.svnBranchesUrl = branch.svnBranchesUrl || branch.svnDevUrl;
      config.svnProjectName = branch.svnProjectName;
      config.trunkize = branch.trunkize || false;

      grunt.log.subhead("Creating branch:", config.svnProjectName);

      async.waterfall([
          function SetConfigForWaterfall(cb) {
            cb(null, config);
          },
          beginWaterfall,
          createArchiveFolder,
          archiveSrcBranch,
          archiveDstBranch,
          createDstFolder,
          deleteDstBranch,
          copyBranch,
          endWaterfall
      ], function(error, result) {

        if(error) {
          grunt.log.error(error);
          grunt.log.error("Branch creation failed:", config.svnProjectName);
          callback(error);
        }
        else {
          grunt.log.ok("Branch created successfuly:", config.svnProjectName);
          callback(null);
        }
      });
    };

    var createBranches = function() {

      options.archive = {
        src: false,
        dst: false
      };

      var envStr = "";
      switch(options.destination) {

        case Helper.ENV.DEV:
          grunt.fail.warn("Destination cannot be DEV");
          return false;

        case Helper.ENV.PREPROD:
          options.source = Helper.ENV.DEV;
          envStr = "PREPROD";
          break;

        case Helper.ENV.PROD:
          options.source = Helper.ENV.PREPROD;
          envStr = "PROD";
          options.archive.src = true;
          options.archive.dst = true;
          break;

        case Helper.ENV.SPRINT:
          options.source = Helper.ENV.DEV;
          envStr = "SPRINT";
          options.archive.dst = true;
          break;

        case Helper.ENV.FAKE:
          options.source = Helper.ENV.DEV;
          envStr = "FAKE";
          options.archive.dst = true;
          break;
      }

      grunt.log.subhead("Creation of branches for", envStr, "environment.");

      var done = self.async();

      async.eachSeries(options.branches, createBranch, function(err) {
        if(err) {
          grunt.fail.warn("Error while creating branches.");
        }
        else {
          grunt.log.writeln();
          grunt.log.ok("Every branch were successfuly created.");
        }

        done();
      });
    };

    if(!options["destination"]) {

      var promptConfig = {
        target: {

          options: {
            questions: [{
              config: 'env',
              type: 'list',
              message: 'Please choose destination environment :',
              default: 'preprod',
              choices: [
                {
                  name: 'dev -> preprod',
                  value: Helper.ENV.PREPROD
                },
                {
                 name: 'dev -> sprint',
                 value: Helper.ENV.SPRINT
                 },
                {
                  name: 'preprod -> prod',
                  value: Helper.ENV.PROD
                }
              ]
            }],
            then : function(){
              options["destination"] = grunt.config('env');
              createBranches();

              return true;
            }
          }
        }
      };

      grunt.config('prompt', promptConfig);
      gr_prompt(grunt);
      grunt.task.run("prompt");
    }
    else {
      createBranches();
    }

  });

};
