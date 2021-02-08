// server.js
// where your node app starts

// init project
const http = require("http");
const express = require("express");
const app = express();
const Discord = require("discord.js");
const client = new Discord.Client();
var vars = [];
var relevantguild = [];
var essays = [];
var essaynum = 0;
var generated = 0;
var hoursuntildue = 0.1;
var day = 0;
var hour = 0;
var minute = 0;
var month = 0;

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  //THIS IS THE HELP EMBED
  if (msg.content.includes("help!!")) {
    const helpEmbed = new Discord.RichEmbed()
      .setTitle("Help Menu")
      .addField("Submission", "submit!!your submission")
      .addField("Show Prompts", "prompts!!")
      .addField("Delete Prompt", "delete!!prompt number")
      .addField("Generate Prompt", "generate!!")
      .addField("Submit Essay (DM to Bot)", "essay!!title!!body of essay")
      .addField("List # of Submissions", "submissions!!")
      .addField("Print all Submissions", "printall!!")
      .addField("Grade Essay", "grade!!essay number!!grade")
      .addField("Display Due Date", "duedate!!")
      .addField(
        "Change Submission Countdown",
        "duedatechange!!hours until new duedate"
      );

    msg.channel.send(helpEmbed);
  }

  //THIS SHOWS HOW MANY ESSAYS HAVE BEEN SUBMITTED
  if (msg.content.includes("submissions!!")){
    msg.channel.send("there are " + essays.length + " essays submitted");
  }
  
  //THIS PRINTS ALL ESSAYS
  if (msg.content.includes("printall!!")){
    for (let i = 0; i < essays.length; i++){
      msg.channel.send(essays[i][0] + "\nby " +essays[i][2] + "\n\n" + essays[i][1]);
    }
  }
  
  //THIS ALLOWS YOU TO SUBMIT PROMPTS, SAMPLE FORMAT IS "submit!! sample prompt"
  if (msg.content.includes("submit!!")) {
    if (msg.content.includes("anime")) {
      msg.channel.send("sorry, try being less gay next time");
    }
    else {
    let varstring = msg.content.split("!!");
    vars.push(varstring[1]);
    msg.channel.send("prompt submitted");
    }
  }

  // THIS LISTS PROMPTS, JUST TYPE 'prompts!!' AND IT WILL LIST THE PROMPT AND ITS NUMBER
  if (msg.content.includes("prompts!!")) {
    for (let i = 0; i < vars.length; i++) {
      msg.channel.send(i + " || " + vars[i]);
    }
  }

  // THIS DELETES PROMPTS, ALL YOU TYPE IS 'delete!!3', AND IT WILL DELETE PROMPT #3
  if (msg.content.includes("delete!!")) {
    var msgdelete = msg.content.split("!!");
    msg.channel.send('prompt "' + vars[msgdelete[1]] + '" deleted');
    vars.splice(msgdelete[1], 1);
  }

  //THIS LETS YOU CHANGE HOW MANY HOURS THERE ARE UNTIL THE ESSAYS ARE DUE, DUEDATE!!1
  if (msg.content.includes("duedatechange!!")) {
    var hourstildue = msg.content.split("!!");
    hoursuntildue = hourstildue[1];
    msg.channel.send("the essays are now due " + hoursuntildue + " hours from prompt generation");
  }
  
  //THIS SHOWS YOU THE DUE DATE OF THE CURRENT ESSAY
  if (msg.content.includes("duedate!!")){
    var newhour = parseFloat(hour) + parseFloat(hoursuntildue);
    var newday = day;
    if (newhour > 23){
      newday = day + Math.floor(newhour/24);
      newhour = newhour % 24;
    }
    if (minute < 10){
      minute = 0 + minute;
    }
    msg.channel.send("the essays are due at " + newhour + ":" + minute + " on " + month + " " + newday);
  }

  // THIS IS THE PROMPT GENERATOR, ALL YOU HAVE TO TYPE IS 'generate!!'. AFTER 'HOURSUNTILDUE' HOURS OF THIS FUNCTION BEING CALLED, THE WINNER WILL BE ANNOUNCED
  if (msg.content.includes("generate!!")) {
    generated = 1;
    essays = [];
    essaynum = 0;
    var testnum = Math.floor(Math.random() * vars.length);
    let n = 0;
    relevantguild = msg.guild;
    msg.channel.send(
      "the prompt is: \n" +
        vars[testnum] +
        "\n it is due in " +
        hoursuntildue +
        " hours"
    );
    vars.splice(testnum, 1);
    var generateday = new Date();
    day = generateday.getDate();
    hour = generateday.getUTCHours();
    if (hour >= 5){
      hour -= 5;
    }
    else { hour += 19;}
    minute = generateday.getMinutes();
    month = generateday.getMonth();

    var timeout = setTimeout(function() {
      if (essays[0] != null) {
        let winner = 0;
        let highestscore = 0;
        for (let i = 0; i < essays.length; i++) {
          if (essays[i][4] > highestscore) {
            highestscore = essays[i][4];
            winner = i;
          }
        }
        msg.channel.send("the winner is " + essays[winner][2] + "!");
        msg.channel.send(
          essays[winner][0] +
            "\nby " +
            essays[winner][2] +
            "\n\n" +
            essays[winner][1]
        );
      } else {
        msg.channel.send("no essays were submitted in time");
      }
    }, hoursuntildue * 1000 * 60 * 60);
  }

  // THIS IS THE ESSAY SUBMISSION PART, SAMPLE FORMAT FOR SUBMISSION IS "essay!!SAMPLE TITLE!!BODY OF YOUR ESSAY
  if (msg.content.includes("essay!!") & (generated == 1)) {
    var essay1 = msg.content.split("!!");
    essays[essaynum] = new Array(5);
    essays[essaynum][0] = essay1[1];
    essays[essaynum][1] = essay1[2];
    essays[essaynum][2] = msg.author.tag;
    let john = relevantguild.members.random();
    while (
      john.user.tag.includes("bot") ||
      john.user.tag.includes(msg.author.tag)
    ) {
      //while (john.user.tag != msg.author.tag){ //this is just for testing
      john = relevantguild.members.random();
    }
    essays[essaynum][3] = john;
    john.send(
      "Essay #" +
        essaynum +
        "\n" +
        essays[essaynum][0] +
        "\n written by " +
        essays[essaynum][2] +
        "\n \n" +
        essays[essaynum][1]
    );
    essaynum++;
  }

  // THIS IS THE GRADING PART, SAMPLE FORMAT IS grade!!1!!5 (IN THIS SCENARIO, YOU ARE GIVING ESSAY #1 A GRADE OF 5)
  if (msg.content.includes("grade!!")) {
    var essaygrades = msg.content.split("!!");
    if (essays[essaygrades[1]] != null) {
      if (essays[essaygrades[1]][3].user.tag == msg.author.tag) {
        if (essaygrades[2] <= 10 && essaygrades[2] >=0){
          essays[essaygrades[1]][4] = essaygrades[2];
          msg.channel.send("your grade has been submitted");
        }
        else {
          msg.channel.send("grades must be between 0 and 10");
        }
      }
    }
  }
});

client.login(process.env.TOKEN);
