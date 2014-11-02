assert( calcDiscount(50, "No") == 0,  '£50  and LoyaltyCard="No" means No Discount (0%))');
assert( calcDiscount(50, "Yes") == 10,  '£50 and LoyaltyCard="Yes" means 10% Discount');
assert( calcDiscount(150, "No") == 5,  '£150 and LoyaltyCard="No" means  5% Discount');
assert( calcDiscount(150, "Yes") == 15,  '£150 and LoyaltyCard="Yes" means 15% Discount');
