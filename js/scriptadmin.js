$(document).on("ready", function(){
	var currentSection = "";

	//load session
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_SESSION"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			$("#currentUser").text(data.username);
		},
		error: function() {
			alert("Session has expired");
			window.location.replace("index.html");
		}
	})

	$("#addContainer-1").hide();
	$("#addContainer-2").hide();

	//navigation
	$(".dropdown-menu li").on("click", function(){
		$action = $(this).attr('id').substring(0, 3);
		if ($action == "add") {
			$(currentSection).hide();
			$("#addContainer-" + $(this).attr('id').substring(4, 5)).toggle();
			currentSection = "#addContainer-" + $(this).attr('id').substring(4, 5);
		}
	});

	//add new post
	$("#addContainer-1 form").on("submit", function(e){
		var form = new FormData($(this)[0]);
		e.preventDefault();

		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: form,
			// contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				alert("Ok");
			},
			error: function(data) {
				alert("Error adding the post");
			},
			cache: false,
			contentType: false,
		 	processData: false			
		});
	});


});
