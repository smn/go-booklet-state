var vumigo = require("vumigo_v01");
var jed = require("jed");

if (typeof api === "undefined") {
    // testing hook (supplies api when it is not passed in by the real sandbox)
    var api = this.api = new vumigo.dummy_api.DummyApi();
}

var Promise = vumigo.promise.Promise;
var success = vumigo.promise.success;
var Choice = vumigo.states.Choice;
var ChoiceState = vumigo.states.ChoiceState;
var FreeText = vumigo.states.FreeText;
var EndState = vumigo.states.EndState;
var InteractionMachine = vumigo.state_machine.InteractionMachine;
var StateCreator = vumigo.state_machine.StateCreator;

function Error(msg) {
    var self = this;
    self.msg = msg;

    self.toString = function() {
        return "<Error: " + self.msg + ">";
    };
}

function ExampleApp() {
    var self = this;
    // The first state to enter
    StateCreator.call(self, 'start');

}

// launch app
var states = new ExampleApp();
var im = new InteractionMachine(api, states);
im.attach();
