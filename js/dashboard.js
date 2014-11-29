$( document ).ready(function() {
    
    
    var aExercises = [
        {
            name:"Calculating Area",
            folder:"area",
            tags:[]
        },
        {
            name:"Central Heating",
            folder:"central_heating",
            tags:[]
        },
        {
            name:"Loyalty Card",
            folder:"loyalty_card",
            tags:[]
        },
        
    ];
    
    //findExercise by name    
    var findExercise = function(sExerciseHash) {
        var iExercise = aExercises.findIndex(function(element, index, array) {
            return sExerciseHash === element.folder;
        });
        
        if(iExercise === -1) {
            iExercise = 0;
        }
        return iExercise;
    };
    
    //Make it so every call gets fresh info from server
    $.ajaxSetup( {cache:false} );
    
    var field = document.getElementById("tincanemail");
    
    if (localStorage.getItem("tincan_mbox")) {
        field.value = localStorage.getItem("tincan_mbox");
    }
    
    field.addEventListener("change", function() {
            localStorage.setItem("tincan_mbox", field.value);
            defaultStatement.actor.mbox = localStorage.getItem("tincan_mbox");
    });    
    
    tincan = new TinCan (
        {
            recordStores: TinCanRecordStores
        }
    );
    
    var thispage = window.location.href;
    console.log("thispage =", thispage);
    var thissite = thispage.replace("dashboard\.html","");
    console.log("thissite =", thissite);

    tincan.getStatements(
        {
            
            //https://rusticisoftware.github.io/TinCanJS/doc/api/latest/classes/TinCan.LRS.html#method_queryStatements
            // 'params' is passed through to TinCan.LRS.queryStatements
            params: {
                since: "2013-08-29 07:42:10CDT", 
                verb: {id:"http://adlnet.gov/expapi/verbs/completed"},
                activity:{id:thissite},
            },
            callback: function (err, result) {
                // 'err' will be null on success
                if (err !== null) {
                    // handle error
                    return;
                }
    
                // handle success, 'result' is a TinCan.StatementsResult object
                console.log(result);
            }
        }
    );

});
