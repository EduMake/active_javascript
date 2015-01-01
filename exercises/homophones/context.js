
function INPUT(ControlName) {
    return $("#" + ControlName).val();
    
}

function OUTPUT(Out, Val) {
    if(typeof Val === "undefined")
    {
        $("#output").append("<pre>" + Out + "</pre>");
    }
    else
    {
        $("#" + Out).val(Val);
    }
}

function GET(ControlName) {
    return $("#" + ControlName).val();
}

//var MinTemp = INPUT("mintemp");


//CODE//


//TESTS//


function findHomophones2(aWords){
    return aWords.filter(isHomophone);
}


function main() {
    var sText = $("#text").html().trim([" ","\n"]);    
    var aWords = sText.split(/\W/);
    
    var aFoundWords =  findHomophones(aWords);

    for(var i = 0; i < aFoundWords.length; i++) {
        var sWord = aFoundWords[i];
        //var sPattern = new RegExp("\W"+sWord+"\W"
        sText = sText.replace(sWord, '<span class="homophone">'+sWord+'</span>');
    }
    $("#text").html(sText);
}

function run() {
    stop();
    $("#output").html("");
    main();
}


$("#start").click(run);
//$("#stop").click(stop);
//main();

