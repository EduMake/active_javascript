var Student = function (){
    this.sEmail = "";
    this.aProgressOnCourse = [];
    this.sTargetLevel = false;
    
    this.getTargetLevel = function () {
        if( this.sTargetLevel !== false) {
            return this.sTargetLevel;
        }
        tincan.getStatements(
            {
                
                //https://rusticisoftware.github.io/TinCanJS/doc/api/latest/classes/TinCan.LRS.html#method_queryStatements
                // 'params' is passed through to TinCan.LRS.queryStatements
                // get any assessed statements for this course
                // we will use
                params: {
                    //since: "2013-08-29 07:42:10CDT", 
                    verb: {id:"http://edumake.org/verb/assessed"},  //new verb
                    activity:{id:thissite},
                    agent:{mbox:this.sEmail}
                },
                callback: function (err, result) {
                    // 'err' will be null on success
                    if (err !== null) {
                        // handle error
                        return;
                    }
                    // if no assessment start see if there is a progress array 
                    // if not start course progrress request
                    // handle success, 'result' is a TinCan.StatementsResult object
                    //            
                    this.sTargetLevel = "TODO";
                    return this.sTargetLevel;
                    
                    console.log(result);
                }
            }
        );

    
        /*
            activity
            http://adlnet.gov/expapi/activities/course
            
            the url for tht is the base of the activities.
        
            verb   
            assessed URI: http://edumake.org/verb/assessed
        
            {"name":{"en-US":"assessed"},"description":{"en-US":"Indicates the user had their work assessed by a human. And a mark was given (details mapping score to grade in context)."}}
        */  
    
    
    };
    
    var oGrades = {
                51: "Techincals Distinction *"
                50: "GCSE A*", //We will put the others in although their is no presumption of relative worth just a logical order
                45: "GCSE A",
                40: "GCSE B",
                35: "GCSE C",
                31: "Working towards GCSE C",
                30: "GCSE D",
                25: "GCSE E",
                20: "GCSE F",
                0: "Fail"
            };
            
    
  
  
  
    
};
