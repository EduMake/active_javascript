function INPUT(ControlName) {
    var ele = $("#" + ControlName);
    if(ele.prop("tagName") === "SPAN") {
        return ele.html();
    } else {
        return ele.val();
    }
}

function OUTPUT(Out, Val) {
    if(typeof Val === "undefined") {
        $("#output").append("<pre>" + Out + "</pre>");
    } else {
        var ele = $("#" + Out);
        if(ele.prop("tagName") === "SPAN") {
            ele.html(Val);
        } else {
            ele.val(Val);
        }
    }
}

function GET(ControlName) {
    return INPUT(ControlName);
}


function openWebOffLicence() {
    OUTPUT("Welcome to the Web Off Licence");
}

//CODE//


//TESTS//

function run() {
    $("#output").html("");
    main();
}

$("#start").click(run);
main();

