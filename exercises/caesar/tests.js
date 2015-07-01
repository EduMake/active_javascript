assert( Encrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "KLMNOPQRSTUVWXYZ_ABCDEFGHIJ", "ENCRYPTION_TEST") == "OXMAHZCSYXJCOBC",  'Should encrypt "ENCRYPTION_TEST" with setting=10 to "OXMAHZCSYXJCOBC"', "logic");

assert( Encrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "PQRSTUVWXYZ_ABCDEFGHIJKLMNO", "ENCRYPTION_TEST") == "TBRFMDHXCBOHTGH",  'Should encrypt "ENCRYPTION_TEST" with setting=15 to "TBRFMDHXCBOHTGH"', "logic");

assert( Decrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "KLMNOPQRSTUVWXYZ_ABCDEFGHIJ", "OXMAHZCSYXJCOBC") == "ENCRYPTION_TEST",  'Should decrypt "OXMAHZCSYXJCOBC" with setting=10 to "ENCRYPTION_TEST"', "logic");

assert( Decrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ_", "PQRSTUVWXYZ_ABCDEFGHIJKLMNO", "TBRFMDHXCBOHTGH") == "ENCRYPTION_TEST",  'Should decrypt "TBRFMDHXCBOHTGH" with setting=15 to "ENCRYPTION_TEST"', "logic");

