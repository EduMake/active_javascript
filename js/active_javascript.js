var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.getSession().setMode("ace/mode/javascript");
editor.getSession().setUseWrapMode(false);
editor.setShowPrintMargin(false);
editor.setFontSize(16);

// Boo Hiss Globals.
var intervalID = 0;


var ActiveJavascript = function (){
    this.sDefaultExercise = "central_heating";
    this.sExercise = false;
    this.aExercises = false;
    this.oTinCan = false;
    this.dExerciseLoader = $.getJSON("dist/exercises.json", {}, function(data){
        this.aExercises = data;    
        //console.log("this.aExercises =", this.aExercises);
        
        // TODO : #19 Subject order
        /*what do we do when someone just turns up
            how do we introduce different subjects without being codecadamey
            Can we show easier subjects (and their starters?) and the ones we have done (but why or maybe our scores on ones we have done)
            What does score mean / for?*/
        
            
        //Build a running order maybe this goes into the grunt eventually and it builds the exercises just for one subejct??    
        var aRunningOrder = [];
        for(var sEx in this.aExercises) {
            console.log("this.aExercises =", this.aExercises);
            var aExercise = this.aExercises[sEx];
            var aEx = { 
                sExercise: sEx,
                sObject:aExercise.info.objects[0],
                bDefault:aExercise.info["default"],
                sTitle:aExercise.info["name"]
                //aLevels
            };
            //console.log("aEx =", aEx);
            aRunningOrder.push(aEx);
        }
        
        //console.log("aRunningOrder =", aRunningOrder);
        aRunningOrder.sort(function(a, b){
            var iSort = a.sObject.localeCompare(b.sObject);
            if(iSort === 0) {
               if( a.bDefault) {
                return -1;
               }
               //use student email to seed random????
               //return this.oStudent.sEmail
               return Math.random();
            }
            return iSort;
        });
        
        console.log("sorted aRunningOrder =", aRunningOrder);
            
    }.bind(this));
    
    this.aLRSConf = false;
    this.dLRSLoader = $.getJSON("lrs_config.json", {}, function(data){
        this.aLRSConf = data;    
        console.log("this.aLRSConf =", this.aLRSConf);
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
        
        this.oTinCan = new TinCanFactory();
        this.oTinCan.addLRSs(this.aLRSConf);
        this.oTinCan.setStudent(this.oStudent);
        
        
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
        
        $("#wrapping").off("click").click(function(){
                
            var bOld = editor.getSession().getUseWrapMode();//editor.getWrapBehavioursEnabled();
            console.log("bOld =", bOld);
            editor.getSession().setUseWrapMode(!bOld);
            $("#wrapping").html("Wrapping "+(bOld?"On":"Off"));
        });
        
        
        // TODO : Create tincan LRS section
        // TODO : 
        
        
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
    
    /*this.loadExercise(); //include asking for extra tinCan config
    this.setGrade();
    this.testButton();
    this.nextExercise();
    */
    
            
    var onTestSuccess = function (ev) {
        console.log("ev =", ev);
        // TODO : send a completed for the exercise with score
        var sGrade = this.oStudent.getNameForGrade(ev.iLevel);
        console.log("sGrade =", sGrade);
        var sResponse = JSON.stringify({"attempts":ev.aAttempts, "code":ev.sCode});
        var oResult = {
                    "completion": true,
                    "success": true,
                    "response":sResponse,
                    "score": {
                        "scaled": ev.iLevel,
                        "raw": ev.aAttempts[ev.iLevel]
                    }
                };
        
        this.oTinCan.sendCompletedStatement(oResult);
        
        // TODO : send a blooms statement for each object 
        
        var oStatement = this.oTinCan.getTinCanStatement(
            this.oExercise.oLevel.info.verb, 
            this.oExercise.info.objects[0],  // TODO : make it do all of them 
            oResult);
        this.oTinCan.sendStatement(oStatement);
        
        console.log("this.oExercise =", this.oExercise);
        // TODO : (eventually we may need to move the objects down to the levels so other providers can have their own verbs)
        
        
        // TODO : Success message (modal??) and continue button
        $("#exercise_end").modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
    
        
        // TODO : work out the next exercise
        // TODO : load the next one
        // TODO : use a deffered 
            
    };
    
    var onTestFail = function (ev) {
        console.log("ev =", ev);
        
        //console.log("Fail this.aLRSConf =", this.aLRSConf);
        var sResponse = JSON.stringify({"fails":ev.aTinOut, "code":ev.sCode});
        console.log("sResponse =", sResponse);
        var oResult = {
                    "completion": false,
                    "success": false,
                    "response":sResponse
        };
        
        this.oTinCan.sendAttemptedStatement(oResult);
        // TODO : anayze errors and show hints
        // TODO : if struggling (say 5 attempts at this level  suggest the make easier)

    };
    
	$(document).on("exerciseTestSuccess", onTestSuccess.bind(this));
    $(document).on("exerciseTestFail", onTestFail.bind(this));
    
    
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
