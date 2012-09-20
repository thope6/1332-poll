Questions = new Meteor.Collection("questions");

function Question(name, description, answers, correctAnswer) {
  this.name = name;
  this.description = description;
  this.results = new Array();
  this.answers = answers;
  this.correctAnswer = correctAnswer;
  for(var i = 0; i < answers.length; i++) {
    this.results[i] = 0;
  }
}

function loadQuestion(name) {
  Session.set("question", name);
  return false;
}

function addAnswer(qname, ansIndex) {
  var str = "ansCount." + ansIndex;
  Questions.update({"name": qname}, {$inc: {"results.2": 1}});
  console.log(Questions.findOne({"name": qname}, {results:1}));
  return false;
}

if (Meteor.is_client) {
  Session.set("question", '');

  Template.hello.greeting = function () {
    return "Welcome to Poll.";
  };

  Template.main.questions = function() {
    return Questions.find({}, {sort: {name:1}});
  };

  Template.main.location = function() {
    return Session.get("question");
  };

  Template.main.selectedQuestion = function() {
    console.log(Session.get("question"));
    return Questions.findOne({name: Session.get("question")});
  };

  Template.hello.events = {
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  };






//  Template.question.name = function (){
 // };



}

if (Meteor.is_server) {
  Meteor.startup(function () {
    Questions.remove({});
    console.log("Server Startup!");
    var names = ["Linked List", "AVL Trees"];
    var desc = ["a linked list", "some avl stuff"];
    var answers = [["one", "two", "three"], ["a", "b", "c"]];
    var ansCount = [[0, 0, 0], [0, 0, 0]];
    var correct = [0, 2];
    for(var i = 0; i < names.length; i++) {
      Questions.insert(new Question(names[i], "description", answers[i], correct[i]));
      //Questions.insert({name: names[i], description: desc[i], answers: answers[i], ansCount: ansCount[i], correct: correct[i]});
    }
  });
}