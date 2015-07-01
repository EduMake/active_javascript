assert( PlainTextContainsWords("ATTACK AT DAWN"),  'Should find a word on its list in "ATTACK AT DAWN"', "data");

assert( PlainTextContainsWords("TBRFMDHXCBOHTGH") == false,  'Should not find a word on its list in "TBRFMDHXCBOHTGH"', "data");

assert( MakeCaesarCypherAlphabet(15) == "PQRSTUVWXYZ_ABCDEFGHIJKLMNO",
  'CypherAlphabet for setting 15 should be "PQRSTUVWXYZ_ABCDEFGHIJKLMNO"', "logic");

assert( FindNextPossibleSetting(0, "PHHPRZOPHOSPKB") == 15,  'Should find possible Setting of 15 with Cypher Text of "PHHPRZOPHOSPKB"', "logic");

