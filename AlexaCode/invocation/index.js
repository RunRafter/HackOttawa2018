'use strict';
const Alexa = require("alexa-sdk");

var request = require('request');

var final_string = null;

var headers = {
    'App-Id': '16e79581',
    'App-Key': 'b14a2bfab21d89c6e1867b34303eb890',
    'Content-Type': 'application/json'
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask' , 'Welcome to Nurse Bot! How can I help? Please tell me right away if you need immediate assistance!');
    },
    'Emergency': function () {
        this.emit(':tell' , 'Calling 911. Hang in there');
    },
    'Symptoms': function () {
        console.log("Test");
        this.emit(':ask' , 'Tell me your symptoms');
    },  
    'GetSymptoms': function () {
        var stateSlot = this.event.request.intent.slots.symp.value;
        // var stateSlot = this.event.request.type;
        var speechOutput = '{"text": ' + stateSlot + '}';

        //this.emit(':tell' , speechOutput);

        var options = {
            url: 'https://api.infermedica.com/v2/parse',
            method: 'POST',
            headers: headers,
            body: speechOutput
        };

        //var temp_string = options.body;
        //this.emit(':tell' , options.body);

        function callback(error, response, body) {
            //console.log(body);
            //this.emit(':tell' , body);
            if (!error && response.statusCode == 200) {
                var json_body = JSON.parse(body);
                if (!json_body) {
                    this.emit(':tell', 'is null');
                    console.log('is null');
                }
                this.emit(':tell' , json_body);
                var symp_arr = [];
                var i=0;
                for (i in json_body['mentions']) {
                    symp_arr[i] = json_body['mentions'][i]['name'];
                }

                var final_string = "My diagnosis shows that you have symptoms of " + symp_arr.toString();
                //console.log(final_string);
            }
        }

        request(options, callback);

        //this.emit(':tell' , final_string);
    },  
    'Greet': function () {
        this.response.speak('Welcome to Nurse Bot. How are you feeling today?'); 
        this.response.listen('How are you feeling today?');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'You can tell me about the symptons and I can perform a preliminary diagnosis for you! I can also set up a doctors appointment for you! No one likes to wait in lines right?';
        const reprompt = 'Say hello, to hear me speak.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('See you later!');
        this.emit(':responseReady');
    }
};

