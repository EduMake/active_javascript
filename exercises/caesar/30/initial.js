var Encrypt = function(Alphabet, SubstitutionAlphabet, PlainText) {
    var OutputText = ""; //We start with no letters in our output
    
    //The variable i will go up from 0 (pointing to the first letter)
    //until i = the length of our plain text (pointing to the last letter in our plain text)
    for(var i = 0 ; i < PlainText.length; i++) { 
        var PlainTextLetter = PlainText[i]; //The letter we want to Encypher this time
        var Position = Alphabet.search(PlainTextLetter); //Finds what position our Letter is in our Alphabet
        if(Position === -1) { //If we didn't find the letter in our Alphabet
            Position = Alphabet.search("_"); //Find "_" instead
        }
        var EncypheredLetter = SubstitutionAlphabet[Position]; //Look up that position in our Substitution Alphabet
        OutputText += EncypheredLetter; //Add our Encyphered Letter to the OutputText
    }
    return OutputText; //Send it back
};

var Decrypt = function(Alphabet, SubstitutionAlphabet, EncypheredText) {
    var OutputText = ""; //We start with no letters in our output
    
    //The variable i will go up from 0 (pointing to the first letter)
    //until i = the length of our encyphered text (pointing to the last letter in our encyphered text)
    for(var i = 0 ; i < EncypheredText.length; i++) { 
        var EncypheredTextLetter = EncypheredText[i; //The letter we want to Encypher this time
        var Position = SubstitutionAlphabet.search(EncypheredTextLetter); //Finds what position our Letter is in our SubstitutionAlphabet
        var PlainTextLetter = Alphabet[Position]; //Look up that position in our Plain text Alphabet
        OutputText += PlainTextLetter; //Add our Plain Text Letter to the OutputText
    }
    return OutputText; //Send it back


