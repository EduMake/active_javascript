assert( Encrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "KLMNOPQRSTUVWXYZ_ABCDEFGHIJ", "ENCRYPTION TEST") == "OXMAHZCSYXJCOBC",  'Should encrypt "ENCRYPTION TEST" to "OXMAHZCSYXJCOBC"', "logic");

assert( Encrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "PQRSTUVWXYZ_ABCDEFGHIJKLMNO", "ENCRYPTION TEST") == "TBRFMDHXCBOHTGH",  'Should encrypt "ENCRYPTION TEST" to "TBRFMDHXCBOHTGH"', "logic");

assert( Decrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "KLMNOPQRSTUVWXYZ_ABCDEFGHIJ", "OXMAHZCSYXJCOBC") == "ENCRYPTION TEST",  'Should decrypt "OXMAHZCSYXJCOBC" to "ENCRYPTION TEST"', "logic");

assert( Decrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "PQRSTUVWXYZ_ABCDEFGHIJKLMNO", "TBRFMDHXCBOHTGH") == "ENCRYPTION TEST",  'Should decrypt "TBRFMDHXCBOHTGH" to "ENCRYPTION TEST"', "logic");

