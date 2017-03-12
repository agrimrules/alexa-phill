var alexa = require("alexa-app");
var app = new alexa.app('phill');

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

exports.handler = app.lambda();
