$("#matchesfound").hide();
    
    var autoAction = function() {
        //getDecrypted();
    };
    
    var PlainTextAlphabet = $("#alphabet").text();
    
    var makeCaesarCypher = function() {
        var iCaesarSetting = $("#caesar_setting").val();
        $("#cypheralphabet").text(MakeCaesarCypherAlphabet(iCaesarSetting));
        autoAction();
    };
    
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
        var CypherLetter = SubstitutionAlphabet[Position]; //Look up that position in our Substitution Alphabet
        OutputText += CypherLetter; //Add our Cypher Letter to the OutputText
    }
    return OutputText; //Send it back
};

var Decrypt = function(Alphabet, SubstitutionAlphabet, CypherText) {
    var OutputText = ""; //We start with no letters in our output
    
    //The variable i will go up from 0 (pointing to the first letter)
    //until i = the length of our cypher text (pointing to the last letter in our cypher text)
    for(var i = 0 ; i < CypherText.length; i++) { 
        var CypherTextLetter = CypherText[i]; //The letter we want to Encypher this time
        var Position = SubstitutionAlphabet.search(CypherTextLetter); //Finds what position our Letter is in our SubstitutionAlphabet
        var PlainTextLetter = Alphabet[Position]; //Look up that position in our Plain text Alphabet
        OutputText += PlainTextLetter; //Add our Plain Text Letter to the OutputText
    }
    return OutputText; //Send it back
};

    
    var getEncrypted = function() {
        var sIn = $("#plaintext").val();
        var sAlphabet = $("#alphabet").text(); 
        var sCypher = $("#cypheralphabet").text();
        var sCypherText = "";
        if(sAlphabet.length !== sCypher.length)
        {
            sCypherText = "Cypher Too Short";
        } else {
            sCypherText = Encrypt(sAlphabet, sCypher, sIn);
        }
        $("#cyphertext").val(sCypherText);    
    };

    var getDecrypted = function() {
        var sAlphabet = $("#alphabet").text(); 
        var sIn = $("#cyphertext").val();
        var sCypher = $("#cypheralphabet").text();
        var sPlainText = Decrypt(sAlphabet, sCypher, sIn);
        $("#plaintext").val(sPlainText);
        //testPlainText();
    };
    
    
    
    var testPlainText = function () {
        var sPlainText = $("#plaintext").val();
        
        if(PlainTextContainsWords(sPlainText)) {
           $("#matchesfound").show();
           return true;
        } else {
           $("#matchesfound").hide();
           return false;
        } 
    };
    
    $("#caesar_setting").on("input", makeCaesarCypher);
    
    //$("#plaintext").on("input", getEncrypted);
    $("#cyphertext").on("input", getDecrypted);
    
    $("#cypheralphabet").on("input", autoAction);
    
    $(".getEncrypted").click(getEncrypted);
    $(".decrypt").click(getDecrypted);

    
//CODE//    

    
    function search(){
        var iSetting = FindNextPossibleSetting($("#caesar_setting").val(), $("#cyphertext").val());
        if(iSetting  === false) {
            $("#searchresult").text("Search found no matching words");
        } else {
          $("#caesar_setting").val(iSetting);
          makeCaesarCypher();
          $("#searchresult").text("Words found with Setting of "+iSetting );
        }
    }
    
    function search_start(){
        $("#caesar_setting").val(0);
        makeCaesarCypher();
        search();
    }
    
    $("#search").click(search_start);
    $("#continue_search").click(search);
    
    makeCaesarCypher();
    
//TESTS//
    
    
