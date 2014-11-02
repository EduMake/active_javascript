function calcDiscount(Spend, LoyaltyCard) {
    var Discount = 0;
    if (Spend > 100) {
        if (LoyaltyCard === "Yes") {
            Discount = 20;
        } else {
            Discount = 5;
        }
    } else {

    }

    return Discount;
}


