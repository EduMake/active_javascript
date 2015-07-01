var Executer = function (sTestScript, sContextScript){
    this.sCode = "";
    this.sTestScript = sTestScript;
    this.sContextScript = sContextScript;
    this.bFirstRun = false;
    
    this.bTest = true;
    this.bRunnable = false;
    this.bReady = false;
    this.bSyntaxErrors = false;
    this.aErrors = [];
    this.aWarnings = [];
    this.aAnnotations = [];
    this.bAnnotations = false;
    this.aTests = [];
    
    this.calcAnnoErrors = function() {
        this.aTests = [];
        var iErrors = 0; 
        this.bSyntaxErrors = false;
        this.aTests = this.aAnnotations.filter(function(err){
                if(err.type === "error") {//   || err.type === "warning") {
                    iErrors ++;
                }
                return err.keep && (err.type === "error" || err.type === "warning");
        });
        
        if(iErrors)
        {
            this.bSyntaxErrors = true;
        }
        
    };
    
    
    this.setAnnotations = function(aAnnotations) {
        var aRows = [];
        this.aAnnotations = aAnnotations.map(function(oAnno){
            oAnno.pass = (oAnno.type === "error")?false:true;
            oAnno.label = (oAnno.type === "error")?"Error":"Warning";
            oAnno.keep = aRows.indexOf(oAnno.row) === -1;
            aRows.push(oAnno.row);
            return oAnno;
        });
        
        this.calcAnnoErrors();
        this.bAnnotations = true;
        this.checkReady();
        
        return this.bRunnable;
    };
    
    this.getExecutionCode = function() {
        var script = "var aTests = [];";
        
        if(this.bTest) {
            script += "var assert = function(outcome, description, type ) {aTests.push({text:description,type:type,label:outcome?'Pass':'Fail',pass:outcome, row: false, col: false});};";
        }
        script +=  this.sContextScript.replace("//CODE//", this.sCode);
        
        if(this.bTest) {
            // TODO : if()//TESTS// not in script add it at end
            script = script.replace("//TESTS//", this.sTestScript);
        }
        script += "\n\nreturn aTests;";
        return script;
            
    };
    
    this.execute = function(){
        window.clearInterval(intervalID);
        this.calcAnnoErrors();
        this.checkReady();
        if (!this.bRunnable) {
            //console.log("Not bRunnable this.bRunnable =", this.bRunnable, "this.bAnnotations =", this.bAnnotations, "this.sCode.length =", this.sCode.length,            "this.sTestScript.length =", this.sTestScript.length,"this.sContextScript.length =", this.sContextScript.length, "this.bFirstRun =", this.bFirstRun, "this.bReady =", this.bReady,"this.bRunnable =", this.bRunnable);
            return false;
        } else {
            console.log("Running");
        }
        
        var script = this.getExecutionCode();
        var funcCode = new Function(script);
        try {
            var aTests = funcCode();
            this.aTests = this.aTests.concat(aTests);
            if(this.bTest && this.aTests.length === 0 ) {
                var err = {keep:true, type:"error",text:"No Tests Ran Successfully.", label:"Error", pass:false, row:false };
                this.aTests.push(err);
            }
        
        } catch (e){
            if (e instanceof TypeError) {
                // statements to handle TypeError exceptions
            } else if (e instanceof RangeError) {
                // statements to handle RangeError exceptions
            } else if (e instanceof EvalError) {
                // statements to handle EvalError exceptions
            } else {
               // statements to handle any unspecified exceptions
       //        logMyErrors(e); // pass exception object to error handler
            }
            var err = {keep:true, type:"error",text:e.message, label:"Error", pass:false, row:false };
            this.aTests.push(err);
        }
       
    };
    
    
    
    this.resultsToHTML = function(){
        if(this.aTests.length) {
            this.aTests.forEach(function(oMess, iKey) {
                var li = document.createElement('li');
                li.className = oMess.label.toLowerCase();
                
                var sText = oMess.text;
                
                if(oMess.row !== false) {
                    $(li).click(function(){editor.gotoLine(oMess.row + 1);});
                    sText = "Line "+(oMess.row+1)+" : "+sText;
                }
                
                li.appendChild( document.createTextNode( sText  ) ); 
                var eOut = $("#testoutput");
                eOut.append(li);
            });
        }
    };
    
    this.resultsToTinCan = function() {
        var aFails = this.aTests.filter(function(oTest){
            return oTest.pass === false;
        }).map(function(oTest){
            var oFail = {
                pass: oTest.pass,
                text: oTest.text,
                type: oTest.type
            };
            return oTest;
        
        });
        return aFails;
    };
    
    this.getSuccess = function() {
        var aFails = this.aTests.filter(function(oTest){
            return oTest.pass === false;
        });            
        return aFails.length  === 0; 
    };
    
    this.checkReady = function() {
        window.clearInterval(intervalID);
        this.bReady = this.bAnnotations && this.sCode.length > 0 && this.sTestScript.length > 0 && this.sContextScript.length > 0;
        this.bRunnable = this.bReady && !this.bSyntaxErrors;
        //console.log("this.bAnnotations =", this.bAnnotations, "this.sCode.length =", this.sCode.length,            "this.sTestScript.length =", this.sTestScript.length,"this.sContextScript.length =", this.sContextScript.length, "this.bFirstRun =", this.bFirstRun, "this.bReady =", this.bReady,"this.bRunnable =", this.bRunnable);
        
        if(this.bReady && !this.bFirstRun) {
            this.bFirstRun = true;
            this.execute();
        }
        
        return this.bRunnable;
    };
    
    this.setCode = function(code) {
        
        this.sCode = code;
        this.checkReady();
    };
    
    this.setTestScript = function(code) {
        this.sTestScript = code;
        this.checkReady();
    };
    
    this.setTest = function(bTest) {
        this.bTest = bTest;
    };
    
    this.setContextScript = function(code) {
        this.sContextScript = code;
        this.checkReady();
    };
    
};
