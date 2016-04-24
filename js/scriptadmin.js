$(document).on("ready", function(){
	var currentSection = "";
	var currentClickedElement;

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
	$("#addContainer-3").hide();
	$("#edtContainer-1").hide();

	//navigation
	$(".dropdown-menu li").on("click", function(){
		$action = $(this).attr('id').substring(0, 3);
		$(currentSection).hide();
		if ($action == "add") {
			$("#addContainer-" + $(this).attr('id').substring(4, 5)).toggle();
			currentSection = "#addContainer-" + $(this).attr('id').substring(4, 5);
		}
		if ($action == "edt") {
			$("#edtContainer-" + $(this).attr('id').substring(4, 5)).toggle();
			currentSection = "#edtContainer-" + $(this).attr('id').substring(4, 5);
		}
	});

	//add or edit post
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
				alert("Post publicado exitosamente");
				window.location.replace("admin.html");
			},
			error: function(data) {
				alert("Error adding the post");
			},
			cache: false,
			contentType: false,
		 	processData: false
		});
	});

	//add new song
	$("#addContainer-3 form").on("submit", function(e) {
		var form = new FormData($(this)[0]);
		e.preventDefault();
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: form,
			// contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				alert("Cancion publicada exitosamente");
				window.location.replace("admin.html");
			},
			error: function(data) {
				alert("Error uploading the song");
			},
			cache: false,
			contentType: false,
		 	processData: false
		});
	});

	//load albums in container 3
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_ALBUMS"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML = "", i;
			for(i = 0; i< data.length; i++)
				currentHTML += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
			$("#discos").append(currentHTML);
		},
		error: function() {
			alert("error loading albums");
		}
	});

	//load post to edit container
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_POSTS"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML="", i = 0;
			currentHTML += "<table class='table'>";
			for(i = 0; i < data.length; i++) {
				currentHTML += "<tr id='edt-" + data[i].id +"'>";
				currentHTML += "<td>" + data[i].title + "</td>";
				currentHTML += "<td> <a class='modifButton'>Modificar</a> </td>";
				currentHTML += "</tr>";
			}
			currentHTML += "</table>";
			$("#edtContainer-1").append(currentHTML);
		},
		error: function() {
			alert("error loading posts to edit");
		}
	});

	//open form to modify a posts
	$("#edtContainer-1").on("click", ".modifButton", function(){
		$(currentSection).hide();
		currentSection = "#addContainer-1";
		$(currentSection).toggle();
		currentClickedElement = $(this);
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "GET_POST", "id": $(this).parent().parent().attr("id")},
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				$("#addContainer-1 input[type=hidden]").attr("value", "EDIT_POST");
				$("#addContainer-1 form").append("<input type='hidden' name='id' value='"+ currentClickedElement.parent().parent().attr("id") +"'>")
				$("input").first().val(data.title);
				$("textarea").first().val(data.content);

			},
			error: function() {
				alert("error retreving post for edit");
			}
		})
	});

});
