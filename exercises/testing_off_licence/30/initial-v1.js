/*globals INPUT OUTPUT openWebOffLicence */
function isAgeValid(AGE)
{
    console.log("AGE", AGE);
    if(typeof AGE !== "number") {
        return {valid:false, warning:"Not a Valid Number"};
    }
    if(AGE <= 2 || AGE >= 150) {
        return {valid:false, warning:"Not a Valid Age"};
    }
    if(AGE < 18) {
        return {valid:false, warning:"Not Old enough to drink"};
    }
    return {valid:true, warning:""};
}

function main() {
    var AGE = INPUT("age");
    if (isAgeValid(AGE)) {
        openWebOffLicence();
    }
}

