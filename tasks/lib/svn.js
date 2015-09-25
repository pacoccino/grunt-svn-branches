var Helper = require('./helper');
var grunt = require('grunt');

var Svn = {};

Svn.isSvnAvailable = function(cb) {
    Helper.cmdExec("svn help help", function(err, out) {
        if(out && out.substr(0,4) == "help") {
            cb && cb(true);
        }
        else {
            cb && cb(false);
        }
    })
};

Svn.folderExists = function(config, url, cb) {
    //cb && cb(true); return;

    var cmd = "svn ls ";
    cmd += url;
    cmd = Svn.addCredentials(cmd, config);

    cmd += " --depth empty";

    Helper.cmdExec(cmd, function(err, out) {

        if(err) {
            cb && cb(false);
        }
        else {
            cb && cb(true);
        }
    })
};

Svn.addMessage = function(command, message) {

    return command + ' -m "' + message + '"';
};

Svn.addCredentials = function(command, config) {
    var withCred = command;
    withCred+= ' --username ' + config.login;
    withCred+= ' --password ' + config.pass;

    return withCred;
};

Svn.getMoveCmd = function(source, destination) {
    return 'svn move ' + source + ' ' + destination;
};

Svn.getCopyCmd = function(source, destination) {
    return 'svn copy ' + source + ' ' + destination;
};

Svn.getDeleteCmd = function(destination) {
    return 'svn delete ' + destination;
};

Svn.getMkdirCmd = function(destination) {
    return 'svn mkdir ' + destination;
};


module.exports = Svn;