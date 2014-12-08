var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.getSession().setMode("ace/mode/javascript");
editor.setWrapBehavioursEnabled(true);
editor.setFontSize(16);
editor.setShowPrintMargin(false);

// Boo Hiss Globals.
var intervalID = 0;


var ActiveJavascript = function (){
    this.sDefaultExercise = "central_heating";
    this.sExercise = false;
    this.aExercises = false;
    this.dExerciseLoader = $.getJSON("dist/exercises.json", {}, function(data){
        this.aExercises = data;    
        //console.log("this.aExercises =", this.aExercises);
        
        // TODO : #19 Subject order
        /*what do we do when someone just turns up
            how do we introduce different subjects without being codecadamey
            Can we show easier subjects (and their starters?) and the ones we have done (but why or maybe our scores on ones we have done)
            What does score mean / for?*/
        
            
        //Build a running order maybe this goes into the grunt eventually and it builds the exercises just for one subejct??    
        for(sEx in this.aExercises) {
        
        
        
        }
            
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
        this.oExercise.setStudent(this.oStudent);
        
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
    // TODO :  #5 ReAdd TinCan & Get it to log attempts 
    tincan = new TinCan (
        {
            recordStores: TinCanRecordStores
        }
    );
 
    
    
    
    if(localStorage.getItem("tincan_mbox")){
        defaultStatement.actor.mbox = localStorage.getItem("tincan_mbox");
    }    
    
    var runCode = function(currExercise, bTest){
    

    
        if(bTest) {
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
    
    
    field.addEventListener("change", function() {
            localStorage.setItem("tincan_mbox", field.value);
            defaultStatement.actor.mbox = localStorage.getItem("tincan_mbox");
    });    
    
    
});*/



$( document ).ready(function() {
    $.ajaxSetup( {cache:false} );
    var ActiveJS = new ActiveJavascript();
    
});
