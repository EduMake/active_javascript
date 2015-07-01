$("#matchesfound").hide();
    
    var autoAction = function() {
        var sMode = $("#mode").val();
        if(sMode == "Encrypt") {
            getEncrypted();
        } else if(sMode == "Decrypt") {
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
        //testPlainText();
    };
    
    var testPlainText = function () {
        var aWords = $("#testwords").val().split(" ");
        var oReg = new RegExp(aWords.join("|"));
        var sPlainText = $("#plaintext").val();
        
        if(oReg.test(sPlainText)) {
           $("#matchesfound").show();
           return true;
        } else {
           $("#matchesfound").hide();
           return false;
        } 
    };
    
    $("#caesar_setting").on("input", makeCaesarCypher);
    
    $("#plaintext").on("input", getEncrypted);
    
    $("#plaintext").on("input", getEncrypted);
    $("#cyphertext").on("input", getDecrypted);
    
    $("#cypheralphabet").on("input", autoAction);
    
    $(".getEncrypted").click(getEncrypted);
    $(".decrypt").click(getDecrypted);
    
    makeCaesarCypher();
    
//TESTS//
    
    
