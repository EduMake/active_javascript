var Encrypt = function(PlainAlphabet, CypherAlphabet, PlainText) {
    var CypherText = ""; //We start with no letters in our output
    var Position = 0;
    while(Position < PlainText.length ) { 
        var PlainTextLetter = PlainText[Position]; //The letter we want to Encypher this time
        var LetterNum = PlainAlphabet.search(PlainTextLetter); //Finds what position our Letter is in our Alphabet
        CypherText = CypherText + CypherAlphabet[LetterNum];//Look up that position in our Substitution Alphabet and add our Cypher Letter to the OutputText
        Position = Position + 1;
    }
    return CypherText; //Send it back
};

var Decrypt = function(PlainAlphabet, CypherAlphabet, CypherText) {
    var PlainText = ""; //We start with no letters in our output
    var Position = 0;
    while(Position < CypherText.length ) { 
        var             = CypherText[Position]; //The letter we want to Decrypt this time
        var LetterNum = PlainAlphabet.search(CypherTextLetter); //Finds what position our Letter is in our Alphabet
        PlainText = PlainText +              ;//Look up that position in our Substitution Alphabet and add our Plain Letter to the OutputText
        Position = Position + 1;
    }
    return PlainText; //Send it back
};
