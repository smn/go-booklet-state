var fs = require("fs");
var assert = require("assert");
var vumigo = require("vumigo_v01");
var app = require("../lib/go-booklet-state");

// This just checks that you hooked you InteractionMachine
// up to the api correctly and called im.attach();
describe("test api", function() {
    it("should exist", function() {
        assert.ok(app.api);
    });
    it("should have an on_inbound_message method", function() {
        assert.ok(app.api.on_inbound_message);
    });
    it("should have an on_inbound_event method", function() {
        assert.ok(app.api.on_inbound_event);
    });
});

describe("Go's Booklet State", function() {

    var fixtures = [
        'test/fixtures/page0.json',
        'test/fixtures/page1.json',
        'test/fixtures/page2.json'
    ];

    var tester = new vumigo.test_utils.ImTester(app.api, {
        custom_setup: function(api) {
            fixtures.forEach(function(fx) {
                api.load_http_fixture(fx);
            });
        },
        async: true
    });

    it('should start at page 1', function(done) {
        var p = tester.check_state({
            user: null,
            content: null,
            next_state: 'booklet',
            response: '^This is page 1.\n1 for prev, 2 for next, 0 to end.$',
            continue_session: true
        });
        p.then(done, done);
    });

    it('should continue to page 2', function(done) {
        var p = tester.check_state({
            user: {
                current_state: 'booklet'
            },
            content: "2",
            next_state: 'booklet',
            response: '^This is page 2.\n1 for prev, 2 for next, 0 to end.$',
            continue_session: true
        });
        p.then(done, done);
    });

    it('should continue to page 3', function(done) {
        var p = tester.check_state({
            user: {
                pages: {
                    booklet: 1
                },
                current_state: 'booklet'
            },
            content: "2",
            next_state: 'booklet',
            response: '^This is page 3.\n1 for prev, 2 for next, 0 to end.$',
            continue_session: true
        });
        p.then(done, done);
    });

    it('should continue to page 1 after page 3', function(done) {
        var p = tester.check_state({
            user: {
                pages: {
                    booklet: 2
                },
                current_state: 'booklet'
            },
            content: "2",
            next_state: 'booklet',
            response: '^This is page 1.\n1 for prev, 2 for next, 0 to end.$',
            continue_session: true
        });
        p.then(done, done);
    });

    it('should continue to end', function(done) {
        var p = tester.check_state({
            user: {
                pages: {
                    booklet: 2
                },
                current_state: 'booklet'
            },
            content: "0",
            next_state: 'end',
            response: '^Good bye!$',
            continue_session: false
        });
        p.then(done, done);
    });
});