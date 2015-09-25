var exec = require('child_process').exec;
var grunt = require('grunt');

var Helper = {};

Helper.SEPARATOR = "/";
Helper.ARCHIVEFOLDER = "Archives";

Helper.ENV = {
    DEV: 'dev',
    PREPROD: 'preprod',
    PROD: 'prod',
    SPRINT: 'sprint',
    FAKE: 'fake'
};

Helper.getProjectBranchName = function(config, env) {

    switch(env) {
        case Helper.ENV.DEV:
            return config.svnProjectName;

        case Helper.ENV.PREPROD:
            return config.svnProjectName + '-preprod';

        case Helper.ENV.SPRINT:
            return config.svnProjectName + '-sprint';

        case Helper.ENV.PROD:
            return config.svnProjectName + '-prod';

        case Helper.ENV.FAKE:
            return config.svnProjectName + '-fake';
    }
};

Helper.getSVNUrl = function(config, env) {
    var svnUrl = "";

    switch(env) {
        case Helper.ENV.DEV:
            svnUrl += config.svnDevUrl;
            break;

        case Helper.ENV.PREPROD:
        case Helper.ENV.SPRINT:
        case Helper.ENV.PROD:
        case Helper.ENV.FAKE:
            svnUrl += config.svnBranchesUrl;
            break;
    }

    svnUrl += Helper.SEPARATOR;
    svnUrl += Helper.getProjectBranchName(config, env);

    return svnUrl;
};

Helper.getArchiveFolderUrl = function(config) {

    return config.svnBranchesUrl + Helper.SEPARATOR + Helper.ARCHIVEFOLDER;
};

Helper.getArchiveUrl = function(config, env) {

    var svnUrl = Helper.getArchiveFolderUrl(config) + Helper.SEPARATOR;

    svnUrl += Helper.getProjectBranchName(config, env);

    var date = new Date();
    var dateString = '' + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + date.getDate();

    svnUrl += '_' + dateString;

    return svnUrl;
};

Helper.cmdExec = function(cmd, callback) {
    exec(cmd, function (error, stdout, stderr) {
        if(error) {
            if(stderr.substr(5,7) == "E175002") {
                grunt.log.writeln("Tried to created folder that already exists")
            }
            else {
                //grunt.log.error('stderr: ' + stderr);
            }
            callback(stderr);
        }
        else {
            callback(stderr, stdout);
        }
    });
};

module.exports = Helper;