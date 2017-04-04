var alexa = require("alexa-app");
var sentiment = require('sentiment');
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.SID, process.env.TOKEN);
var app = new alexa.app('phill');
var request = require("request");

var options = { method: 'POST',
  url: 'https://api.twilio.com/2010-04-01/Accounts/"+process.env.SID+"/Calls.json',
  headers:
   { 'cache-control': 'no-cache',
     authorization: process.env.AUTH,
     'content-type': 'application/x-www-form-urlencoded' },
  form:
   { Url: 'https://gist.githubusercontent.com/agrimrules/d3cd7194e86726da19968762b0b67f5f/raw/205de74745f9e89b5bb4ed9f49fbd644de3f8910/sample.twiml',
     To: process.env.TO_NUM,
     From: process.env.FROM_NUM } };

app.launch((req,res)=>{
  res.say("cash me outside howbow deh?");
});

app.intent('QuestionIntent',{
  'slots':{
    'VALUE': 'LITERAL'
  },
  'utterances':[
    'are you {-|VALUE}'
  ]
},(req,res)=>{
  var input = req.slot('VALUE');
  res.say(`Yes I am ${input}.`)
});

app.intent('RepeatIntent',{
  'slots': {
    'WORD': 'LITERAL'
  },
  'utterances':[
    'to repeat {-|WORD}'
  ]
}, (req, res)=>{
  res.say(`${req.slot('WORD')}`)
});

app.intent('AnalyzeIntent',{
  'slots': {
    'SENTIMENT': 'LITERAL'
  },
  'utterances':[
    'to analyze {-|SENTIMENT}',
    'to process {-|SENTIMENT}',
    'to evaluate {-|SENTIMENT}'
  ]
},(req,res)=>{
  sent = Math.round((sentiment(req.slot('SENTIMENT')).comparative / 5) * 100);
  if(sent == 0){
    res.say('Completely neutral statement');
  }
  else {
  res.say(Math.abs(sent) + ' %' + (sent >=0 ? ' positive': ' negative'));
  }
});

app.intent('TelephonyIntent',{
  'slots':{
    'ME': 'LITERAL'
  },
  'utterances':[
    'to call me {-|ME}',
    'to find my phone {-|ME}'
  ]
}, (req, res)=>{
  console.log('making request');
  request(options, function(error, response, body) {
    console.log('made request');
    if(error) throw new Error(error);
    res.say('Hope you found your phone');
  });
});

exports.handler = app.lambda();
