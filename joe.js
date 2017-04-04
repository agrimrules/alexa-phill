var Alexa = require('alexa-sdk');
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.SID, process.env.TOKEN);

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() {
    this.emit(':tell','Welcome how may I help you faggot?', 'I am sorry I dont understand autism')
  },
  'TextIntent': function () {
    var input = this.event.request.intent.slots.WORD;
    client.sendSms({
      to: process.env.TO_NUM,
      from: process.env.FROM_NUM,
      body: "You wanted me to text "+input
    },function (err,res) {
      if(!error){
        this.emit(':tell','sent you a text saying'+input);
      }
      else {
        this.emit(':tell','Something went wrong');
      }
    })
  },
  'Unhandled': function () {
       this.emit(':tell', 'Soon', 'Cant do that')
}
}
