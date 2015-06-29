var aHomophones = ["'ere", "ade", "aid", "aide", "air", "allowed", "aloud", "bare", "bare", "bear", "blew", "blue", "disc", "disk", "eyre", "fain", "fair", "fane", "fare", "fayre", "feign", "for", "fore", "four", "grate", "great", "heir", "miner", "minor", "moor", "more", "pair", "pare", "pear", "sign", "sine", "syne", "tare", "tear", "their", "there", "they’re", "wailer", "waler", "wear", "weather", "whaler", "where", "whether", "which", "witch"];

function findHomophones(aWords){
    var aHomophoneList = [];
    for(var i = 0; i < aWords.length; i++) {
        var sWord = aWords[i];
        if(isHomophone(sWord)) //if(aHomophones.indexOf(sWord) >= 0)
        {
            aHomophoneList.push(sWord);       
        }
    }
    return aHomophoneList;
}
    
function isHomophone(sWord){
    return aHomophones.indexOf(sWord) >= 0;
}

function findHomophones2(aWords){
    return aWords.filter(isHomophone);
}


function highlight() {
    var sText = $("#text").html().trim([" ", "\n"]);    
    var aWords = sText.toLowerCase().split(/\W/);
    
    var aFoundWords =  findHomophones(aWords);
    console.log(aFoundWords);
    for(var i = 0; i < aFoundWords.length; i++) {
        var sWord = aFoundWords[i];
        //var sPattern = new RegExp("\W"+sWord+"\W"
        sText = sText.replace(sWord, '<span class="homophone">'+sWord+'</span>');
    }
    $("#text").html(sText);
}


$("#start").click(highlight);
