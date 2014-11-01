function calcBoilerStatus(MinTemp, MaxTemp, AirTemp, Status) {
    if(AirTemp < MinTemp) {
        Status = "ON";
    } else {
        //Your code should go here
    }
    return Status;
}

function loop() {
    MinTemp = INPUT("mintemp");
    MaxTemp = INPUT("maxtemp");
    AirTemp = GET("airtemp");
    OldStatus = GET("boiler");
    Boiler = calcBoilerStatus(MinTemp, MaxTemp, AirTemp, OldStatus);
    OUTPUT("boiler", Boiler);
}

