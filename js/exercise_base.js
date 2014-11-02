
// Boo Hiss Globals.
var iTestCount = 0;
var iTestSuccesses = 0;
var intervalID = 0;
var currentExercise = 0;

// assert for testing
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
    
        
    var setExercise = function(iX, force) {
        var currExercise = aExercises[iX];
        currentExercise = iX;
        if(typeof force === "undefined") {
            force = false;
        }
        
        $("title").text("Active Javascript : " + currExercise.name);
        $("h1").text("Active Javascript : " + currExercise.name);
        $("#task").load("exercises/"+currExercise.folder+"/task.html");    
        $("#simulation").load("exercises/"+currExercise.folder+"/simulation.html");
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        $("#next").hide();
        
        var sStored = localStorage.getItem("code_"+currExercise.folder);
        console.log("sStored =", sStored);
        if(sStored && !force)
        {
             editor.setValue(sStored); // or session.setValue
             editor.navigateFileStart();
            
        } else {
            $.get("exercises/"+currExercise.folder+"/initial.js", {}, function(data){   
                 editor.setValue(data); // or session.setValue
                 editor.navigateFileStart();
            }, "html");
        }
        $("#run").off("click").click(function(){
            $("#output").html("");
            $("#testoutput").html("");
            $("#result").html("");
            
            var sExerciseHash = window.location.hash.replace("#","");
            var code = editor.getValue();
            localStorage.setItem("code_"+sExerciseHash, code);
    
            $.get("exercises/"+currExercise.folder+"/tests.js", {}, function(testscript){
                    
                $.get("exercises/"+currExercise.folder+"/context.js", {}, function(contextscript){
                    window.clearInterval(intervalID);
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
                        
                        if(!defaultStatement.actor.mbox.length) {
                            var lastgasp = prompt("Your school email address", "");
                            field.value = lastgasp;
                            localStorage.setItem("tincan_mbox", lastgasp);
                            defaultStatement.actor.mbox = lastgasp;
                        }             
                        
                        //console.log("endStatement =", endStatement);
                        if(defaultStatement.actor.mbox.length) {
                            tincan.sendStatement(endStatement);
                        }        
                        
                        var sExtra = "";
                        var next = currentExercise + 1;
                        console.log("next =", next);
                        if(next < aExercises.length) {
                            //sExtra = "<a href='#"+aExercises[next].folder+"'>Next</a>";
                            var newHash = "#"+aExercises[next].folder;
                            $("#next").attr("href", newHash);
                            
                            $("#next").off("click").click(function(){
                                 setExercise(next);
                            }).show();
                            
                        } else if (next === aExercises.length) {
                            sExtra = "<h2>You have finished</h2>"
                        }
                        
                        $("#result").html("Well done. Your code passed all the tests.<br>"+sExtra);
                    } else {
                        $("#result").html("Please Try Again : Check the test results to work out what to do.");
                    
                    }
                    
                }, "html");
                
            }, "html");
        });
    };
    
    $("#reset").click(function(){
        var sExerciseHash = window.location.hash.replace("#","");
        var iExercise = findExercise(sExerciseHash);
        setExercise(iExercise, true);
    });
    
    $("#reload").click(function(){
        var sExerciseHash = window.location.hash.replace("#","");
        var iExercise = findExercise(sExerciseHash);
        setExercise(iExercise);
    });
    
    
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
        setExercise(iNew);
    });
    
    var sExerciseHash = window.location.hash.replace("#","");
    
    var iExercise = findExercise(sExerciseHash);
    setExercise(iExercise);
    
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
