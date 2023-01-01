var ExecuterPython = function (sTestScript, sContextScript){
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
        var script = "aTests = [];";
        
        if(this.bTest) {
            script += "def assert(outcome, description, type ) {aTests.push({text:description,type:type,label:outcome?'Pass':'Fail',pass:outcome, row: false, col: false});};";
            
        }
        script +=  this.sContextScript.replace("##CODE##", this.sCode);
        
        if(this.bTest) {
            // TODO : if()//TESTS// not in script add it at end
            script = script.replace("##TESTS##", this.sTestScript);
        }
        script += "\n\nreturn aTests";
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
            //console.log("Running");
        }
        
        var script = this.getExecutionCode();
        
        try {
            var aTests = (pyodide.runPython(script));
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
            $("#testtable").html("<tr><th>Test</th><th>Function</th><th>Input Type</th><th>Inputs</th><th>Expected</th><th>Actual</th><th>Outcome</th></tr>");
            this.aTests.forEach(function(oMess, iKey) {
                if(oMess.input_type){
                    var tr = document.createElement('tr');
                    tr.className = oMess.label.toLowerCase();
                    //var aNum = document.createElement('td');
                    
                    var eTest = document.createElement('td');
                    eTest.appendChild( document.createTextNode( oMess.text ) );
                    
                    tr.appendChild(eTest)
                    var eFunc = document.createElement('td');
                    eFunc.appendChild( document.createTextNode( oMess.func.name ) );
                    tr.appendChild(eFunc)
                    
                    var eIT = document.createElement('td');
                    eIT.appendChild( document.createTextNode( oMess.input_type ) );
                    tr.appendChild(eIT)
 
                    var eInputs = document.createElement('td');
                    eInputs.appendChild( document.createTextNode( oMess.inputs.join(", ") ) );
                    tr.appendChild(eInputs)
 
                    var eExpected = document.createElement('td');
                    eExpected.appendChild( document.createTextNode( oMess.expected ) );
                    tr.appendChild(eExpected)
 
                    var eActual = document.createElement('td');
                    eActual.appendChild( document.createTextNode( oMess.actual ) );
                    tr.appendChild(eActual)
                    
                    var eOutcome = document.createElement('td');
                    eOutcome.appendChild( document.createTextNode( oMess.label ) );
                    tr.appendChild(eOutcome)
                    
                    var eOut = $("#testtable");
                    eOut.append(tr);
                }else{
                    var li = document.createElement('li');
                    li.className = oMess.label.toLowerCase();

                    var sText = oMess.text;

                    if(oMess.row !== false) {
                        $(li).click(function(){
                          editor.gotoLine(oMess.row + 1);
                        });
                        sText = "Line "+(oMess.row+1)+" : "+sText;
                    }
                    li.appendChild( document.createTextNode( sText  ) ); 
                    var eOut = $("#testoutput");
                    eOut.append(li);
                }                
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