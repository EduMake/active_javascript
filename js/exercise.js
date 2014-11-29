var Exercise = function (aData, sExercise){
    this.oExecuter = false;
    this.iLevel = 0;
    this.aData = aData;
    this.oLevel = {};
    this.sExercise = sExercise;
    
    this.loadLevel = function() {
        if(!this.aData.hasOwnProperty(this.iLevel)) {
            console.log("no level "+this.iLevel)
            return false;
        }
        this.oLevel = this.aData[this.iLevel];
        this.resetGUI();
        //$("#start").off("click");
        this.oExecuter = new Executer(this.aData.tests, this.aData.context);
        
        this.loadEditorContent();
        $("#taskname").html(this.aData.info.name);
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
        return "active-" + this.sExercise + "-" + this.iLevel;
    };
    
    this.reloadEditorContent = function () {
        console.log("this.reloadEditorContent =", this.reloadEditorContent);
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
        console.log("code =", code);
        if(bTest) {
            var sKey = this.getCodeLocalStoreageKey();
            console.log("sKey =", sKey);
            localStorage.setItem(sKey, code);
        }
        
        this.oExecuter.setCode(code);
        this.oExecuter.setTest(bTest);
                
        this.oExecuter.execute();
        console.log("this.oExecuter =", this.oExecuter);
        // TODO : move resultsToHTML to exercise
        this.oExecuter.resultsToHTML();
        
        //var aTinOut = oExecuter.resultsToTinCan();
        var bSuccess = this.oExecuter.getSuccess();
        console.log("bSuccess =", bSuccess);
        /*
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
        */
    };
};
    
    /*
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
    
    
        
    if(defaultStatement.actor.mbox.length) {
        //tincan.sendStatement(defaultStatement);
    }
    
});*/
