
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


function main(){
//CODE//
}

//TESTS//


function run() {
    stop();
    $("#output").html("");
    main();
}


$("#start").click(run);
//$("#stop").click(stop);
main();

