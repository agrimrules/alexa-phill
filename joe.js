'use strict';

var Alexa = require('alexa-sdk');
var twilio = require('twilio');
var sentiment = require('sentiment');
var client = new twilio.RestClient(process.env.SID, process.env.TOKEN);

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() {
    this.emit(':tell','Welcome how may I help you faggot?', 'I am sorry I dont understand autism')
  },
  'TextIntent': function () {
    var self = this;
    var input = this.event.request.intent.slots.WORD.value;
    client.sendSms({
      to: process.env.TO_NUM,
      from: process.env.FROM_NUM,
      body: "You wanted me to text "+input
    },function (err,res) {
      if(!err){
        self.emit(':tell','sent you a text saying '+input);
      }
      else {
        self.emit(':tell','Something went wrong');
      }
    })
  },
  'AnalyzeIntent': function () {
    var s = Math.round((sentiment(this.event.request.intent.slots.SENTIMENT.value).comparative / 5) * 100);
    this.emit(':tell', Math.abs(s)+' %' + (s >=0 ? ' positive': ' negative'));
  },
  'Unhandled': function () {
       self.emit(':tell', 'Soon', 'Cant do that');
     }
};
