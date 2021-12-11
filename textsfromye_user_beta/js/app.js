"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "https://mis3502-thomas.com/8211";

/* SUPPORTING FUNCTIONS */

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
			$("#div-history").hide();
			$("#div-main").show();
			$("#message").addClass("alert alert-danger");
			if(quoteowner == ""){
				$("#message").html("Enter a number to see your history");
			}
			else if (quoteowner.length != 10){
			$("#message").html("Please enter a ten digit phone number");
			}
			else {
				$("#message").html("There is no history for this number");
			}
		}
	});
}

let addPhoneNumber = function(quoteowner){
	
	let the_serialized_data = "quoteowner=" + quoteowner;
	console.log(the_serialized_data);

	if (quoteowner.length != 10){
		$("#message").addClass("alert alert-danger");
		$("#message").html("Please enter a ten digit phone number.");
	}
	else{

	$.ajax({
		"url": endpoint02 + "/numbers",
		"data": the_serialized_data,
		"method": "POST",
		"success": function(result){
			console.log(result);
			$("#message").addClass("alert alert-success");
			$("#message").html("Phone Number Added Successfully!");
		},
		"error" : function(data){
			console.log(data);
			$("#message").addClass("alert alert-danger");
			$("#message").html("Error. Could not add phone number.");
		}
	});
	}
}

//it's handy to put these commands together.
//Sometimes you just want to wipe out all the input values
//and start over.
let cleanSlate = function(){
	$('#form-sms').val("");

}

let navigationControl = function(the_link){

	/* manage the content that is displayed */
	let idToShow = $(the_link).attr("href");
	localStorage.lastnavlink = idToShow;

	console.log(idToShow);

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
			$('#div-code').show();
			// maybe some other things later..
			$('#playerid').val(localStorage.usertoken);	
			cleanSlate();
		}
	});
	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};


//document ready section
$(document).ready(function (){

    /* --------------- what happens on page ready? ----------------*/

	/* lock all secured content */
	$('.secured').removeClass('unlocked');
	$('.secured').addClass('locked');
	$("#div-main").show();

    /* ------------------  basic navigation ----------------*/
	/* is the user already logged in? */
	/*	console.log(localStorage.usertoken)
			if (localStorage.usertoken == undefined){
				/* lock all secured content */
	/*			$('.secured').removeClass('unlocked');
				$('.secured').addClass('locked');
				/* this reveals the default page */
		/*		$("#div-main").show();
			} else {
				/* unlock all secured content */
		/*		$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				/* this reveals the default page */
		/*		$("#div-main").show();
				// maybe some other things later..
				$('#playerid').val(localStorage.usertoken);	
				cleanSlate();
			}
    /* this controls navigation - show / hide pages as needed */

	/* what to do when a navigation link is clicked */
	$(".nav-link").click(function(){
		navigationControl(this);
	});
		
	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		loginController();
	});

	/* what happens if the logout link is clicked? */
	$('#link-logout').click(function(){
		/* what happens if the login/logout link is clicked? */
		localStorage.removeItem("usertoken");
		$(".secured").addClass("locked");
		$(".secured").removeClass("unlocked");
		window.location = ".";
	});

	/* what happens if the next button is clicked? */
	$('#btnKanye').click(function(){
		let quoteowner = $("#phonenumber").val()
		addPhoneNumber(quoteowner);
	});

	$('#btnHistory').click(function(){

		let quoteowner = $("#phonenumber").val();
		historyController(quoteowner);
	});

	$('#btnBack').click(function(){
		$(".content-wrapper").hide(); 	/* hide all content-wrappers */
		$("#div-main").show(); /* show the chosen content wrapper */
	});

				
}); /* end the document ready event*/
