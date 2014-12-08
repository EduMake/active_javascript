
function testIsAgeValid(number, bExpectValid, sReg) {
    var bValid = isValidAge(number);
    if( bExpectValid !== bValid) {
        return false;
    }
    
    var sWarning = $("#warning").html();
    var regexObj = new RegExp(sReg, "i");
    var bRegResult = regexObj.test(sWarning);
    return bRegResult;
}

assert( testIsAgeValid(2, false, "Not a Valid Age"),  '2 is "Not a Valid Age"', "logic");
assert( testIsAgeValid(3, false, "Not old enough to drink"),  '3 is "Not old enough to drink"', "logic");
assert( testIsAgeValid(17, false, "Not old enough to drink"),  '17 is "Not old enough to drink"', "logic");
assert( testIsAgeValid(18, true, ""),  '18 is valid', "logic");
assert( testIsAgeValid(149, true, ""),  '149 is valid', "logic");
assert( testIsAgeValid(150, false, "Not a Valid Age"),  '150 is "Not a Valid Age"', "logic");
assert( testIsAgeValid(999999, false, "Not a Valid Age"),  '999999999 is "Not a Valid Age"', "logic");
assert( getValidInteger("ten") === false,  '"ten" is "Not a Valid Number"', "logic");
assert( getValidInteger(10) === 10,  '10 is "A Valid Number"', "logic");



