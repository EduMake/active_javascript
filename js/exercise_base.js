
var iTestCount = 0;
var iTestSuccesses = 0;


function assert( outcome, description ) {
    
    iTestCount ++;
    var li = document.createElement('li');
    li.className = outcome ? 'pass' : 'fail';
    if(outcome) {
        iTestSuccesses ++;
    }
    li.appendChild( document.createTextNode( description ) ); 
    var eOut = $("#testoutput");
    eOut.append(li);
} 

$( document ).ready(function() {
   
    var findExercise = function(sExerciseHash) {
        var iExercise = aExercises.findIndex(function isPrime(element, index, array) {
            return sExerciseHash === element.folder;
        });
        
        if(iExercise === -1) {
            iExercise = 0;
        }
        return iExercise;
    };
    
    $.ajaxSetup( {cache:false} )
        
    var setExercise = function(currExercise) {
        $("title").text("Active Javascript : " + currExercise.name);
        $("h1").text("Active Javascript : " + currExercise.name);
        $("#task").load("exercises/"+currExercise.folder+"/task.html");    
        $("#simulation").load("exercises/"+currExercise.folder+"/simulation.html");
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        
        $.get("exercises/"+currExercise.folder+"/initial.js", {}, function(data){
             editor.setValue(data); // or session.setValue
             editor.clearSelection();//gotoLine(0);
        }, "html");
        
        $("#run").off("click").click(function(){
            $("#output").html("");
            $("#testoutput").html("");
            $("#result").html("");
            
            $.get("exercises/"+currExercise.folder+"/tests.js", {}, function(testscript){
                    
                $.get("exercises/"+currExercise.folder+"/context.js", {}, function(contextscript){
                    var newcode = editor.getValue();
                    
                    script = "iTestSuccesses = 0;\niTestCount = 0;\n\n";
                    script +=  contextscript.replace("//CODE//", newcode);
                    script += "\n\n"+testscript+"\n\nreturn iTestSuccesses / iTestCount;";
                    
                    var code = new Function(script);
                    //console.log(script);
                    
                    var iScore = code();
                    //console.log("iScore =", iScore);
                    if(iScore === 1) {
                        var endStatement = defaultStatement;    
                        endStatement.verb = {
                             "id": "http://adlnet.gov/expapi/verbs/completed",
                             "display": {"en-GB": "completed"}
                        };
                
                        endStatement.result = {
                            "completion": true,
                            "success": true,
                            "score": {
                                "scaled": 1
                            }
                        };
                        
                        //console.log("endStatement =", endStatement);
                        if(defaultStatement.actor.mbox.length) {
                            tincan.sendStatement(endStatement);
                        }                
                        
                        $("#result").html("Well done. Your code passed all the tests.");
                    } else {
                        $("#result").html("Please Try Again : Check the test results to work out what to do.");
                    
                    }
                    
                }, "html");
                
            }, "html");
        });
    };
    
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
        }
    ];
    
    aExercises.forEach(function logArrayElements(element, index, array) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = "#"+element.folder;
        a.appendChild( document.createTextNode( element.name ) ); 
        
        li.appendChild( a ); 
        var eList = $("#exercise_list");
        eList.append(li);
    });

    var listitems = $("#exercise_list li a");
    listitems.off("click").click(function(){
        var parts = this.href.split("#");
        var iNew = findExercise(parts[1]);
        setExercise(aExercises[iNew]);
    });
    
    var sExerciseHash = window.location.hash.replace("#","");
    
    var iExercise = findExercise(sExerciseHash);
    setExercise(aExercises[iExercise]);
    
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
                recordStores: [{
                    endpoint: "http://lrs.edumake.org/data/xAPI/",
                    username: "77d48e666c68b18b8817bcdfbec4363d3571730b",
                    password: "a26c0ce065135e5ac08fc2a3161546bf069c282f",
                    allowFail: false
                }]
            }
        );
 
    
    
    var defaultStatement = {
        actor: {
            mbox: ""
        },
        verb: {
            id: "http://adlnet.gov/expapi/verbs/initialized",
            "display": {"en-GB": "initialised"}
        },
        target: { //Object ???
            id: window.location.href,
            type: "http://adlnet.gov/expapi/activities/simulation",
            definition: {
                name: { "en-GB": $("title").text() }
            }
        }
    };
    
    if(localStorage.getItem("tincan_mbox")){
        defaultStatement.actor.mbox = localStorage.getItem("tincan_mbox");
    }    
        
    if(defaultStatement.actor.mbox.length) {
        tincan.sendStatement(defaultStatement);
    }
    
});
