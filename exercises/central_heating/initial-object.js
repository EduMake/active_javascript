function calcBoilerStatus(AirTemp) {
    if(this.AirTemp < this.MinTemp) {
        this.status = "ON";
    } else {
        
    }
    return this.status;
}

function loop() {
    boiler.MinTemp = INPUT("mintemp");
    boiler.MaxTemp = INPUT("maxtemp");
    var AirTemp = GET("airtemp");
    var BoilerStatus = boiler.calcBoilerStatus(AirTemp);
    OUTPUT("boiler", BoilerStatus);
}

