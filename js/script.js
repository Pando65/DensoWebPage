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
				currentHTML += "<div class='post'>";
					currentHTML += "<h2>" + data[i].title + "</h2>";
					currentHTML += "<div class='date'> Publicado el " + data[i].post_date.substring(0,10) + "</div>";
					currentHTML += "<img class='newphoto' src='./images/posts/" + data[i].cover_photo + "'/>";
					currentHTML += data[i].content;
				currentHTML += "</div>";
				if (i != data.length - 1)
					currentHTML += "<hr>";
			}
			$("#content-noticias").append(currentHTML);
		},
		error: function() {
			alert("error loading news");
		}
	})

	//load music
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_MUSIC"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML="", i, j;
			for(i = 0; i < data.length; i++) {
				currentHTML += "<div class='album'>";
					currentHTML += "<img src='./images/albums/" + data[i][0].cover_photo + "'/>";
					currentHTML += "<h2>" + data[i][0].name + "</h2>";
					currentHTML += "<div class='date'> Lanzamiento: "+ data[i][0].release_date.substring(0,4) + "</div>";
					currentHTML += "<div class='songs-container'>"
					currentHTML += "<table>";
				for(j = 1; j < data[i].length; j++) {
						currentHTML += "<tr>";
							currentHTML += "<td>" + data[i][j].track_number + "</td>";
							currentHTML += "<td>" + data[i][j].name + "</td>";
							currentHTML += "<td>" + data[i][j].duration + "</td>";
						currentHTML += "</tr>";
				}
					currentHTML += "</table>";
				currentHTML += "</div>";
				currentHTML += "</div>";
				if (i != data.length - 1)
					currentHTML += "<hr>";
			}
			$("#content-musica").append(currentHTML);
		},
		error: function() {
			alert("error loading music");
		}
	});


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
