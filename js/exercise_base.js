var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.getSession().setMode("ace/mode/javascript");
editor.setWrapBehavioursEnabled(true);
editor.setFontSize(16);
editor.setShowPrintMargin(false);

// Boo Hiss Globals.
var intervalID = 0;
var currentExercise = 0;


$( document ).ready(function() {
    var oExecuter;
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
        }
    ];
    
    //findExercise by name    
    var findExercise = function(sExerciseSearch) {
        var iExercise = aExercises.findIndex(function(element, index, array) {
            return sExerciseSearch === element.folder;
        });
        
        if(iExercise === -1) {
            iExercise = 0;
        }
        return iExercise;
    };
    
    //Make it so every call gets fresh info from server
    $.ajaxSetup( {cache:false} );
    
    var runCode = function(currExercise, bTest){
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        window.clearInterval(intervalID);
        
        //Auto save
        var code = editor.getValue();
        localStorage.setItem("code_"+currExercise.folder, code);
        
        oExecuter.setTest(bTest);
                
        oExecuter.execute();
        oExecuter.resultsToHTML();
        var aTinOut = oExecuter.resultsToTinCan();
        
        if(bTest) {
            // TODO : add attempt counts
            // TODO : send to tincan for every try
        }
        /*
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
                
                var sExtra = "";
                var next = currentExercise + 1;
                
                if(next < aExercises.length) {
                    //sExtra = "<a href='#"+aExercises[next].folder+"'>Next</a>";
                    var newSearch = "?"+aExercises[next].folder;
                    $("#next").attr("href", newSearch);
                    $("#next").on("click").click(function(){
                         setExercise(next, true);
                    }).show();
                    
                } else if (next === aExercises.length) {
                    sExtra = "<h2>You have finished</h2>"
                }
                
                $("#result").html("Well done. Your code passed all the tests.<br>"+sExtra);
                
                //console.log("endStatement =", endStatement);
                if(defaultStatement.actor.mbox.length) {
                    tincan.sendStatement(endStatement);
                }        
                
                
            } else {
                $("#result").html("Please Try Again : Check the test results to work out what to do.");
            }
        }*/
           
    };
        
    var setExercise = function(iX, fromstorage) {
        var currExercise = aExercises[iX];
        currentExercise = iX;
        if(typeof fromstorage === "undefined") {
            fromstorage = true;
        }
        
        $("title").text("Active Javascript : " + currExercise.name);
        $("h1").text("Active Javascript : " + currExercise.name);
        $("#task").load("exercises/"+currExercise.folder+"/task.html");    
        $("#simulation").load("exercises/"+currExercise.folder+"/simulation.html");
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        $("#next").hide();
        $("#start").on("click");
        
        var sStored = localStorage.getItem("code_"+currExercise.folder);
        //console.log("currExercise.folder =", currExercise.folder);
        
        
        $.get("exercises/"+currExercise.folder+"/tests.js", {}, function(testscript){
                oExecuter.setTestScript(testscript);
                
        }, "html");
                
        $.get("exercises/"+currExercise.folder+"/context.js", {}, function(contextscript){
                oExecuter.setContextScript(contextscript);
                
        }, "html");     
                    
        editor.getSession().on("changeAnnotation", function(){
            var annot = editor.getSession().getAnnotations();
            oExecuter.setAnnotations(annot);
        });
        
        if(sStored && fromstorage)
        {
             editor.setValue(sStored); // or session.setValue
             editor.navigateFileStart();
        } else {
            $.get("exercises/"+currExercise.folder+"/initial.js", {}, function(data){   
                 editor.setValue(data); // or session.setValue
                 editor.navigateFileStart();
            }, "html");
        }
        
        
        $("#run").on("click").click(function(){runCode(currExercise, false);});
        $("#runtest").on("click").click(function(){runCode(currExercise, true);});
        
        oExecuter = new Executer(); 
        oExecuter.setCode(editor.getValue());
        runCode(currExercise, false);
    };
    
    $("#reset").click(function(){
        var sExerciseSearch = window.location.search.replace("?","");
        var iExercise = findExercise(sExerciseSearch);
        setExercise(iExercise, false);
    });
    
    $("#reload").click(function(){
        var sExerciseSearch = window.location.search.replace("?","");
        var iExercise = findExercise(sExerciseSearch);
        setExercise(iExercise, true);
    });
    
    
    aExercises.forEach(function logArrayElements(element, index, array) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = "?"+element.folder;
        a.appendChild( document.createTextNode( element.name ) ); 
        
        li.appendChild( a ); 
        var eList = $("#exercise_list");
        eList.append(li);
    });

    var listitems = $("#exercise_list li a");
    listitems.on("click").click(function(){
        var parts = this.href.split("?");
        var iNew = findExercise(parts[1]);
        setExercise(iNew);
    });
    
    var sExerciseSearch = window.location.search.replace("?","");
    
    var iExercise = findExercise(sExerciseSearch);
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
            recordStores: TinCanRecordStores
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
