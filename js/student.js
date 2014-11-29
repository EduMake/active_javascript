var Student = function (sFormSelector){
    this.sLocalStorageName = "student_details_test1";
    this.sEmail = "";
    this.sFormSelector = false;
    this.loader = jQuery.Deferred();
    this.aProgressOnCourse = [];
    this.sWorkingGrade = false;
    this.oGrades = {
                51: "Techincals Distinction *",
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
            
    this.getNameForGrade = function(iLevel) {
        var iWorkingGrade = parseInt(this.sWorkingGrade, 10);
        // IF our working grade is a non standard (x5) grade show the working grade name 
        if(iWorkingGrade % 5 > 0  && (iLevel ===  Math.floor(iWorkingGrade / 5) *5)) {
            return this.oGrades[this.sWorkingGrade];
        }
        return this.oGrades[iLevel];
    };
            
    this.save = function(oStudentData){
        if(typeof oStudentData === "undefined") {
            oStudentData = {};
            oStudentData.sEmail       = this.sEmail;
            oStudentData.sWorkingGrade = this.sWorkingGrade;
        }
        localStorage.setItem(this.sLocalStorageName, JSON.stringify(oStudentData));
        return this.load();
    };
    
    this.displayStudent = function() {
        $("#studentdetails").html(this.sEmail+" "+this.oGrades[this.sWorkingGrade]);
    };
    
    this.load = function() {
        if (localStorage.getItem(this.sLocalStorageName)) {
            var oStudentData   = JSON.parse(localStorage.getItem(this.sLocalStorageName));
            this.sEmail        = oStudentData.sEmail;
            this.sWorkingGrade = oStudentData.sWorkingGrade;
            this.displayStudent();
            this.loader.resolve();
            return true;
        }
        return false;
    };
    
    this.getCurrentStudent = function() {
        this.loader.then(this.displayStudent.bind(this), this.getCurrentStudent.bind(this));
        if(!this.load()) {
            if(this.sFormSelector) {
                this.studentInfoDialog();
            }
        }
    };
    
    this.isValidEmail = function(x) {
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
            //alert("Not a valid e-mail address");
            return false;
        }
        return true;
    };
    
    this.studentInfoDialog = function(){
        $(this.sFormSelector).modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
        
    };
    
    $("#student_save").click(function(){
        var oStudent = {};
        oStudent.sWorkingGrade = $("#student_workinggrade").val();
        oStudent.sEmail        = $("#student_email").val();
        console.log("oStudent =", oStudent);
        if(this.isValidEmail(oStudent.sEmail) === false) {
            console.log("not valid email");
            return false;
        }
        this.save(oStudent);
        $.modal.close();   
    }.bind(this));
    
    if(typeof sFormSelector !== "undefined") {
        this.sFormSelector = sFormSelector;
        this.getCurrentStudent();
    }
        
    
    this.getTargetLevel = function () {
        if( this.sWorkingGrade !== false) {
            return this.sWorkingGrade;
        }
        /* TODO : get working rade from LRS assesments
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
                    this.sWorkingGrade = "TODO";
                    return this.sWorkingGrade;
                }
            }
        );
        */
        /*
            activity
            http://adlnet.gov/expapi/activities/course
            
            the url for tht is the base of the activities.
        
            verb   
            assessed URI: http://edumake.org/verb/assessed
        
            {"name":{"en-US":"assessed"},"description":{"en-US":"Indicates the user had their work assessed by a human. And a mark was given (details mapping score to grade in context)."}}
        */      
    };
};
/* EXAMPLE : set up student object attached to form and change link
$( document ).ready(function() {
    var oStudent = new Student("#student-details-form");
});
*/
