var vumigo = require("vumigo_v01");
var jed = require("jed");

if (typeof api === "undefined") {
    // testing hook (supplies api when it is not passed in by the real sandbox)
    var api = this.api = new vumigo.dummy_api.DummyApi();
}

var EndState = vumigo.states.EndState;
var BookletState = vumigo.states.BookletState;
var InteractionMachine = vumigo.state_machine.InteractionMachine;
var StateCreator = vumigo.state_machine.StateCreator;

function ExampleApp() {
    var self = this;
    // The first state to enter
    StateCreator.call(self, 'booklet');

    self.add_creator('booklet', function(state_name, im) {

        var next_page = function(page_number) {
            var p = im.api_request('http.get', {
                url: 'http://host/path/?p=' + page_number
            });
            p.add_callback(function(response) {
                var payload = JSON.parse(response.body);
                return payload.content;
            });
            return p;
        };

        return new BookletState(
            state_name, {
                next: 'end',
                pages: 3,
                page_text: next_page,
                buttons: {
                    "1": -1, "2": +1, "0": "exit"
                },
                footer_text: "\n1 for prev, 2 for next, 0 to end."
            }
        );
    });

    self.add_state(new EndState('end', 'Good bye!', 'booklet'));
}

// launch app
var states = new ExampleApp();
var im = new InteractionMachine(api, states);
im.attach();
