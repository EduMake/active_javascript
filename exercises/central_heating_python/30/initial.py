def calcBoilerStatus(MinTemp, MaxTemp, AirTemp, Status) :
    if(AirTemp < MinTemp) :
        Status = "ON"
    else : 
        if(AirTemp > MaxTemp) :
            Status = "OFF"
    return Stratus