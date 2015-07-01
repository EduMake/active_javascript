/*global PlainTextAlphabet Decrypt */ //The PlainTextAlphabet and Decrypt functions are already written 

//Checks whether the PlainText we have produced contains common words 
//Returns true if found false if not
function PlainTextContainsWords(PlainText) {
    var Words = ["THE", "at", "CANON"]; //Common word list (add more)
    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    var Pattern = Words.join("|"); // "THE|at|CANON"
    var PatternMatcher = new RegExp(Pattern); //Makes a Pattern Matcher using the Pattern 
    var MatchFound = PatternMatcher.test(PlainText); //true if the plain text contains a match
    return MatchFound;
}

//Returns the CypherAlphabet (the outer ring) for the given Setting
var MakeCaesarCypherAlphabet = function(Setting) {
    Setting = Setting % PlainTextAlphabet.length; // Make it so Setting can't ever point outside our Alphabet by using % (remainders)
    var Start =  PlainTextAlphabet.slice(0, Setting); //Get first Setting Letters of Our Alphabet
    var End =  PlainTextAlphabet.slice(Setting); // Get the rest of the end of Alphabet
    var CypherAlphabet = End + End; //New Alphabet is the End then the Start
    return CypherAlphabet;
};

//Trys to find a Setting which Decrypts the CypherText into PlainText which passes PlainTextContainsWordsing
//Returns the Setting number if successful and false if it couldn't find anything
function FindNextPossibleSetting(StartSetting, CypherText) {
    var Setting = StartSetting; //Set the first Setting to check to StartSetting (so the continue button works and we can check out different possiblities)
    while(Setting <= PlainTextAlphabet.length) { //Go until run out of possible Settings
        var SettingAlphabet = MakeCaesarCypherAlphabet(Setting); //Get the CypherAlphabet for our current attempted setting
        var PlainText = Decrypt(PlainTextAlphabet, SettingAlphabet, CypherText); //Try Decrypting the CypherText
        var SomeWordsMatch =  PlainTextContainsWords(PlainText); //Does the PlainText have reconginable words in it
        if(SomeWordsMatch) {
            return Setting; //Found a match, send the Setting back to process
        }
        Setting ++; // Not found so increase the setting by 1
    }
    return "None Found"; //If we got all the way to the end of the possible Setting send back false;
}
