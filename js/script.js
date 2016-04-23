$(document).on("ready", function() {

	// Global variables
	var currentClickedElement;
	var playerHasSong = false, wasPlaying = false;

	// --------- AUXILIAR FUNCTIONS ----------

	//function for play next song
	function playNext(autoplay) {
		// call to get the song
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "GET_NEXT_SONG"},
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				if (autoplay == true)
					$("#player").attr("src", "./music/" + data.file_name).trigger("play");
				else
					if (playerHasSong == false || wasPlaying == false)
						$("#player").attr("src", "./music/" + data.file_name);
			},
			error: function() {
				alert("error playing song");
			}
		});
	};

	// function for update the playlist container div
	function updatePlaylistLayout() {
		$("#playlist-hidden").text("");
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "INIT_PLAYLIST"},
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				$("#numSongs").text(data.length);
				if (data.length > 0) {
					playNext(false);
					// ajax call to fill the playlist hidden information
					$.ajax({
						url: 'services/applicationLayer.php',
						type: 'POST',
						dataType: 'json',
						data: {"action": "GET_PLAYLIST"},
						contentType: "application/x-www-form-urlencoded",
						success: function(objData) {
							var currentHTML = "", i;
							currentHTML += "<table clas='table'>";
							for(i = 0; i < objData.length; i++) {
								currentHTML += "<tr id='pos-" + i + "'>";
									currentHTML += "<td>" + (i+1) + ".   </td>";
									currentHTML += "<td>" + objData[i].name + "</td>";
									currentHTML += "<td> <span class='glyphicon glyphicon-remove'></span> </td>";
								currentHTML += "</tr>";
							}
							currentHTML += "</table>";
							$("#playlist-hidden").append(currentHTML);
						},
						error: function() {
							alert("error loading playlist hidden information");
						}
					});
				}
				else {
					playerHasSong = false;
					wasPlaying = false;
					$("#player").attr("src", "");
					$("#playlist-hidden").text("No hay canciones en playlist");
				}
			},
			error: function() {
				alert("error loading playlist");
			}
		});
	};

	function removeSong() {
		// ajax call to remove the already pleayed song
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "SKIP_SONG" },
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				if(data.length > 1) {
					//if there are songs in queue, I will play them
					if (wasPlaying == true) {
						playNext(true);
					}
					else {
						playNext(false);
					}
					playerHasSong = true;
				}
				updatePlaylistLayout();
			},
			error: function() {
				alert("error changing song");
			}
		});
	};


	// ---------- LISTENER FUNCTIONS ----------
	// NAVIGATION
	//hiding tabs
	$("#content-musica").hide();
	$("#content-fechas").hide();
	$("#playlist-hidden").hide();

	//navigation
	$("#nav li").on("click", function(){
		var id = $(this).attr("id");
		var current = $(".active").first().attr("id");

		$("#"+current).attr("class", "");
		$(this).attr("class", "active");

		$("#content-"+current).toggle('slow', function(){
			$("#content-"+id).toggle('slow');
		});
	});


	//PLAYLIST
	//call to load or create cookie for playlist
	updatePlaylistLayout();

	// function to delete any song from playlist
	$("#playlist-hidden").on("click", ".glyphicon-remove", function() {
		if ($(this).parent().parent().attr("id") == "pos-0") {
			removeSong();
		}
		else {
			$.ajax({
				url: 'services/applicationLayer.php',
				type: 'POST',
				dataType: 'json',
				data: {"action": "REMOVE_SONG", "id": $(this).parent().parent().attr("id") },
				contentType: "application/x-www-form-urlencoded",
				success: function(data) {
					updatePlaylistLayout();
				},
				error: function() {
					alert("error removing song from playlist");
				}
			});
		}
	});

	//add song to Playlist
	$("#content-musica").on("click", ".song", function() {
		$.ajax({
			url: 'services/applicationLayer.php',
			type: 'POST',
			dataType: 'json',
			data: {"action": "ADD_SONG_PLAYLIST", "id": $(this).attr("id") },
			contentType: "application/x-www-form-urlencoded",
			success: function(data) {
				// the first song in playlist, should be automatic played
				// is zero because the call will return the unupdated cookie
				if (data.length == 0 && playerHasSong == false) {
					playNext(true);
					playerHasSong = true;
				}
				updatePlaylistLayout();
			},
			error: function(data) {
				alert("error adding song to playlist");
			}
		});
	});

	// skip a song
	$("#skipSong").on("click", function() {
		removeSong();
	});

	// make appear hidden content in playlist
	$("#playlist-box > span:first-child").on("click", function(){
		if ($("#playlist-hidden").is(":hidden"))
			$("#playlist-box > span:first-child").attr("class", "glyphicon glyphicon-chevron-down");
		else
			$("#playlist-box > span:first-child").attr("class", "glyphicon glyphicon-chevron-up");
		$("#playlist-hidden").toggle('fast');
	});

	// when the player ends
	$('#player').on('ended', function() {
		playerHasSong = false;
		wasPlaying = true;
		removeSong(); //from cookie
	});

	// when the user clicks play on a already loaded song
	$("#player").on("play", function() {
		playerHasSong = true;
		wasPlaying = true;
	});

	// when the player makes a pause
	$("#player").on("pause", function(){
		wasPlaying = false;
	});

	//LOAD INFORMATION

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
			$("#content-noticias").prepend(currentHTML);
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
							currentHTML += "<td class='no-destacar'>" + data[i][j].track_number + "</td>";
							currentHTML += "<td class='song' id='song-" + data[i][j].id + "'>" + data[i][j].name + "</td>";
							currentHTML += "<td class='no-destacar'>" + data[i][j].duration + "</td>";
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

	// load tour dates
	$.ajax({
		url: 'services/applicationLayer.php',
		type: 'POST',
		dataType: 'json',
		data: {"action": "GET_TOURS"},
		contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			var currentHTML = "", i;
			currentHTML += "<table class='table'>";
			currentHTML += "<tr>";
				currentHTML += "<th> Fecha / Hora </th>";
				currentHTML += "<th> Lugar </th>";
				currentHTML += "<th> Ciudad </th>";
				currentHTML += "<th> Costo </th>";
			currentHTML += "</tr>";
			for(i = 0; i< data.length; i++) {
				currentHTML += "<tr>";
					currentHTML += "<td>" + data[i].date.substring(0, 16) + "</td>";
					currentHTML += "<td>" + data[i].address + "</td>";
					currentHTML += "<td>" + data[i].city + "</td>";
					currentHTML += "<td> $" + data[i].cost + "</td>";
				currentHTML += "</tr>";
			}
			currentHTML += "</table>";
			$("#content-fechas").append(currentHTML);
		},
		error: function() {
			alert("error loading tour dates");
		}
	});

	// ------ LOG ING -----

	//function to login
	$("input[type=submit]").on("click", function(e){
		e.preventDefault();
		var username = $("input[type=text]").val();
		var password = $("input[type=password]").val();
		if (username != "" && password != "") {
			$.ajax({
				url: 'services/applicationLayer.php',
				type: 'POST',
				dataType: 'json',
				data: {"action": "LOG_IN", "username": username, "password": password},
				contentType: "application/x-www-form-urlencoded",
				success: function() {
					window.location.replace("admin.html");
				},
				error: function() {
					alert("wrong credentials");
				}
			});
		}
		else {
			alert("please fill all fields");
		}
	});








});
