def calcBoilerStatus(MinTemp, MaxTemp, AirTemp, Status) :
    if(AirTemp < MinTemp) :
        Status = "ON"
    else : 
        if(AirTemp < MinTemp) :
            Status = "OFF"
return Status

