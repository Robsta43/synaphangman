var restify = require('restify');
var builder = require('botbuilder');
var State = 0; // 0 = not active; 1 = active
var TargetWord = "Synaptop";
var CurrentKnowledge = "________";
var Guesses = 6;
var LettersGuessed = "";

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.5d22d49c-0ac7-4b8b-b2dc-ea2506fa2173,
    appPassword: process.env.kn8QLodcHkwMuCg1ngd87bj
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) 
{
	//session.send("%s", State);
	switch(State)
	{
	case 1:
		session.send("%s", GuessTime(session.message.text));
		break;
	case 0:
		if(session.message.text == "hangman")
		{	session.send("%s", StartHangman());
			session.send("Here's a clue: %s", CurrentKnowledge);
		}
		break;
	}
});

function StartHangman()
{	// These are the steps to set up a new hangman game.
	State = 1;
	Guesses = 6;
	LettersGuessed = "";
	
	// Generate a word that the players must guess
	GenerateTargetWord();

	// To fill in current knowledge, we need to make a string which is underscores for every letter, and spaces for every space.
	CurrentKnowledge = "";
	for(var i = 0; i < TargetWord.length; i++)
	{	if(TargetWord.charAt(i) == " ")
			CurrentKnowledge += " ";
		else if(TargetWord.charAt(i) == ".")
			CurrentKnowledge += ".";
		else if(TargetWord.charAt(i) == "!")
			CurrentKnowledge += "!";
		else if(TargetWord.charAt(i) == "?")
			CurrentKnowledge += "?";
		else
			CurrentKnowledge += "_";
	}
	
	return "You've started a new game of hangman!  Type a letter to guess it.  Type 'end game' to end the game.";
}

function GuessTime(input)
{	var NumberFound;
	
	if(input == "end game")
	{	State = 0;
		return("You've ended the game of hangman.  Type the word 'hangman' to started a new game!");
	}	
	else //if(input.length == 1)
	{	NumberFound = InWord(input);
		LettersGuessed += " " + input;
		if(CurrentKnowledge == TargetWord)
		{	State = 0;
			return("You guessed " + CurrentKnowledge + " correctly!  Congratulations!");
		}
		else if(NumberFound > 1)
			return("There were " + NumberFound + " " + input + "'s in the phrase.  \n" + CurrentKnowledge + "\n Guesses: " + LettersGuessed);
		else if(NumberFound > 0)
			return("There was 1 " + input + " in the phrase.  \n" + CurrentKnowledge + "\n Letters Guessed: " + LettersGuessed);
		else
		{	Guesses--;
			if(Guesses > 0)
				return(input + " does not exist in the phrase.  You have " + Guesses + " Guesses left.\n Guesses: " + LettersGuessed);
			else
			{	State = 0;
				return("You lose; you have have run out of guesses.\n Type 'hangman' to started a new game.")
			}
		}
	}
}

function InWord(input)
{	var Result = 0;
	var Pos = 0;

	while(true)
	{	Pos = TargetWord.toLowerCase().indexOf(input.toLowerCase(), Pos);
		if(Pos >= 0)
		{	CurrentKnowledge = CurrentKnowledge.replaceAt(Pos, TargetWord.substr(Pos, input.length));
			Result++;
			Pos++;
		}
		else
			break;
	}

	//if(TargetWord.localeCompare(input))
	//	Result = 1;
	
	

	return Result;
}


String.prototype.replaceAt=function(index, replacement) 
{	// Got this function from online; let's see how it works.
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function GenerateTargetWord()
{	// This function could be more advanced in the future; right now it just randomly picks from 11 preset words.  
	var RandomNumber = Math.floor((Math.random() * 11));
	switch(RandomNumber)
	{	case 0:
			TargetWord = "Cya live";
			break;
		case 1:
			TargetWord = "Synaptop";
			break;
		case 2:
			TargetWord = "Samitop";
			break;
		case 3:
			TargetWord = "Jane heir";
			break;
		case 4:
			TargetWord = "Real men wear pink";
			break;
		case 5:
			TargetWord = "Supercalifragilisticexpialidocious"
			break;
		case 6:
			TargetWord = "What is a man?";
			break;
		case 7:
			TargetWord = "Rabbithole";
			break;
		case 8:
			TargetWord = "All you need is love";
			break;
		case 9:
			TargetWord = "Have fun storming the castle!";
			break;
		case 10:
			TargetWord = "No.  I am your father";
			break;
	}
	
}