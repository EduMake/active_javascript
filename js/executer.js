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
        this.aTests = this.aAnnotations.filter(function(err){
                //console.log("err =", err);
                if(err.type === "error") {
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
        //console.log("aAnnotations =", aAnnotations);
        var aRows = [];
        this.aAnnotations = aAnnotations.map(function(oAnno){
            //console.log("aRows =", aRows);
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
            //script = "var assert = this.assert;//console.log(\"assert =\", assert);";
            
        }
        script +=  this.sContextScript.replace("//CODE//", this.sCode);
        if(this.bTest) {
            //script += "\n\n"+this.sTestScript;//+"\n\nreturn iTestSuccesses / iTestCount;";
            script += "\n\n"+this.sTestScript;
        }
        script += "\n\nreturn aTests;";
        return script;
            
    };
    
    this.execute = function(){
        window.clearInterval(intervalID);
        console.log("intervalID =", intervalID);
        console.log("this.execute");
        this.calcAnnoErrors();
        if (!this.bRunnable) {
            console.log("Not bRunnable this.bRunnable =", this.bRunnable, "this.bAnnotations =", this.bAnnotations, "this.sCode.length =", this.sCode.length,            "this.sTestScript.length =", this.sTestScript.length,"this.sContextScript.length =", "this.bFirstRun =", this.bFirstRun, this.sContextScript.length,"this.bReady =", this.bReady,"this.bRunnable =", this.bRunnable);
        
            return false;
        }
        var script = this.getExecutionCode();
        var funcCode = new Function(script);
        var aTests = funcCode();
        console.log("aTests =", aTests);
        this.aTests = this.aTests.concat(aTests);
        console.log("this.aTests =", this.aTests);
    };
    
    
    
    this.resultsToHTML = function(){
        console.log("this.resultsToHTML this.aTests =", this.aTests);
        if(this.aTests.length) {
            this.aTests.forEach(function(oMess, iKey) {
                //console.log("oMess =", oMess);
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
        return this.aTests;
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
        console.log("this.bAnnotations =", this.bAnnotations, "this.sCode.length =", this.sCode.length,            "this.sTestScript.length =", this.sTestScript.length,"this.sContextScript.length =", "this.bFirstRun =", this.bFirstRun, this.sContextScript.length,"this.bReady =", this.bReady,"this.bRunnable =", this.bRunnable);
        
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
