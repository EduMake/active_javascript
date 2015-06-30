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
        var iCaesarKey = $("#caesar_key").val() % sAlphabet.length;
        var sStart =  sAlphabet.slice(0, iCaesarKey);
        var sEnd =  sAlphabet.slice(iCaesarKey);
        var sNew = sEnd + sStart;
        $("#cypheralphabet").text(sNew);
        autoAction();
    };
    
//CODE//    
    
    var getEncrypted = function() {
        var sIn = $("#plaintext").val();
        var sAlphabet = $("#alphabet").text(); 
        var sCypher = $("#cypheralphabet").text();
        var sEncypheredText = "";
        if(sAlphabet.length !== sCypher.length)
        {
            sEncypheredText = "Cypher Too Short";
        } else {
            sEncypheredText = Encrypt(sAlphabet, sCypher, sIn);
        }
        $("#encypheredtext").val(sEncypheredText);    
    };

    var getDecrypted = function() {
        var sAlphabet = $("#alphabet").text(); 
        var sIn = $("#encypheredtext").val();
        var sCypher = $("#cypheralphabet").text();
        var sPlainText = Decrypt(sAlphabet, sCypher, sIn);
        $("#plaintext").val(sPlainText);
        //testPlainText();
    };
    
    var testPlainText = function () {
        var aWords = $("#testwords").val().split(" ");
        console.log("aWords =", aWords);
        var oReg = new RegExp(aWords.join("|"));
        console.log("oReg =", oReg);
        var sPlainText = $("#plaintext").val();
        console.log("sPlainText =", sPlainText);
        
        if(oReg.test(sPlainText)) {
           $("#matchesfound").show();
           return true;
        } else {
           $("#matchesfound").hide();
           return false;
        } 
    };
    
    $("#caesar_key").on("input", makeCaesarCypher);
    
    $("#plaintext").on("input", getEncrypted);
    
    $("#plaintext").on("input", getEncrypted);
    $("#encypheredtext").on("input", getDecrypted);
    
    $("#cypheralphabet").on("input", autoAction);
    
    $(".getEncrypted").click(getEncrypted);
    $(".decrypt").click(getDecrypted);
    /*
    var iSearchTimer = 0;
    function search(){
        if(testPlainText()) {
            clearTimeout(iSearchTimer);
            return true;
        }
        $("#caesar_key").val(parseInt($("#caesar_key").val()) + 1 );
        makeCaesarCypher();
        iSearchTimer = setTimeout(search, 1000);
    }
    function search_start(){
        $("#caesar_key").val(0);
        makeCaesarCypher();
        search();
    }
    
    $("#search").click(search_start);
    $("#continue_search").click(search);
    
    
    $("#testwords").on("input", testPlainText);
    */
    makeCaesarCypher();
    
//TESTS//
    
    
