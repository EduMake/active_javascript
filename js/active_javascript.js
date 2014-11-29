var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.getSession().setMode("ace/mode/javascript");
editor.setWrapBehavioursEnabled(true);
editor.setFontSize(16);
editor.setShowPrintMargin(false);

// Boo Hiss Globals.
var intervalID = 0;
var currentExercise = 0;


var ActiveJavascript = function (){
    this.sDefaultExercise = "central_heating";
    this.sExercise = false;
    this.aExercises = false;
    this.dExerciseLoader = $.getJSON("dist/exercises.json", {}, function(data){
        this.aExercises = data;    
        //console.log("this.aExercises =", this.aExercises);
    }.bind(this));
    
    this.aLRSConf = false;
    this.dLRSLoader = $.getJSON("lrs_config.json", {}, function(data){
        this.aLRSConf = data;    
    }.bind(this));
    
    
    this.oStudent = new Student("#student-details-form");
    
    
    this.parseURL = function() {
         this.sPageHash = window.location.hash.replace("#","");
         this.sSite = window.location.href.replace(window.location.search, "").replace(window.location.hash, "");
         //console.log("this.sSite =", this.sSite);
    };
    
    
    this.whenLoaded = function() {
        this.parseURL();
        if(this.aExercises.hasOwnProperty(this.sPageHash)) {
            this.sExercise = this.sPageHash;
        } else {
            this.sExercise = this.sDefaultExercise;
        }
        
        var thisEx = this.aExercises[this.sExercise];
        
        this.oExercise = new Exercise(thisEx, this.sExercise);
        
        this.oExercise.setLevel(this.oStudent.sWorkingGrade);
        $("#taskleveltext").html(this.oStudent.getNameForGrade(this.oExercise.iLevel));

        
        
        editor.getSession().on("changeAnnotation", function(){
            var annot = editor.getSession().getAnnotations();
            //console.log("annot =", annot);
            this.oExercise.oExecuter.setAnnotations(annot);
        }.bind(this));
        
        //$("#run").off("click").click(function(){this.oExercise.runCode(false);}.bind(this));
        $("#runtest").off("click").click(function(){this.oExercise.runCode(true);}.bind(this));
        $("#reload").off("click").click(function(){this.oExercise.reloadEditorContent();}.bind(this));
        $("#reset").off("click").click(function(){this.oExercise.loadEditorContent();}.bind(this));
        $("#easier").off("click").click(function(){
            this.oExercise.makeEasier(); 
            $("#taskleveltext").html(this.oStudent.getNameForGrade(this.oExercise.iLevel));
        }.bind(this));
        
        this.oExercise.runCode(false);
    };

    $.when( this.dExerciseLoader, this.dLRSLoader, this.oStudent.loader )
        .then( this.whenLoaded.bind(this), function(){console.log("Fail");} );
    
    
    this.oExercise = false;
    this.oDefaultStatement = false;
    this.sCourse = "";
    this.sExercise = "";
    
    this.getExerciseGrade = function(iGrade) {
        return Math.floor(iGrade / 5) *5;    
    };
    
    this.loadTinCanConfig = function() {
        // TODO : does our exerecise add an LRS ?
        this.defaultStatement = {
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
        
    };
    this.loadTinCanConfig();
    
    
    /*this.loadExercise(); //include asking for extra tinCan config
    this.setGrade();
    this.testButton();
    this.nextExercise();
    */
    
    
    
};




/*
    
    tincan = new TinCan (
        {
            recordStores: TinCanRecordStores
        }
    );
 
    
    
    
    if(localStorage.getItem("tincan_mbox")){
        defaultStatement.actor.mbox = localStorage.getItem("tincan_mbox");
    }    
    
    //findExercise by name    
    var findExercise = function(sPageHash) {
        var iExercise = aExercises.findIndex(function(element, index, array) {
            return sPageHash === element.folder;
        });
        
        if(iExercise === -1) {
            iExercise = 0;
        }
        return iExercise;
    };
    
    //Make it so every call gets fresh info from server
    var isValidEmail = function(x) {
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
            //alert("Not a valid e-mail address");
            return false;
        }
        return true;
    };
    
    var runCode = function(currExercise, bTest){
        //Exercise.resetUI();
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        $("#simulation").html(currExercise.hSimulation); 
        window.clearInterval(intervalID);
        
        //Auto save
        var code = editor.getValue();
        localStorage.setItem("code_"+currExercise.folder, code);
        
        oExecuter.setTest(bTest);
                
        oExecuter.execute();
        oExecuter.resultsToHTML();
        var aTinOut = oExecuter.resultsToTinCan();
        var bSuccess = oExecuter.getSuccess();
        console.log("bSuccess =", bSuccess);
        
        if(bTest) {
            var sEmail = defaultStatement.actor.mbox;
            while(!isValidEmail(sEmail)) {
                sEmail = prompt("Your school email address", "");
            }
            if(sEmail !== defaultStatement.actor.mbox ) {
                field.value = sEmail;
                localStorage.setItem("tincan_mbox", sEmail);
                defaultStatement.actor.mbox = sEmail;
            }


            var endStatement = defaultStatement; 
            if(bSuccess) {                   
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
                
                
                
            } else {
                $("#result").html("Please Try Again : Check the test results to work out what to do.");
                
                endStatement.verb = {
                     "id": "http://www.adlnet.gov/expapi/verbs/attempted/",
                     "display": {"en-GB": "attempted"}
                };
                
                endStatement.result = {
                    "completion": false,
                    "success": false,
                    "score": {
                        "scaled": 0
                    }
                };
            
                
            }
            
            //console.log("endStatement =", endStatement);
            if(defaultStatement.actor.mbox.length) {
                tincan.sendStatement(endStatement);
            }        
        
            // TODO : add attempt counts
            // TODO : send to tincan for every try
        }  
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
        
        currExercise.hSimulation = $("#simulation").html();
        
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        $("#next").hide();
        $("#start").off("click");
        
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
        
        
        $("#run").off("click").click(function(){runCode(currExercise, false);});
        $("#runtest").off("click").click(function(){runCode(currExercise, true);});
        
        oExecuter = new Executer; 
        oExecuter.setCode(editor.getValue());
        runCode(currExercise, false);
    };
    
    $("#reset").click(function(){
        var sPageHash = window.location.hash.replace("#","");
        var iExercise = findExercise(sPageHash);
        setExercise(iExercise, false);
    });
    
    $("#reload").click(function(){
        var sPageHash = window.location.hash.replace("#","");
        var iExercise = findExercise(sPageHash);
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
    
    var sPageHash = window.location.hash.replace("#","");
    
    var iExercise = findExercise(sPageHash);
    setExercise(iExercise);
    
    var field = document.getElementById("tincanemail");
    
    if (localStorage.getItem("tincan_mbox")) {
        field.value = localStorage.getItem("tincan_mbox");
    }
    
    field.addEventListener("change", function() {
            localStorage.setItem("tincan_mbox", field.value);
            defaultStatement.actor.mbox = localStorage.getItem("tincan_mbox");
    });    
    
    
        
    if(defaultStatement.actor.mbox.length) {
        //tincan.sendStatement(defaultStatement);
    }
    
});*/



$( document ).ready(function() {
    $.ajaxSetup( {cache:false} );
    var ActiveJS = new ActiveJavascript();
    
});