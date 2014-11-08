
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
        },
        {
            name:"Loyalty Card",
            folder:"loyalty_card",
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
    
    var executer = {
        sCode:"",
        sTestScript: "",
        sContextScript: "",
        bTest: true,
        bRunnable:false,
        aErrors:[],
        aWarnings:[],
        aAnnotations:[],
        setAnnotations:function(aAnnotations) {
            this.aAnnotations = aAnnotations;
            
            this.aErrors = this.aAnnotations.filter(function(err){
                    return err.type === "error";
            });
            
            this.aTests = this.aErrors.map(function(err){
                    err.pass = false;
            });
            
            this.aWarnings = this.aAnnotations.filter(function(err){
                return err.type === "warning";
            });
            
            if(this.aErrors.length)
            {
                this.bRunnable = false;
            }
            
            return this.bRunnable;
        },
        getExecutionCode:function() {
            var script = "";
            
            if(this.bTest) {
                //script = "iTestSuccesses = 0;\niTestCount = 0;\n\n";
                script = "var asset = this.assert;";
            }
            script +=  this.sContextScript.replace("//CODE//", this.sCode);
            /*if(this.bTest) {
                script += "\n\n"+this.sTestScript+"\n\nreturn iTestSuccesses / iTestCount;";
            }*/
            return script;
                
        },
        execute:function(){
            // TODO : this could be the execute context and the assert etc could live in here.....
            if (!this.bRunnable) {
                return false;
            }
            var script = this.getExecutionCode();
            var funcCode = new Function(script);
            funcCode.bind(this)();
            
        },
        assert:function(outcome, description, type ) {
            this.aTests.push({
                text:description,
                type:type,
                pass:outcome,
                row: false,
                col: false
            });
            
                
        },
        errorsToHTML:function(){
            this.aAnnotations.forEach(oMess, iKey) {
                var li = document.createElement('li');
                li.className = oMess.pass ? 'pass' : 'fail';
                if(outcome) {
                    iTestSuccesses ++;
                }
                li.appendChild( document.createTextNode( oMess.text + " ( "+oMess.type+" )") ); 
                if(oMess.row !== false) {
                    li.click(editor.gotoLine(oMess.row));
                }
                var eOut = $("#testoutput");
                eOut.append(li);
            });
            
        },
        errorsToTinCan:function() {
            return this.aAnnotations;
        }
        
    };
    
    var runCode = function(currExercise, bTest){
        //UI Setup 
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        window.clearInterval(intervalID);
        
        //Auto save
        var code = editor.getValue();
        localStorage.setItem("code_"+currExercise.folder, code);
        
        $.get("exercises/"+currExercise.folder+"/tests.js", {}, function(testscript){
            $.get("exercises/"+currExercise.folder+"/context.js", {}, function(contextscript){
                var newcode = editor.getValue();
                var script = "";
                
                var annot = editor.getSession().getAnnotations();
                // TODO : Split into UI and logical bits.
                // TODO : add syntax / major errors
                // TODO : add attempt counts
                // TODO : send to tincan for every try
                
                if(bTest) {
                    script = "iTestSuccesses = 0;\niTestCount = 0;\n\n";
                }
                script +=  contextscript.replace("//CODE//", newcode);
                if(bTest) {
                    script += "\n\n"+testscript+"\n\nreturn iTestSuccesses / iTestCount;";
                }
                    
                var code = new Function(script);
                var iScore = code();
                
                if(bTest) {
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
                            var newHash = "#"+aExercises[next].folder;
                            $("#next").attr("href", newHash);
                            $("#next").off("click").click(function(){
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
                }
            }, "html");
        }, "html");
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
        $("#start").off("click");
        
        var sStored = localStorage.getItem("code_"+currExercise.folder);
        console.log("currExercise.folder =", currExercise.folder);
        
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
        $("#run").off("click").click(function(){runCode(currExercise, false);});
        $("#runtest").off("click").click(function(){runCode(currExercise, true);});
        runCode(currExercise, false);
    };
    
    $("#reset").click(function(){
        var sExerciseHash = window.location.hash.replace("#","");
        var iExercise = findExercise(sExerciseHash);
        setExercise(iExercise, false);
    });
    
    $("#reload").click(function(){
        var sExerciseHash = window.location.hash.replace("#","");
        var iExercise = findExercise(sExerciseHash);
        setExercise(iExercise, true);
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
