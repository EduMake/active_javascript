var Exercise = function (aData, sExercise){
    this.oExecuter = false;
    this.iLevel = 0;
    this.aData = aData;
    this.oLevel = {};
    this.sExercise = sExercise;
    this.oStudent = false;
    this.aAttempts = {};
    
    // TODO : library loading
    // TODO : info cascading (probably with a flag)
    
    this.loadLevel = function() {
        if(!this.aData.hasOwnProperty(this.iLevel)) {
            console.log("No Level "+this.iLevel + " Found");
            var i = this.iLevel;
            var bSearching = true;
            while (i > 0 && bSearching) {
                i -= 5;
                bSearching = !this.aData.hasOwnProperty(""+i);
            } 
            if( bSearching === this.iLevel) {
                i = this.iLevel;
                while (i <= 100 && bSearching) {
                    i += 5;
                    bSearching = !this.aData.hasOwnProperty(""+i);
                } 
            }
            if(this.aData.hasOwnProperty(""+i)) {
                this.iLevel = i; 
                console.log("Found Level "+i);
            } else {
                return false;
            }
        }
        this.oLevel = this.aData[this.iLevel];
        this.resetGUI();
        //$("#start").off("click");
        this.oExecuter = new Executer(this.aData.tests, this.aData.context);
        //console.log("this.aData =", this.aData);
        
        this.loadEditorContent();
        $("#tasklabel").html(this.oLevel.info.label);
        $("#taskname").html(this.aData.info.name);
        $("#taskleveltext").html(this.oStudent.getNameForGrade(this.iLevel));

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
        this.setLevel(5 + parseInt(this.oStudent.sWorkingGrade, 10));
        //$("#taskleveltext").html(this.oStudent.getNameForGrade(this.iLevel));

    };
    
    this.reloadEditorContent = function () {
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
        if(bTest) {
            var sKey = this.getCodeLocalStoreageKey();
            localStorage.setItem(sKey, code);
        }
        
        this.oExecuter.setCode(code);
        this.oExecuter.setTest(bTest);
                
        this.oExecuter.execute();
        // TODO : move resultsToHTML to exercise
        this.oExecuter.resultsToHTML();
        
        var bSuccess = this.oExecuter.getSuccess();
        
        if(bTest) {
            if(!this.aAttempts.hasOwnProperty(""+this.iLevel)) {
                this.aAttempts[""+this.iLevel] = 0;
            }
            this.aAttempts[""+this.iLevel] ++;
            
            var aTinOut = this.oExecuter.resultsToTinCan();
            if(bSuccess) {
                
                $.event.trigger({
                        type: "exerciseTestSuccess",
                        aAttempts: this.aAttempts,
                        iLevel: this.iLevel,
                        aTinOut: aTinOut
                    });
                
            } else {
                
                $.event.trigger({
                        type: "exerciseTestFail",
                        aAttempts: this.aAttempts,
                        iLevel: this.iLevel,
                        aTinOut: aTinOut
                        
                    });
            }    
        } 
    };
};
