/*global PlainTextAlphabet Decrypt */ //The PlainTextAlphabet and Decrypt functions are already written 
function PlainTextContainsWords(PlainText) {
    var Words = ["THE", "at", "CANON"]; //Words we are looking for
    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    var Pattern = Words.join("|"); // "THE|at|CANON"
    var PatternMatcher = new RegExp(Pattern); //Makes a Pattern Matcher using the Pattern 
    var MatchFound = PatternMatcher.test(PlainText); //true if the plain text contains a match
    return MatchFound;
}

var MakeCaesarCypherAlphabet = function(Setting) {
    console.log("Setting =", Setting);
    Setting = Setting % PlainTextAlphabet.length; // Make it so Setting can't ever point outside our Alphabet by using % (remainders)
    console.log("PlainTextAlphabet =", PlainTextAlphabet);
    var Start =  PlainTextAlphabet.slice(0, Setting); //Get first Setting Letters of Our Alphabet
    var End =  PlainTextAlphabet.slice(Setting); // Get the rest of the end of Alphabet
    var CypherAlphabet = End + Start; //New Alphabet is the End then the Start
    return CypherAlphabet;
};

function FindNextPossibleSetting(StartSetting, CypherText) {
  console.log("FindNextPossibleSetting StartSetting =", StartSetting);
    var Setting = StartSetting; //Start where we cant (so the continue button works and we can check out different possiblities)
    console.log("FindNextPossibleSetting Setting =", Setting);
    while(Setting <= PlainTextAlphabet.length) { //Go untill the end of the Alphabet
        var SettingAlphabet = MakeCaesarCypherAlphabet(Setting); 
        var PlainText = Decrypt(PlainTextAlphabet, SettingAlphabet, CypherText); //Try Decrypting the CypherText
        var SomeWordsMatch =  PlainTextContainsWords(PlainText); //Does the PlainText have reconginable words in it
        if(SomeWordsMatch) {
            return Setting; //Found a match, send the Setting back to process
        }
        Setting ++; // Not found so insrease the setting by one
    }
    return false; //If   we got all the way to the end of the possible Setting send back false;
}
