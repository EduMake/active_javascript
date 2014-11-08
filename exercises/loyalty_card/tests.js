assert( calcDiscount(50, "No") == 0,  '£50  and LoyaltyCard="No" should mean No Discount (0%))', "logic");
assert( calcDiscount(50, "Yes") == 10,  '£50 and LoyaltyCard="Yes" should mean 10% Discount', "logic");
assert( calcDiscount(150, "No") == 5,  '£150 and LoyaltyCard="No" should mean  5% Discount', "logic");
assert( calcDiscount(150, "Yes") == 15,  '£150 and LoyaltyCard="Yes" should mean 15% Discount', "logic");
