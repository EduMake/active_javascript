assert( calcBoilerStatus(19, 22, 18, "OFF") == "ON",  'Boiler should turn ON when too cold.');
assert( calcBoilerStatus(19, 22, 23, "ON") == "OFF", 'Boiler should turn OFF when too hot.');

