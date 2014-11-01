
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


var MinTemp = INPUT("mintemp");
var MaxTemp = INPUT("maxtemp");
var AirTemp = GET("airtemp");
var Boiler = GET("boiler");


//CODE//



function _loop(){
    loop();

    if (Boiler === "ON")
    {
        AirTemp ++;
        $("#airtemp").val( AirTemp);
    }
    else
    {
        if( AirTemp > -5)
        {
            AirTemp --;
            $("#airtemp").val( AirTemp );
        }
        else
        {
            OUTPUT("You are frozen solid!!!");
            stop();
        }
    }
    if( AirTemp >= 50)
    {
      OUTPUT("House on Fire!!!");
      stop();
    }
}

function main(){
  intervalID = window.setInterval(_loop, 1000);
}

function run() {
    $("#output").html("");
    main();
}

function stop(){
    window.clearInterval(intervalID);
}


$( document ).ready(function() {
    $("#start").click(run);
    $("#stop").click(stop);
    main();
});

