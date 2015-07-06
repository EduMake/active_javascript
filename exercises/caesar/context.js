$("#matchesfound").hide();

//CODE//    

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
};

var autoAction = function() {
    var sMode = $("#mode").val();
    if(sMode === "Encrypt") {
        getEncrypted();
    } else if(sMode === "Decrypt") {
        getDecrypted();
    }
};

var makeCaesarCypher = function() {
    var sAlphabet = $("#alphabet").text();
    var iCaesarSetting = $("#caesar_setting").val() % sAlphabet.length;
    var sStart =  sAlphabet.slice(0, iCaesarSetting);
    var sEnd =  sAlphabet.slice(iCaesarSetting);
    var sNew = sEnd + sStart;
    $("#cypheralphabet").text(sNew);
    autoAction();
};
    
$("#caesar_setting").on("input", makeCaesarCypher);

$("#plaintext").on("input", getEncrypted);
$("#cyphertext").on("input", getDecrypted);

$("#cypheralphabet").on("input", autoAction);

$(".encrypt").click(getEncrypted);
$(".decrypt").click(getDecrypted);

makeCaesarCypher();
    
//TESTS//

