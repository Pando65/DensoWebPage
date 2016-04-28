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
	});

	//log out
	$("#logoutbtn").on("click", function(){
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "REMOVE_SESSION"},
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				window.location.replace("index.html");
			}
		});
	});

	function cleanFields() {
		$("input[type=text]").val("");
		$("input[type=number]").val("");
		$("input[type=date]").val("");
		$("textarea").val("");
	}

	$("#addContainer-1").hide();
	$("#addContainer-2").hide();
	$("#addContainer-3").hide();
	$("#addContainer-4").hide();
	$("#addContainer-5").hide();
	$("#edtContainer-1").hide();
	$("#edtContainer-4").hide();
	$("#edtContainer-5").hide();

	//navigation
	$(".dropdown-menu li").on("click", function(){
		$action = $(this).attr('id').substring(0, 3);
		$(currentSection).hide();
		if ($action == "add") {
			$("#addContainer-" + $(this).attr('id').substring(4, 5)).toggle();
			currentSection = "#addContainer-" + $(this).attr('id').substring(4, 5);

			//some changes we have to do
			$("#addContainer-1 input[type=hidden]").attr("value", "ADD_POST");
			$("#addContainer-1 input[type=file]").attr("required", true);
			$("#addContainer-1 h3").text("Añadir noticia");

			$("#addContainer-5 input[type=hidden]").attr("value", "ADD_POST");
			$("#addContainer-5 input[type=file]").attr("required", true);
			$("#addContainer-5 h3").text("Añadir miembro");

			$("#addContainer-4 input[type=hidden]").attr("value", "ADD_TOUR");
			$("#addContainer-4 h3").text("Añadir fecha de concierto");
		}
		if ($action == "edt") {
			$("#edtContainer-" + $(this).attr('id').substring(4, 5)).toggle();
			currentSection = "#edtContainer-" + $(this).attr('id').substring(4, 5);
		}

		cleanFields();
	});


	//add new resource (anyone)
	$("form").on("submit", function(e) {
		var form = new FormData($(this)[0]);
		e.preventDefault();
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: form,
			// contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				alert("Recurso publicado exitosamente");
				window.location.replace("admin.html");
			},
			error: function(data) {
				alert("Error uploading the resource");
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
				currentHTML += "<td> <a class='modif1Button'>Modificar</a> </td>";
				currentHTML += "</tr>";
			}
			currentHTML += "</table>";
			$("#edtContainer-1").append(currentHTML);
		},
		error: function() {
			alert("error loading posts to edit");
		}
	});

	//load tour dates to edit container
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_TOURS"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML="", i=0;
			currentHTML += "<table class='table'>";
			for(i = 0; i < data.length; i++) {
				currentHTML += "<tr id='edt4-" + data[i].id + "'>";
				currentHTML += "<td>" + data[i].city + "</td>";
				currentHTML += "<td>" + data[i].address + "</td>";
				currentHTML += "<td>" + data[i].date + "</td>";
				currentHTML += "<td> <a class='modif4Button'>Modificar</a> </td>";
				currentHTML += "</tr>";
			}
			currentHTML += "</table>";
			$("#edtContainer-4").append(currentHTML);
		},
		error: function() {
			alert("error loading tour dates to edit");
		}
	});

	//load members to edit container
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_MEMBERS"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML="", i;
			currentHTML += "<table class='table'>";
			for(i = 0; i<data.length;i++) {
				currentHTML += "<tr id='edt5-" + data[i].id + "'>";
				currentHTML += "<td>" + data[i].fname + " " + data[i].lname + "</td>";
				currentHTML += "<td> <a class='modif5Button'>Modificar</a> </td>";
				currentHTML += "</tr>";
			}
			currentHTML += "</table>";
			$("#edtContainer-5").append(currentHTML);
		}
	});

	//open form to modify a posts
	$("#edtContainer-1").on("click", ".modif1Button", function(){
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
				$('#addContainer-1 input[type=file]').removeAttr('required');
				$("#addContainer-1 h3").text("Modificar noticia");
				$("#addContainer-1 form").append("<input type='hidden' name='id' value='"+ data.id +"'>")
				$("#addContainer-1 input").first().val(data.title);
				$("#addContainer-1 textarea").first().val(data.content);

			},
			error: function() {
				alert("error retrieving post for edit");
			}
		})
	});

	//open form to modify a member of the band
	$("#edtContainer-5").on("click", ".modif5Button", function(){
		$(currentSection).hide();
		currentSection = "#addContainer-5";
		$(currentSection).toggle();
		currentClickedElement = $(this);
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "GET_MEMBER", "id": $(this).parent().parent().attr("id")},
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				$("#addContainer-5 input").eq(0).val(data.fname);
				$("#addContainer-5 input").eq(1).val(data.lname);
				$("#addContainer-5 input").eq(2).val(data.birth_date);
				$("#addContainer-5 input").eq(3).val(data.instruments);
				$("#addContainer-5 input").eq(4).val(data.member_since);
				$("#addContainer-5 textarea").first().val(data.biography);

				$("#addContainer-5 input[type=hidden]").attr("value", "EDIT_MEMBER");
				$("#addContainer-5 h3").text("Modificar miembro de la banda");
				$('#addContainer-5 input[type=file]').removeAttr('required');
				$("#addContainer-5 form").append("<input type='hidden' name='id' value='"+ data.id +"'>");
			},
			error: function() {
				alert("error retrieving members data for edit");
			}
		});
	});


	//open form to modify tour dates
	$("#edtContainer-4").on("click", ".modif4Button", function() {
		$(currentSection).hide();
		currentSection = "#addContainer-4";
		$(currentSection).toggle();
		currentClickedElement = $(this);
		//ajax to get all the information of the selected tour date
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "GET_TOUR", "id": $(this).parent().parent().attr("id")},
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				$("#addContainer-4 input").first().val(data.city);
				$("#addContainer-4 input").eq(1).val(data.address);
				$("#addContainer-4 input").eq(2).val(data.date.substring(0, 10));
				$("#addContainer-4 input").eq(3).val(data.date.substring(11));
				$("#addContainer-4 input").eq(4).val(data.cost);

				$("#addContainer-4 input[type=hidden]").attr("value", "EDIT_TOUR");
				$("#addContainer-4 h3").text("Modificar fecha de concierto");
				$("#addContainer-4 form").append("<input type='hidden' name='id' value='"+ data.id +"'>");

			},
			error: function() {
				alert("error retrieving tour date information for edit");
			}
		});
	});

});
