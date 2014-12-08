var Exercise = function (aData, sExercise){
    this.oExecuter = false;
    this.iLevel = 0;
    this.aData = aData;
    this.oLevel = {};
    this.sExercise = sExercise;
    this.oStudent = false;
    
    // TODO : library loading
    // TODO : info cascading (probably with a flag)
    
    this.loadLevel = function() {
        if(!this.aData.hasOwnProperty(this.iLevel)) {
            console.log("No Level "+this.iLevel + " Found");
            var i = this.iLevel;
            var bSearching = true;
            while (i > 0 && bSearching) {
                i = i - 5;
                bSearching = !this.aData.hasOwnProperty(i);
            } 
            if( bSearching === this.iLevel) {
                i = this.iLevel;
                while (i <= 100 && bSearching) {
                    i = i - 5;
                    bSearching = !this.aData.hasOwnProperty(i);
                } 
            }
            if(this.aData.hasOwnProperty(i)) {
                this.iLevel = i; 
                console.log("Found Level "+i);
            } else {
                return false;
            }
        }
        this.oLevel = this.aData[this.iLevel];
        console.log("this.oLevel =", this.oLevel);
        this.resetGUI();
        //$("#start").off("click");
        this.oExecuter = new Executer(this.aData.tests, this.aData.context);
        //console.log("this.aData =", this.aData);
        
        this.loadEditorContent();
        $("#taskname").html(this.aData.info.name);
        $("#taskleveltext").html(this.oLevel.info.verb.display["en-GB"]);

    };
    
    this.resetGUI =function () {
        $("#output").html("");
        $("#testoutput").html("");
        $("#result").html("");
        $("#simulation").html(this.aData.simulation); 
        $("title").text("Active Javascript : " + this.aData.info.name);
        $("h1").text("Active Javascript : " + this.aData.info.name);
        $("#task").html(this.oLevel.task);    
        
        $("#next").hide();
        
    };
    
    this.loadEditorContent = function () {
        editor.setValue(this.oLevel.initial); // or session.setValue
        editor.navigateFileStart();
    };
    
    
    this.getCodeLocalStoreageKey = function() {
        var sStudent = "";
        if (this.oStudent !== false) {
            sStudent = this.oStudent.sEmail+"-";
        }
        return "active-" + sStudent + this.sExercise + "-" + this.iLevel;
    };
    
    this.setStudent = function (oStudent) {
        this.oStudent = oStudent;
        this.setLevel(this.oStudent.sWorkingGrade);
        //$("#taskleveltext").html(this.oStudent.getNameForGrade(this.iLevel));

    };
    
    this.reloadEditorContent = function () {
        //console.log("this.reloadEditorContent =", this.reloadEditorContent);
        // TODO : add student to the key?
        var sKey = this.getCodeLocalStoreageKey();
        var sLocalCode = localStorage.getItem(sKey);
        if(sLocalCode) {
            editor.setValue(sLocalCode); // or session.setValue
            editor.navigateFileStart();
        } else {
            this.loadEditorContent();
        }
    };
    
    this.setLevel = function(iLevel) {
        this.iLevel = Math.floor(iLevel / 5) *5;
        this.loadLevel();    
    };
    
    this.makeEasier = function () {
        var iEasierLevel = this.iLevel - 5;
        if(!this.aData.hasOwnProperty(iEasierLevel)) {
            console.log("no easier level "+this.iLevel);
            return false;
        }
        
        var sOldCode = editor.getValue();
        this.setLevel(iEasierLevel);
        var sOldCodeStart = "\n/* NOTE : Your previous code is here, in case it is of use.\n";
        
        var sEasierCode = (this.oLevel.initial + sOldCodeStart+sOldCode+"*/").replace("*/*/","*/");
        editor.setValue(sEasierCode); // or session.setValue
        editor.navigateFileStart();
        
    };
    
    
    this.runCode = function(bTest){
        this.resetGUI();
        window.clearInterval(intervalID);
        
        //Auto save
        var code = editor.getValue();
        //console.log("code =", code);
        if(bTest) {
            var sKey = this.getCodeLocalStoreageKey();
            //console.log("sKey =", sKey);
            localStorage.setItem(sKey, code);
        }
        
        this.oExecuter.setCode(code);
        this.oExecuter.setTest(bTest);
                
        this.oExecuter.execute();
        //console.log("this.oExecuter =", this.oExecuter);
        // TODO : move resultsToHTML to exercise
        this.oExecuter.resultsToHTML();
        
        var bSuccess = this.oExecuter.getSuccess();
        //console.log("bSuccess =", bSuccess);
        
        if(bTest) {
            var aTinOut = oExecuter.resultsToTinCan();
            if(bSuccess) {                   
                // TODO : send a completed for the exercise with score
                
                // TODO : send a blooms statment for each object 
                // TODO : (eventually we may need to move the objects down to the levels so other providers can have their own verbs)
                
                // In the page (using an event on the exercise??)  :-
                // TODO : Success message (modal??) and continue button
                // TODO : work out the next exercise
                // TODO : load the next one
                // TODO : use a deffered 
                
            } else {
                // TODO : send an attempted
                // TODO : increment attempt counter
                // TODO : anayze errors and show hints
                // TODO : if struggling (say 5 attempts at this level  suggest the make easier)
            }    
            
            /*
            var endStatement = defaultStatement; 
            if(bSuccess) {                   
                endStatement.verb = {
                     "id": "http://adlnet.gov/expapi/verbs/completed",
                     "display": {"en-GB": "completed"}
                };
                
                endStatement.result = {jquery
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
            */
            // TODO : add attempt counts
            // TODO : send to tincan for every try
        } 
        
    };
};
    
    /*
     
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
    
});*/
