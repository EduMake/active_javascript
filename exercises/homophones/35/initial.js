var aHomophones = ["'ere", "ade", "aid", "aide", "air", "allowed", "aloud", "bare", "bear", "blew", "blue", "disc", "disk", "eyre", "fain", "fair", "fane", "fare", "fayre", "feign", "for", "fore", "four", "grate", "great", "heir", "miner", "minor", "moor", "more", "pair", "pare", "pear", "sign", "sine", "syne", "tare", "tear", "their", "there", "they’re", "wailer", "waler", "wear", "weather", "whaler", "where", "whether", "which", "witch"];

function findHomophones(aWords){
    var aHomophoneList = [];
    for(var i = 0; i < aWords.length; i++) {
        var sWord = aWords[i];
        if(isHomophone(sWord))
        {
            aHomophoneList.push(sWord);       
        }
    }
    return aHomophoneList;
}
    
function isHomophone(sWord){
    return aHomophones.indexOf(sWord) >= 0;
}


