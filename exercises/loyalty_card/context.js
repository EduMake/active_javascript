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


//CODE//


function main() {
    OUTPUT("discount", calcDiscount(INPUT("spend"), INPUT("loyalty_card"))+"%");
}

$("#start").click(main);
