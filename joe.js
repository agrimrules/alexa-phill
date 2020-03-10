'use strict';

var Alexa = require('alexa-sdk');
var twilio = require('twilio');
var sentiment = require('sentiment');
var speakeasy = require('speakeasy');
var client = new twilio.RestClient(process.env.SID, process.env.TOKEN);
var token = process.env.two_fa_token;

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() {
    this.emit(':tell','Welcome how may I help you?', 'I am sorry I dont understand')
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
  'VerifyIntent': function(){
    console.log('Access-token:'+token);
    console.log('prompt:'+this.event.request.intent.slots.CODE.value);
      if(speakeasy.totp.verify({
        secret: token,
        encoding: 'base32',
        token: this.event.request.intent.slots.CODE.value
      })){
        this.emit(':tell', 'Access Granted')
      }
      else {
        this.emit(':tell', 'Access Denied')
      }
  },
  'AuthorizeIntent': function() {
    this.handler.state == "req-auth";
    this.emit(':ask', 'Please tell me your access code', 'Please repeat your access code');
  },
  'Unhandled': function () {
       self.emit(':tell', 'Soon', 'Cant do that');
     }
};
