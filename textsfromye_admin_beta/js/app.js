"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "https://mis3502-thomas.com/8211";
let textbeltAPIkey = "b5ac5bbe74d6c4c162291e3972835bd73bf51679lwsHNIssUEEEKCBOmQy5s5Zxk";

localStorage.usertoken = 0;
localStorage.lastnavlink = '';

/* SUPPORTING FUNCTIONS */

let update_history = function(quote,quoteowner){
	
	let the_serialized_data = "quote=" + quote + "&quoteowner=" + quoteowner;

	$.ajax({
		"url": endpoint02 + "/quote",
		"data": the_serialized_data,
		"method": "POST",
		"success": function(result){
			console.log(result);

		},
		"error" : function(data){
			console.log(data);
		}
	});
}

let get_a_quote = function(quoteowner){

	$.ajax({
		"url" : 'https://api.kanye.rest/',
		"method" : "GET",
		"success" : function(result){
			console.log(result);
			let message = result["quote"];
			send_the_text(quoteowner,message);
			console.log(message);
		},
		"error" : function(data){
			console.log(data);
		}
	});
}
let send_the_text = function(quoteowner,message){
	//get_a_quote();
	//let message = $("#temp-quote").val();
	let textmessage = '"' + message + '" - Kanye                              	https://mis3502-thomas.com/textsfromye_user_beta/';
	let the_serialized_data = "phone=" + quoteowner + "&key=" + textbeltAPIkey + "&message=" + textmessage;
	console.log(the_serialized_data);
	 
	$.ajax({
		"url" : 'https://textbelt.com/text',
		"data" : the_serialized_data,
		"method" : "POST",
		"success" : function(result){
			console.log(result);
			update_history(message,quoteowner);
			//$(".content-wrapper").hide();
			console.log("Text sent successfully");
			$("#message").addClass("alert alert-success");
			$("#message").html("Text sent successfully");
		},
		"error" : function(data){
			console.log(data);
		//	$(".content-wrapper").hide();
		//	$("#div-code").show();
			$("#message").addClass("alert alert-danger");

			$("#message").html("Problem sending text");

		}
	});
}; //end send the text

let navigationControl = function(the_link){

	/* manage the content that is displayed */
	let idToShow = $(the_link).attr("href");
	localStorage.lastnavlink = idToShow;

	console.log(idToShow);

	if (idToShow == '#div-login' ){
		/* what happens if the login/logout link is clicked? */
		localStorage.usertoken = 0;
		$(".secured").addClass("locked");
		$(".secured").removeClass("unlocked");
	}

	$(".content-wrapper").hide(); 	/* hide all content-wrappers */
	$(idToShow).show(); /* show the chosen content wrapper */
	$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
	$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */

} /* end navigation control */

let loginController = function(){
	//go get the data off the login form
	let the_serialized_data = $('#form-login').serialize();
	//the data I am sending
	console.log(the_serialized_data);;
	let url = endpoint01;
	$.getJSON(url,the_serialized_data,function(data){
		//the data I got back
		console.log(data);
		if (typeof data === 'string'){
			localStorage.usertoken = 0; // login failed.  Set usertoken to it's initial value.
			$('#login_message').html(data);
			$('#login_message').show();
		} else {
			$('#login_message').html('');
			$('#login_message').hide();
			localStorage.usertoken = data['user_id']; //login succeeded.  Set usertoken.
			$('.secured').removeClass('locked');
			$('.secured').addClass('unlocked');
			$('#div-login').hide();
			$('#div-menu').show();
		}
	});
	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};
let numbersListController = function(){
	console.log("You are in the numbersListController");
	// overwrite what is in the task table right now
	//$("#table-numbers").html("<tr><th>Task Name</th></tr>");
	$.ajax({
		"url" : endpoint02 + "/numbers",
		"method" : "GET",
		"success" : function(result){
			console.log(result); // the data I got back
			//write a loop
			if(result.length==0){
				$("#message").addClass("alert alert-success");
				$("#message").html("No quotes");
				$("#message").show();
			} else {
			for (let i = 0; i < result.length; i++){
				let tablerow = "<tr><td>";
				tablerow = tablerow + result[i]["quoteowner"];
				tablerow = tablerow + "</td><td>"
				tablerow = tablerow + '<a href="#" onclick="historyController(' + result[i]["quoteowner"] + ')" class="btn btn-info ">History</a>'
				tablerow = tablerow + '&nbsp <a href="#" onclick="get_a_quote(' + result[i]["quoteowner"] + ')" class="btn btn-success ">Send Text</a>'
				tablerow = tablerow + "</td></tr>";
				$("#table-numbers").append(tablerow);
			}
		}
			//make a string for each item in the loop
			//append into #table-tasks in each step of the loop
		},
		"error" : function(data){
			console.log(data);
		}
		
	});

}

let historyController = function(quoteowner){
	$("#table-history").html("<tr><th>Quotes</th><th>Date</th></tr>");
	console.log("You are in the history controller");
	console.log(quoteowner);
	let the_serialized_data = "quoteowner="+quoteowner;
	console.log(the_serialized_data);
	$.ajax({
		"url" : endpoint02 + "/history",
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			console.log(result);
			$(".content-wrapper").hide();
			$("#div-history").show();
			// put the detail into the div-detail 
			for (let i = 0; i < result.length; i++){
				let tablerow = "<tr><td>";
				tablerow = tablerow + result[i]["quote"];
				tablerow = tablerow + "</td><td>";
				tablerow = tablerow + result[i]["date"];
				tablerow = tablerow + "</td></tr>";
				$("#table-history").append(tablerow);
			}
		},
		"error" : function(data){
			console.log(data)
		}
	});
	// ajax - go get the detail for the taskid 
	// put the detail into the div-detail portion of the html
	// hide alldivs of class content wrapper
	// show div detail
}

//document ready section
$(document).ready(function (){

    /* ------------------  basic navigation ----------------*/

	/* lock all secured content */
	$('.secured').removeClass('unlocked');
	$('.secured').addClass('locked');


    /* this reveals the default page */
    $("#div-splash").show();
    //$(".content-wrapper").show();

    /* this controls navigation - show / hide pages as needed */

	/* what to do when a navigation link is clicked */
	$(".nav-link").click(function(){
		navigationControl(this);
	});
		
	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		//client side error trap goes here.
		$("#login_message").hide();
		$("#login_message").html("");
		let username = $("#username").val();
		let password = $("#password").val();
		if (username=="" || password==""){
			$("#login_message").html("You must provide both a username and password.");	
			$("#login_message").show();
		} else {
			loginController();
		
		}
	});
		
	/* what happens if the next button is clicked? */
	$('#btnNext').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		numbersListController();
		
		$("#div-login").show(); /* show the chosen content wrapper */
	});
						
	/* what happens if the make button is clicked? */
	$('#btnMake').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-edit").show(); /* show the chosen content wrapper */
	});
					
	/* what happens if any button on the div-add is clicked? */
	/* Being lazy here.  come back later. */
	$('#div-edit input').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-menu").show(); /* show the chosen content wrapper */
	});
		
	/* what happens if the stats link is clicked? */
	$('#linkStats').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-stats").show(); /* show the chosen content wrapper */
	});
		
	/* what happens if the edit link is clicked? */
	$('#linkEdit').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-edit").show(); /* show the chosen content wrapper */
	});

	/* what happens if btnBack is clicked? */
	$('#btnBack').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-menu").show(); /* show the chosen content wrapper */
	});
		
}); /* end the document ready event*/
