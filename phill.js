var alexa = require("alexa-app");
var app = new alexa.app('phill');
var sentiment = require('sentiment');

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
  res.say(Math.abs(sent) + ' %' + (sent >=0 ? ' positive': ' negative'));
});

exports.handler = app.lambda();
