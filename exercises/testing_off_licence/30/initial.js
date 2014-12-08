/*globals INPUT OUTPUT openWebOffLicence */
function getValidInteger(AGE)
{
    if(/[0-9]+/.test(AGE)) {
        return parseInt(AGE, 10);
    }
    OUTPUT("warning", "Not a Valid Number");
    return false;
}

function isValidAge(AGE)
{   
    if(AGE <= 2 || AGE >= 150) {
        OUTPUT("warning", "Not a Valid Age");
        return false;
    } else if(AGE < 18) {
        OUTPUT("warning", "Not Old enough to drink");
        return false;
    }
    return true;
}

function main() {
    var AGE = getValidInteger(INPUT("age"));
    if (AGE !== false) {
        if (isValidAge(AGE)) {
            openWebOffLicence();
        }
    }
}
