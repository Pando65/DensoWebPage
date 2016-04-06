$(document).on("ready", function() {
	//hiding tabs
	$("#content-musica").hide();

	//load Posts
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_POSTS"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML = "", i;
			for(i = 0; i < data.length; i++) {
				currentHTML += "<div class='post'>"
					currentHTML += "<h2>" + data[i].title + "</h2>";
					currentHTML += "<p>" + data[i].content + "</p>";
				currentHTML += "</div>";
			}
			$("#content-noticias").append(currentHTML);
		},
		error: function() {
			alert("error");
		}
	})


	//navigation
	$("#nav li").on("click", function(){
		var id = $(this).attr("id");
		var current = $(".active").first().attr("id");

		$("#"+current).attr("class", "");
		$(this).attr("class", "active");

		$("#content-"+current).toggle('slow', function(){
			$("#content-"+id).toggle('slow');
		});
	})




});
