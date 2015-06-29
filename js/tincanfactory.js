var TinCanFactory = function (aLRSs){
    
    this.aLRSs = [];
    this.oStudent = false; 
    
    this.addLRS = function (oLRS) {
        oLRS.active = true;
        this.aLRSs.push(oLRS);
    };
    
    this.getRecordStores = function() {
        return this.aLRSs.filter(function(aR){
            // TODO : use data from oStudent to filter LRS they don't want and maybe add their own
            return true;
        }).map(function(aR){
            return aR.tincan;
        });
    };
    
    this.addLRSs = function (aLRSs) {
        aLRSs.forEach(function(aLRS){
            this.addLRS(aLRS);
        }.bind(this));
    };
    
    this.setStudent = function (oStudent) {
        this.oStudent = oStudent;   
        console.log("this.oStudent =", this.oStudent);
        // Add student LRSs
        this.oTinCan = new TinCan ({
            DEBUG : true,
            actor: {
                mbox: "mailto:"+this.oStudent.sEmail,
                objectType:"Actor",
                name: this.oStudent.sEmail
            },
            recordStores: this.getRecordStores()
        });
    };
    
    this.sendCompletedStatement = function(oResult) {
        this._sendStatement(this.getCompletedStatement(oResult));
    };
    
    this.sendAttemptedStatement = function(oResult) {
        this._sendStatement(this.getAttemptedStatement(oResult));
    };
    
    this.sendStatement = function(oStatement) {
        this._sendStatement(oStatement);
    };
    
    this.getCompletedStatement = function(oResult) {
        var oVerb = {
            "id": "http://adlnet.gov/expapi/verbs/completed",
            "display": {"en-GB": "completed"}
        };
         
        var oObject = {
            id: window.location.href,
            type: "http://adlnet.gov/expapi/activities/simulation",
            definition: {
                name: { "en-GB": $("title").text() }
            }
        };
        return this.getTinCanStatement(oVerb, oObject, oResult);
    };
    
    this.getAttemptedStatement = function(oResult) {
        var oVerb = {
            "id": "http://adlnet.gov/expapi/verbs/attempted",
            "display": {"en-GB": "attempted"}
        };
         
        var oObject = {
            id: window.location.href,
            type: "http://adlnet.gov/expapi/activities/simulation",
            definition: {
                name: { "en-GB": $("title").text() }
            }
        };
        return this.getTinCanStatement(oVerb, oObject, oResult);
    };
    
    this.getTinCanStatement = function(oVerb, oObject, oResult) {
        var oStatement = {
            verb: oVerb,
            target: oObject,
            result:oResult
            //context:oContext
        }; 
        console.log("oStatement =", oStatement);
        return oStatement;
    };
    
    this._sendStatement = function(oState){
        var oStatement = this.oTinCan.prepareStatement(oState);
        console.log(JSON.stringify(oStatement));
        this.oTinCan.sendStatement(oStatement);
    };
    
};
