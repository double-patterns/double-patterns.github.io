/*
Tim Forman 201902
Last Updated 29Apr
*/

//Stores entered codes
var pattern1 = [];
var pattern2 = [];
var cur_pattern = [];

//For recall attempts
var attempts0 = [];
var attempts1 = [];

//Visual error on pattern interface
var FIRST_PATT = ".patt-patt1"
var SECOND_PATT = ".patt-patt2"

//Feedback window messages
var MSG_INVALID_LEN="You need to connect at least 4 dots.<br />Try again.";
var MSG_REPEAT = "Your two patterns must be distinct.<br />Try again.";
var MSG_ENTRY = "Draw your first pattern of the Double Pattern.";
var MSG_ENTRY_2 = "Draw your second pattern of the Double Pattern.";
var MSG_CONTINUE = "Double Pattern saved. Click continue to confirm.";
var MSG_CONFIRM = "Draw your first pattern of the Double Pattern again to confirm it.";
var MSG_CONFIRM_2 = "Draw your second pattern of the Double Pattern again to confirm it.";
var MSG_WRONG = "Double Pattern does not match.<br />Try again or reset.";
var MSG_CORRECT = "Your Double Pattern has been set as:";
var MSG_DRAW = "Release finger when finished.";

var MSG_GOOD_RECALL = "You have correctly recalled your Double Pattern.";
var MSG_RECALL = "Please recall your first pattern of the Double Pattern.";
var MSG_RECALL_2 = "Please recall your second pattern of the Double Pattern.";
var MSG_BAD_RECALL = "Incorrect pattern drawn."
var MSG_FORGOT = "You have forgotten your Double Pattern.";
var MSG_ATTEMPTS = "Incorrect pattern drawn.<br />No more attempts.";
var MSG_TROUBLE = "You appear to be having trouble recalling your Double Pattern."

//Buttons to be displayed
var RES_HTML = "<button type='button' onclick='pat_reset()' class='btn inter'>Reset</button>";
var NORES_HTML = "<button type='button' class='btn inter nobut'>Reset</button>";
var PRACT_HTML = "<button type='button' onclick='pat_reset()' class='btn inter'>More Practice</button>";
var CONT_HTML = "<button type='button' onclick='entry_save()' class='btn inter'>Continue</button>";
var NOCONT_HTML = "<button type='button' class='btn inter nobut'>Continue</button>";
var CONF_HTML = "<button type='button' onclick='entry_continue()' class='btn inter'>Confirm</button>";
var NOCONF_HTML = "<button type='button' class='btn inter nobut'>Confirm</button>";

var RECALL_HTML = "<button type='button' onclick='recall_norecall()' class='btn inter'>Cannot Recall</button>";
var NORECALL_HTML = "<button type='button' class='btn inter nobut'>Cannot Recall</button>";

//Button combos available
var NO_BUT = 0;     //No Reset, No Continue
var RCONT_BUT = 1;  //Reset, No Continue
var CONT_BUT = 2;   //Reset, Continue
var RCONF_BUT = 3;  //Reset, No Confirm
var CONF_BUT = 4;   //Reset, Confirm
var PRAC_BUT = 5;   //More Practice, Confirm
var NOREC_BUT = 6;  //No Recall
var REC_BUT = 7;    //Recall
var DONE_BUT = 8;   //No Reset, No Confirm
var SAME_BUT = 9;   //Same Buttons

//Sequential operation of functions
var codes = 0;
var round = 0;
var firstPatt = 0;

//Storing timing information
var times = [];

//-----------------------------------------
//Auxiliary Functions

//Triggers feedback messages on loading the page
function start(){
    if(document.getElementById("flow").value == "pract" ||
       document.getElementById("flow").value == "entry" ){
	feedback(MSG_ENTRY,NO_BUT);
    }
    else if(document.getElementById("flow").value == "recall"){
	feedback(MSG_RECALL,NOREC_BUT);
    }
}

//Once the pattern is entered on the interface, this function is called
function choose_flow(){ 
    if(document.getElementById("flow").value == "pract" ||
       document.getElementById("flow").value == "entry" ){
	if(round == 0){	
	    if(codes == 0)
		entry(Array.from(lock1.getPattern()).map(x=>x-1).join('')); 
	    else
		entry(Array.from(lock2.getPattern()).map(x=>x-1).join('')); 
	}
	else if(round == 1){
	    if(codes == 0)
		entry2(Array.from(lock1.getPattern()).map(x=>x-1).join('')); 
	    else
		entry2(Array.from(lock2.getPattern()).map(x=>x-1).join(''));
	}
    }
    else if(document.getElementById("flow").value == "recall"){
	pattern1 = Array.from(document.getElementById("code0").value).join('');
	pattern2 = Array.from(document.getElementById("code1").value).join('');
	recall();
    }
}

//Compare pattern
function cmp_pat(p1,p2){
    if(p1.length != p2.length) return false;
    for( var i = 0 ; i< p1.length ; i++)
        if(p1[i] != p2[i]) return false;
    return true;
}

//Length entered is too short
function inv_length(){
        cur_pattern=[];
	if(codes == 0){
	    lock_first();
	    wrong_entry(FIRST_PATT);
	}
	else{
	    lock_second();
	    wrong_entry(SECOND_PATT);
	}
    recall_check();
}


//-----------------------------------------
//Entry Workflow

//Entering the Double Pattern
function entry(pat){
    cur_pattern = pat;
    
    //Invalid length pattern
    if(cur_pattern.length < 4){
	feedback(MSG_INVALID_LEN,NO_BUT);
	inv_length();
	return;
    }

    //Second code is identical to first
    if(codes == 1 && cmp_pat(cur_pattern,pattern1)){
	lock_second();
        feedback(MSG_REPEAT,NO_BUT)
	setTimeout(function() {pat_reset();}, 1000);
	return;
    }

    //Successful pattern entry
    if(codes == 0){
	display_suc();
	pattern1 = cur_pattern;
	codes++;
	feedback(MSG_ENTRY_2, RCONT_BUT);
    }
    else if(codes == 1){
	pattern2 = cur_pattern;
	lock_second();
	feedback(MSG_CONTINUE,CONT_BUT);    
    }
}

//Confirming the Double Pattern
function entry2(pat){
    cur_pattern = pat;

    //Invalid length pattern
    if(cur_pattern.length < 4){
	feedback(MSG_INVALID_LEN,DONE_BUT);
        inv_length();
	setTimeout(function() {feedback(MSG_CONFIRM,RCONF_BUT);}, 1500);
	return;
    }

    //Confirming the first pattern
    if(codes == 0){
	//First pattern correct
	if(cmp_pat(cur_pattern,pattern1)){
	    firstPatt = 1;
	}
	display_suc();
	codes++;
	feedback(MSG_CONFIRM_2,RCONF_BUT);
    }
    //Confirming the second pattern
    else{
	//Second pattern correct
	if(firstPatt == 1 && cmp_pat(cur_pattern,pattern2)){
	    lock_second();
	    entry_end();
	}
	//Either pattern incorrect
	else{
	    both_wrong();
	    feedback(MSG_WRONG,DONE_BUT);
	    setTimeout(function() {display_res(); feedback(MSG_CONFIRM,RCONF_BUT);}, 1500);	
	}
    }
}

//Save the Double Pattern for confirmation
function entry_save(){
    round++;
    firstPatt = 0;
    codes = 0;
    display_res();  
    feedback(MSG_CONFIRM,RCONF_BUT);
}

//Double Pattern confirmed, user prompted to continue
function entry_end(){
    if(document.getElementById("flow").value == "pract")
	feedback(MSG_CORRECT,PRAC_BUT);    
    else if(document.getElementById("flow").value == "entry"){
	feedback(MSG_CORRECT,DONE_BUT);
	setTimeout(function() {entry_continue();}, 800);
    }
}

//User has elected to continue, save patterns and POST
function entry_continue(){
    document.getElementById("code0").value = pattern1; //keep it as a list
    document.getElementById("code1").value = pattern2; //keep it as a list
    form = document.getElementById("resultForm");
    document.getElementById("time").value = JSON.stringify(times);
    form.submit();
}


//-----------------------------------------
//Recall Workflow

//User is asked to recall their Double Pattern
function recall(){

    //Pattern to be checked
    if(codes == 0){
	cur_pattern = Array.from(lock1.getPattern()).map(x=>x-1).join('');
	attempts0.push(cur_pattern);
    }
    else{
	cur_pattern = Array.from(lock2.getPattern()).map(x=>x-1).join('');
	attempts1.push(cur_pattern);
    }

    //Invalid length pattern
    if(cur_pattern.length < 4){
	feedback(MSG_BAD_RECALL,SAME_BUT)
	inv_length();
	return;
    }
    
    //Checking the first pattern
    if(codes == 0){
	feedback(MSG_RECALL_2,SAME_BUT);	
	//First pattern is correct
	if(cmp_pat(cur_pattern,pattern1))
	    firstPatt = 1;
        codes++;
	display_suc();
    }
    //Checking the second pattern
    else if(codes == 1){
	//Both patterns are correct
        if(firstPatt == 1 && cmp_pat(cur_pattern,pattern2)){
	    feedback(MSG_GOOD_RECALL,SAME_BUT);
	    lock_second();
	    setTimeout(function() {recall_continue(); }, 800);
	}
	//Second pattern is incorrect
	else{
	    lock_second();
	    both_wrong();
	    recall_check();
	    feedback(MSG_BAD_RECALL, SAME_BUT);
	    setTimeout(function() {display_res(); feedback(MSG_RECALL,SAME_BUT);}, 1500);
	}
    }
}

//Double Pattern has been correctly recalled, POST
function recall_continue(){
    if(document.getElementById("forgot_0").value != "True")
	document.getElementById("forgot_0").value = "False";
    if(document.getElementById("forgot_1").value != "True")
	document.getElementById("forgot_1").value = "False";
    document.getElementById("attempt_0").value = JSON.stringify(attempts0); //keep it as a list
    document.getElementById("attempt_1").value = JSON.stringify(attempts1); //keep it as a list
    form = document.getElementById("resultForm");
    document.getElementById("time").value = JSON.stringify(times);
    form.submit();
}

//Double Pattern was forgotten at some point, make sure values are correctly populated
function recall_norecall(){
    timer("CNR")
    if(codes == 0){
	document.getElementById("forgot_0").value = "True";
	feedback(MSG_FORGOT,NOREC_BUT);
	setTimeout(function() {recall_continue();}, 1500);
    }
    else{
	document.getElementById("forgot_1").value = "True";
	feedback(MSG_FORGOT,NOREC_BUT);
	setTimeout(function() {recall_continue();}, 1500);
    }
}

//Check number of attempts left
function recall_check(){
    //Out of attempts
    if(attempts0.length >= 5){
	feedback(MSG_ATTEMPTS,NOREC_BUT);
	if(codes == 0)
	    lock_first();
	else
	    lock_second();	
	setTimeout(function() {recall_norecall(); }, 1500);
    }
    else if(attempts0.length < 3){
	setTimeout(function() {feedback(MSG_RECALL,SAME_BUT);display_res();}, 1500);	
    }
    else{
	feedback(MSG_TROUBLE,SAME_BUT);
	setTimeout(function() {feedback(MSG_RECALL,REC_BUT);display_res();}, 1500);	
    }
    
}


//-----------------------------------------
//Interface Functionality

//Resets codes, sequential values, and visual interface
function pat_reset(){
    pattern1=[];
    pattern2=[];
    cur_pattern=[];
    round = 0;
    codes = 0;
    feedback_clr();
}

//Changes interface display upon successful entry of first pattern
function display_suc(){
    $("#pattern2").css("opacity",".7");
    $("#pattern2").css("z-index","3");
    $(".patt-patt1 > .patt-wrap").css("opacity","0");
    $("#pattern1").css("z-index","1");
    $(".patt-patt1 > .patt-lines").css("background","black");    
}

//Flashes wrong entry pattern for user feedback
function wrong_entry(patt){
    $(patt+" > .patt-wrap > .patt-circ.hovered").css("border","3px solid #ff0000");
    setTimeout(function(){$(patt+" > .patt-wrap > .patt-circ.hovered").css("border","3px solid #ffffff");}, 500);
    setTimeout(function(){$(patt+" > .patt-wrap > .patt-circ.hovered").css("border","3px solid #ff0000");}, 1000);
    setTimeout(function(){$(patt+" > .patt-wrap > .patt-circ.hovered").css("border","");}, 1400);
}

//Locks input on the first pattern interface
function lock_first(){
    $("#pattern1").css("z-index","2")
    $("#pattern3").css("z-index","3")
}

//Locks input on the second pattern interface
function lock_second(){
    $("#pattern2").css("z-index","2")
    $("#pattern3").css("z-index","3")
}

//Resets the entire display, the locks, and the times
function display_res(){
    codes = 0;
    firstPatt = 0;
    lock1.reset();
    lock2.reset();
    $(".patt-patt1 > .patt-lines").css("background","clear");    
    $(".patt-patt1 > .patt-wrap").css("opacity","1");
    $("#pattern1").css("opacity","1")
    $("#pattern2").css("opacity","0")
    $("#pattern1").css("z-index","3")
    $("#pattern2").css("z-index","2")
    $("#pattern3").css("z-index","1")  
    timer("R")
}

//Bring both pats to the front
function both_wrong(){
    $("#pattern2").css("z-index","2");
    $("#pattern3").css("z-index","3");
    $("#pattern1").css("opacity","1");
    $("#pattern2").css("opacity",".65");
    $(".patt-patt1 > .patt-wrap").css("opacity","1");
    wrong_entry(FIRST_PATT);
    wrong_entry(SECOND_PATT);
}

//-----------------------------------------
//Message Functionality

//Clears any feedback
function feedback_clr(){
    feed = document.getElementById("codeFeedback");
    feed.innerHTML=""
    display_res();
    feedback(MSG_ENTRY,NO_BUT);
}

//Displays a feedback message
function feedback(msg, butt){
    feed = document.getElementById("codeFeedback");
    feed.innerHTML=msg;

    buttons = document.getElementById("ButtonInterface");
    buttons.innerHTML = retrieveButtons(butt);
}

//Integer cases for buttons
function retrieveButtons(butt){
    if(butt == NO_BUT)
	return NORES_HTML + " " + NOCONT_HTML;
    else if(butt == RCONT_BUT)
	return RES_HTML + " " + NOCONT_HTML;
    else if(butt == CONT_BUT)
	return RES_HTML + " " + CONT_HTML;
    else if(butt == RCONF_BUT)
	return RES_HTML + " " + NOCONF_HTML;
    else if(butt == CONF_BUT)
	return RES_HTML + " " + CONF_HTML;
    else if(butt == PRAC_BUT)
	return PRACT_HTML + " " + CONF_HTML;
    else if(butt == NOREC_BUT)
	return NORECALL_HTML;
    else if(butt == REC_BUT)
	return RECALL_HTML;
    else if(butt == DONE_BUT)
	return NORES_HTML + " " + NOCONF_HTML;
    else if(butt == SAME_BUT)
	return document.getElementById("ButtonInterface").innerHTML;
    else
	return "";
}


//-----------------------------------------
//Timer Functionality

//Calls timer to get current time
function timer(call){
    times.push([call,performance.now()]);
}

//Feedback for touchstart
function drawing(){
    feedback(MSG_DRAW, SAME_BUT);
}

//Feedback for touchend
function release(){
    if(round == 0)
	feedback(MSG_ENTRY, SAME_BUT);
    else if(round == 1)
	feedback(MSG_CONFIRM, SAME_BUT);
    else
	feedback(MSG_RECALL, SAME_BUT);
}



