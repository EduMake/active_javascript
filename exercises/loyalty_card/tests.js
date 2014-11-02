assert( calcDiscount(50, "No") == 0,  '£50  = No Discount');
assert( calcDiscount(50, "Yes") == 10,  '£50 and Loyalty Card = 10% Discount');
assert( calcDiscount(150, "No") == 5,  '£150 = 5% Discount');
assert( calcDiscount(150, "Yes") == 15,  '£150 and Loyalty Card = 15% Discount');
