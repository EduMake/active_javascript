var Executer = function (){
    this.sCode = "";
    this.sTestScript = "";
    this.sContextScript = "";
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
            oAnno.pass = false;
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
        //console.log("this.execute()");
        // TODO : this could be the execute context and the assert etc could live in here.....
        this.calcAnnoErrors();
        if (!this.bRunnable) {
            return false;
        }
        var script = this.getExecutionCode();
        //console.log("script =", script);
        var funcCode = new Function(script);
        var aTests = funcCode();
        //console.log("aTests =", aTests);
        this.aTests = this.aTests.concat(aTests);
        //console.log("this.aTests =", this.aTests);
        //this.bRunnable = false;
        //this.sCode = "";
    };
    
    this.resultsToHTML = function(){
        //console.log("this.resultsToHTML this.aTests =", this.aTests);
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
    
    this.calcScore = function() {
        var aScores = this.aTests.map(function(){
            return ;
        });            
        console.log("aScores =", aScores);
    };
    
    this.checkReady = function() {
        this.bReady = this.bAnnotations && this.sCode.length > 0 && this.sTestScript.length > 0 && this.sContextScript.length > 0;
        this.bRunnable = this.bReady && !this.bSyntaxErrors;
        console.log("this.bAnnotations =", this.bAnnotations);
        console.log("this.sCode.length =", this.sCode.length);
        console.log("this.sTestScript.length =", this.sTestScript.length);
        console.log("this.sContextScript.length =", this.sContextScript.length);
        console.log("this.bReady =", this.bReady);
        console.log("this.bRunnable =", this.bRunnable);
        
            console.log("this.bFirstRun =", this.bFirstRun);
        
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
