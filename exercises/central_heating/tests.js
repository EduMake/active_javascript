assert( calcBoilerStatus(19, 22, 18, "OFF") == "ON",  'Boiler should turn ON when too cold.', "logic");

assert( calcBoilerStatus(19, 22, 23, "ON") == "OFF", 'Boiler should turn OFF when too hot.', "logic");

assert( calcBoilerStatus(19, 22, 20, "ON") == "ON", 'Boiler should stay ON  when temp is OK.', "logic");

assert( calcBoilerStatus(19, 22, 20, "OFF") == "OFF", 'Boiler should stay OFF when temp is OK.', "logic");

