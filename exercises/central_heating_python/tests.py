GCSEtest({
  "text":'Boiler should turn ON when too cold.',
  "func": calcBoilerStatus,
  "type":"logic",
  "input_type":"valid",
  "inputs":[19, 22, 18, "OFF"],
  "expected":"ON",
  "task":1
})

GCSEtest({
  "text":'Boiler should turn OFF when too hot.',
  "func": calcBoilerStatus,
  "type":"logic",
  "input_type":"valid",
  "inputs":[19, 22, 23, "ON"],
  "expected":"OFF",
  "task":2
})

GCSEtest({
  "text":'Boiler should stay ON  when temp is OK.',
  "func": calcBoilerStatus,
  "type":"logic",
  "input_type":"valid",
  "inputs":[19, 22, 20, "ON"],
  "expected":"ON",
  "task":3
})

GCSEtest({
  "text":'Boiler should stay OFF when temp is OK.',
  "func": calcBoilerStatus,
  "type":"logic",
  "input_type":"valid",
  "inputs":[19, 22, 20, "OFF"],
  "expected":"OFF",
  "task":4
})
