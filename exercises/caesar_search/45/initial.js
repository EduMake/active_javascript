/*global PlainTextAlphabet Decrypt */ //The PlainTextAlphabet and Decrypt functions are already written 

//Checks whether the PlainText we have produced contains common words 
//Returns true if found false if not
function PlainTextContainsWords(PlainText) {
    var Words = ["THE", "at", "CANON"]; //Common word list (add more)
    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    var Pattern = Words.join("|"); // "THE|at|CANON"
    var PatternMatcher = new RegExp(Pattern); //Makes a Pattern Matcher using the Pattern 
    var MatchFound = PatternMatcher.test(PlainText); //true if the plain text contains a match
              //must return MatchFound 
}

//Returns the CypherAlphabet (the outer ring) for the given Setting
var MakeCaesarCypherAlphabet = function(Setting) {
    Setting = Setting % PlainTextAlphabet.length; // Make it so Setting can't ever point outside our Alphabet by using % (remainders)
    var Start =  .slice(0, Setting); //Get first Setting Letters of Our PlainTextAlphabet
    var End =  .slice(Setting); // Get the rest of the end of PlainTextAlphabet
    var CypherAlphabet = ; //New CypherAlphabet is the End (Setting characters ) then the Start  
             //must return CypherAlphabet 
};

//Trys to find a Setting which Decrypts the CypherText into PlainText which passes PlainTextContainsWordsing
//Returns the Setting number if successful and false if it couldn't find anything
function FindNextPossibleSetting(StartSetting, CypherText) {
    var Setting = StartSetting; //Set the first Setting to check to StartSetting (so the continue button works and we can check out different possiblities)
    while(Setting <= PlainTextAlphabet.length) { //Go until run out of possible Settings
                 //MakeCaesarCypherAlphabet for our current attempted Setting
        var PlainText = Decrypt(PlainTextAlphabet, SettingAlphabet, CypherText); //Try Decrypting the CypherText
                 //Does the PlainText have reconginable words in it
        if(SomeWordsMatch) {
            return Setting; //Found a match, send the Setting back to process
        }
        Setting ++; // Not found so increase the setting by 1
    }
    return false; //If we got all the way to the end of the possible Setting send back false;
}
