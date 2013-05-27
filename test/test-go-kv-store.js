var fs = require("fs");
var assert = require("assert");
var vumigo = require("vumigo_v01");
var app = require("../lib/go-kv-store");

describe("Key Value store application", function() {

    var tester = new vumigo.test_utils.ImTester(app.api);

    it('should access keys & values', function(done) {
        var a = true;
        done();
    });
});