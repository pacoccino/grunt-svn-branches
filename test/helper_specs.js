var Helper = require('../tasks/lib/helper');
var expect = require("chai").expect;

var config;

describe("Helpers", function() {

    beforeEach(function() {
        config = {
            svnDevUrl:      "a",
            svnBranchesUrl: "b",
            svnProjectName: "geode"
        };
    });

    it("getProjectBranchName - dev", function() {
        var projectName = Helper.getProjectBranchName(config, 'dev');
        expect(projectName).to.equal('geode');
    });

    it("getProjectBranchName - preprod", function() {
        var projectName = Helper.getProjectBranchName(config, 'preprod');
        expect(projectName).to.equal('geode-preprod');
    });

    it("getProjectBranchName - dev - trunkized", function() {
        config.trunkize = true;
        var projectName = Helper.getProjectBranchName(config, 'dev');
        expect(projectName).to.equal('trunk');
    });

    it("getProjectBranchName - preprod", function() {
        config.trunkize = true;
        var projectName = Helper.getProjectBranchName(config, 'preprod');
        expect(projectName).to.equal('preprod');
    });

    it("get folder url - dev", function() {
        var url = Helper.getFolderUrl(config, 'dev');
        expect(url).to.equal('a');
    });

    it("get folder url - preprod", function() {
        var url = Helper.getFolderUrl(config, 'preprod');
        expect(url).to.equal('b');
    });

    it("get folder url - dev - trunkized", function() {
        config.trunkize = true;
        var url = Helper.getFolderUrl(config, 'dev');
        expect(url).to.equal('a/geode');
    });

    it("get folder url - preprod - trunkized", function() {
        config.trunkize = true;
        var url = Helper.getFolderUrl(config, 'preprod');
        expect(url).to.equal('a/geode/branches');
    });

    it("get svn url - dev", function() {
        var url = Helper.getSVNUrl(config, 'dev');
        expect(url).to.equal('a/geode');
    });

    it("get svn url - preprod", function() {
        var url = Helper.getSVNUrl(config, 'preprod');
        expect(url).to.equal('b/geode-preprod');
    });

    it("get svn url - prod", function() {
        var url = Helper.getSVNUrl(config, 'prod');
        expect(url).to.equal('b/geode-prod');
    });

    it("get svn url - dev - trunkized", function() {
        config.trunkize = true;
        var url = Helper.getSVNUrl(config, 'dev');
        expect(url).to.equal('a/geode/trunk');
    });

    it("get svn url - preprod - trunkized", function() {
        config.trunkize = true;
        var url = Helper.getSVNUrl(config, 'preprod');
        expect(url).to.equal('a/geode/branches/preprod');
    });

    it("get svn url - prod - trunkized", function() {
        config.trunkize = true;
        var url = Helper.getSVNUrl(config, 'prod');
        expect(url).to.equal('a/geode/branches/prod');
    });

    it("getArchiveFolderUrl - preprod", function() {
        var url = Helper.getArchiveFolderUrl(config);

        expect(url).to.equal('b/Archives');
    });

    it("getArchiveFolderUrl - preprod - trunkized", function() {
        config.trunkize = true;
        var url = Helper.getArchiveFolderUrl(config);

        expect(url).to.equal('a/geode/Archives');
    });

    it("getArchiveUrl - preprod", function() {
        var url = Helper.getArchiveUrl(config, 'preprod');
        var date = new Date();
        var dateString = '' + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + date.getDate();

        expect(url).to.equal('b/Archives/geode-preprod_' + dateString);
    });
});