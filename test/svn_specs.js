var Svn = require('../tasks/lib/svn');
var Helper = require('../tasks/lib/helper');
var expect = require("chai").expect;

var config;

describe("Svn", function() {

    beforeEach(function() {
        config = {
            login: 'bob',
            pass: 'roger'
        };
    });

    it("svn is available", function(done) {
        Svn.isSvnAvailable(function(ok) {
            expect(ok).to.be.true;
            done();
        });
    });

    it("add message", function() {
        var cmd = Svn.addMessage('initial', 'message');
        expect(cmd).to.equal('initial -m "message"');
    });

    it("add credentials", function() {
        var cmd = Svn.addCredentials('initial', config);
        expect(cmd).to.equal('initial --username ' + config.login +' --password ' + config.pass);
    });

    it("svn move", function() {
        var cmd = Svn.getMoveCmd('src', 'dest');
        expect(cmd).to.equal('svn move src dest');
    });

    it("svn copy", function() {
        var cmd = Svn.getCopyCmd('src', 'dest');
        expect(cmd).to.equal('svn copy src dest');
    });

    it("svn folderExists true", function(done) {
        var tmp = Helper.cmdExec;
        Helper.cmdExec = function(a, cb) {
            cb(null);
        };

        Svn.folderExists({login:"r", pass:"a"}, 'folder', function(exists) {

            expect(exists).to.be.true;
            done();
        });

        Helper.cmdExec = tmp;
    });
    it("svn folderExists false", function(done) {
        var tmp = Helper.cmdExec;
        Helper.cmdExec = function(a, cb) {
            cb("err");
        };

        Svn.folderExists({login:"r", pass:"a"}, 'folder', function(exists) {

            expect(exists).to.be.false;
            done();
        });

        Helper.cmdExec = tmp;
    });

});