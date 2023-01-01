
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

$("#airtemp").val(26);
$("#boiler").val("OFF");
var MinTemp = INPUT("mintemp");
var MaxTemp = INPUT("maxtemp");
var AirTemp = GET("airtemp");
var Boiler = GET("boiler");


//CODE//



function loop() {
    MinTemp = INPUT("mintemp");
    MaxTemp = INPUT("maxtemp");
    AirTemp = GET("airtemp");
    OldStatus = GET("boiler");
    Boiler = calcBoilerStatus(MinTemp, MaxTemp, AirTemp, OldStatus);
    OUTPUT("boiler", Boiler);
}



function stop(){
    window.clearInterval(intervalID);
}


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
    stop();
    $("#output").html("");
    main();
}

//TESTS//

$("#start").click(run);
$("#stop").click(stop);
main();

