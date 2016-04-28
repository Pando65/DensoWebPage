<?php
	header('Accept: application/json');
	header('Content-type: application/json');
	require_once __DIR__ . '/dataLayer.php';

	$action = $_POST["action"];
	switch ($action) {
		case 'GET_POSTS': getPosts();
			break;
		case 'GET_MUSIC': getMusic();
			break;
		case 'GET_ALBUMS': getAlbums();
			break;
		case 'ADD_SONG_PLAYLIST': addSongToPlaylist();
			break;
		case 'INIT_PLAYLIST': initPlaylist();
			break;
		case 'GET_NEXT_SONG': getNextSong();
			break;
		case 'SKIP_SONG': skipSong();
			break;
		case 'GET_PLAYLIST': getPlaylist();
			break;
		case 'GET_TOURS': getTours();
			break;
		case 'REMOVE_SONG': removeSong();
			break;
		case 'LOG_IN': login();
			break;
		case 'GET_SESSION': getSessionData();
			break;
		case 'ADD_POST': addPost();
			break;
		case 'SEND_EMAIL': sendEmail();
			break;
		case 'UPLOAD_SONG': uploadSong();
			break;
		case 'EDIT_POST': editPost();
			break;
		case 'GET_POST': getPost();
			break;
		case 'GET_TOUR': getTour();
			break;
		case 'EDIT_TOUR': editTour();
			break;
		case 'REMOVE_SESSION': destroySession();
			break;
		case 'GET_MEMBERS': getMembers();
			break;
		case 'GET_MEMBER': getMember();
			break;
		case 'EDIT_MEMBER': editMember();
			break;
		default: break;
	}

	function startSession($id, $username) {
		session_start();
		$_SESSION["id"] = $id;
		$_SESSION["username"] = $username;
	}

	function destroySession() {
		session_start();
		session_destroy();
		echo json_encode("SUCCESS");
	}

	function isSessionActive() {
		session_start();
		if(isset($_SESSION["id"]) && isset($_SESSION["username"]))
			return true;
		return false;
	}

	function getPosts() {
		$response = getPostsAction();
		if($response["statusText"] == "SUCCESS") {
			echo json_encode($response["data"]);
		}
		else {
			header('HTTP/1.1 406 Problem with database');
			die(json_encode(array("message" => "ERROR", "code" => 1330)));
		}
	}

	function getMusic() {
		$response = getMusicAction();
		if($response['statusText'] == "SUCCESS") {
			echo json_encode($response["data"]);
		}
		else {
			header('HTTP/1.1 406 Problem with database');
			die(json_encode(array("message" => "ERROR", "code" => 1330)));
		}
	}

	function getAlbums() {
		$response = getAlbumsAction();
		if($response['statusText'] == "SUCCESS") {
			echo json_encode($response["data"]);
		}
		else {
			header('HTTP/1.1 406 Problem with database');
			die(json_encode(array("message" => "ERROR", "code" => 1330)));
		}
	}

	function addSongToPlaylist() {
		$playlist = $_COOKIE["playlist"];
		// $playlist = stripslashes($playlist);
		$playlist = json_decode($playlist, true);
		array_push($playlist, substr($_POST["id"], 5));
		setcookie('playlist', json_encode($playlist));
		echo $_COOKIE["playlist"];
	}

	function initPlaylist() {
		// unset($_COOKIE["playlist"]);
		// setcookie("playlist", null, -1);
		if (isset($_COOKIE["playlist"])) {
			echo $_COOKIE["playlist"];
		}
		else {
			$playlist = json_encode(array());
			setcookie("playlist", $playlist);
			echo $playlist;
		}
	}

	function getNextSong() {
		$playlist = json_decode($_COOKIE["playlist"]);
		$song = $playlist[0];
		setcookie('playlist', json_encode($playlist));
		$filename = getSongAction($song);
		if($filename["statusText"] == "SUCCESS") {
				echo json_encode($filename["data"]);
		}
		else {
			header('HTTP/1.1 406 Problem with database');
			die(json_encode(array("message" => "ERROR", "code" => 1330)));
		}
	}

	function skipSong() {
		$playlist = json_decode($_COOKIE["playlist"]);
		array_shift($playlist);
		setcookie('playlist', json_encode($playlist));
		echo $_COOKIE["playlist"];
	}

	function getPlaylist() {
		$playlist = json_decode($_COOKIE["playlist"]);
		$response = getPlaylistAction($playlist);
		if ($response["statusText"] == "SUCCESS") {
			echo json_encode($response["data"]);
		}
		else {
			header('HTTP/1.1 406 Problem with database');
			die(json_encode(array("message" => "ERROR", "code" => 1330)));
		}
	}

	function getTours() {
		$response = getToursAction();
		if ($response["statusText"] == "SUCCESS") {
			echo json_encode($response["data"]);
		}
		else {
			header('HTTP/1.1 406 Problem with database');
			die(json_encode(array("message" => "ERROR", "code" => 1330)));
		}
	}

	function removeSong() {
		$pos = substr($_POST["id"], 4);
		$pos = intval($pos);
		$playlist = json_decode($_COOKIE["playlist"]);
		$newplaylist = array();
		$num_songs = count($playlist);
		for($i = 0; $i < $num_songs; $i++)
			if($i != $pos)
				array_push($newplaylist, $playlist[$i]);
		setcookie('playlist', json_encode($newplaylist));
		echo $_COOKIE["playlist"];
	}

	function login() {
		$response = loginAction($_POST["username"], $_POST["password"]);
		if($response["statusText"] == "SUCCESS") {
			startSession($response["data"]["id"], $response["data"]["username"]);
			$finalResponse = array("id" => $response["data"]["id"], "username" => $response["data"]["username"]);
			echo json_encode($finalResponse);
		}
		else {
			header('HTTP/1.1 406 Wrong credentials');
			die(json_encode(array("message" => "ERROR", "code" => 1333)));
		}
	}

	function getSessionData() {
		if(isSessionActive() == true) {
			echo json_encode(array("id" => $_SESSION["id"], "username" => $_SESSION["username"]));
		}
		else {
			header('HTTP/1.1 406 Session expired');
			die(json_encode(array("message" => "ERROR", "code" => 1341)));
		}
	}

	function addPost() {
		// Credits for upload image code for http://www.w3schools.com/php/php_file_upload.asp
		if(isSessionActive()) {
			$target_dir = "../images/posts/";
			$target_file = $target_dir . basename($_FILES["coverphoto"]["name"]);
			$uploadOk = 1;
			$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
			$target_file = $target_dir . preg_replace('/\s+/', '', $_POST["title"]) . "." . $imageFileType;
			$filename = preg_replace('/\s+/', '', $_POST["title"]) . "." . $imageFileType;
			// Check if image file is a actual image or fake image
			if(isset($_POST["submit"])) {
			    $check = getimagesize($_FILES["coverphoto"]["tmp_name"]);
			    if($check !== false) {
			        // echo "File is an image - " . $check["mime"] . ".";
			        $uploadOk = 1;
			    } else {
			        echo "File is not an image.";
			        $uploadOk = 0;
			    }
			}
			// Check if file already exists
			if (file_exists($target_file)) {
			    echo "Sorry, file already exists.";
			    $uploadOk = 0;
			}
			// Check file size
			if ($_FILES["fileToUpload"]["size"] > 500000) {
			    echo "Sorry, your file is too large.";
			    $uploadOk = 0;
			}
			// Allow certain file formats
			if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
			&& $imageFileType != "gif" ) {
			    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
			    $uploadOk = 0;
			}
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 1) {
			    if (move_uploaded_file($_FILES["coverphoto"]["tmp_name"], $target_file)) {
							$timestamp = date('Y-m-d H:i:s');
			        $response = addPostAction($_POST["title"], $_POST["content"], $_SESSION["id"], $timestamp, $filename);
							if($response["statusText"] == "SUCCESS") {
								echo json_encode("SUCCESS");
							}
			    }
			}
		}
	}

	function uploadSong() {
		if(isSessionActive()) {
			$target_dir = "../music/";
			$target_file = $target_dir . basename($_FILES["songfile"]["name"]);
			$uploadOk = 1;
			$FileType = pathinfo($target_file,PATHINFO_EXTENSION);
			$target_file = $target_dir . preg_replace('/\s+/', '', $_POST["name"]) . "." . $FileType;
			$filename = preg_replace('/\s+/', '', $_POST["name"]) . "." . $FileType;

			// Allow certain file formats
			if($FileType != "mp3" ) {
			    echo "Sorry, only MP3 files are allowed.";
			    $uploadOk = 0;
			}
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 1) {
			    if (move_uploaded_file($_FILES["songfile"]["tmp_name"], $target_file)) {
						$duration = $_POST["durmin"] . ":" . $_POST["dursec"];
						$response = createSongAction($_POST["name"], $_POST["track"], $_POST["album"], $duration, $filename);
						if($response["statusText"] == "SUCCESS") {
							echo json_encode("SUCCESS");
						}
			   	}
			}

		}
	}

	function sendEmail() {
		$to = $_POST["email"];
		$subject = "Contacto de Sitio Denso";
		$txt = $_POST["message"];
		$headers = "From: omjrrz@outlook.com";

		mail($to,$subject,$txt,$headers);
		echo json_encode("SUCCESS");
	}

	function editMember() {
		if(isSessionActive()) {
			if(isset($_FILES["coverphoto"]) && $_FILES["coverphoto"]["name"] != "") {
				$target_dir = "../images/members/";
				$target_file = $target_dir . basename($_FILES["coverphoto"]["name"]);
				$uploadOk = 1;
				$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
				$target_file = $target_dir . $_POST["id"] . preg_replace('/\s+/', '', $_POST["fname"]) . "." . $imageFileType;
				$filename = $_POST["id"] . preg_replace('/\s+/', '', $_POST["fname"]) . "." . $imageFileType;
				// Check if image file is a actual image or fake image
				if(isset($_POST["submit"])) {
				    $check = getimagesize($_FILES["coverphoto"]["tmp_name"]);
				    if($check !== false) {
				        // echo "File is an image - " . $check["mime"] . ".";
				        $uploadOk = 1;
				    } else {
				        echo "File is not an image.";
				        $uploadOk = 0;
				    }
				}
				if ($_FILES["fileToUpload"]["size"] > 500000) {
				    echo "Sorry, your file is too large.";
				    $uploadOk = 0;
				}
				// Allow certain file formats
				if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
				&& $imageFileType != "gif" ) {
				    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
				    $uploadOk = 0;
				}
				// Check if $uploadOk is set to 0 by an error
				if ($uploadOk == 1) {
				    if (move_uploaded_file($_FILES["coverphoto"]["tmp_name"], $target_file)) {
				        $response = editMemberAcion($_POST["id"], $_POST["fname"],$_POST["lname"],$_POST["birth_date"],
										$_POST["instruments"], $_POST["member_since"], $_POST["biography"], $filename);
								if($response["statusText"] == "SUCCESS") {
									echo json_encode("SUCCESS");
								}
				    }
				}
			}
			else {
				$response = editMemberAcion($_POST["id"], $_POST["fname"],$_POST["lname"],$_POST["birth_date"],
						$_POST["instruments"], $_POST["member_since"], $_POST["biography"], "");
				if($response["statusText"] == "SUCCESS") {
					echo json_encode("SUCCESS");
				}
			}
		}
	}

	function editPost() {
		if(isSessionActive()) {
			if(isset($_FILES["coverphoto"]) && $_FILES["coverphoto"]["name"] != "") {
				$target_dir = "../images/posts/";
				$target_file = $target_dir . basename($_FILES["coverphoto"]["name"]);
				$uploadOk = 1;
				$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
				$target_file = $target_dir . preg_replace('/\s+/', '', $_POST["title"]) . "." . $imageFileType;
				$filename = preg_replace('/\s+/', '', $_POST["title"]) . "." . $imageFileType;
				// Check if image file is a actual image or fake image
				if(isset($_POST["submit"])) {
				    $check = getimagesize($_FILES["coverphoto"]["tmp_name"]);
				    if($check !== false) {
				        // echo "File is an image - " . $check["mime"] . ".";
				        $uploadOk = 1;
				    } else {
				        echo "File is not an image.";
				        $uploadOk = 0;
				    }
				}

				if ($_FILES["fileToUpload"]["size"] > 500000) {
				    echo "Sorry, your file is too large.";
				    $uploadOk = 0;
				}
				// Allow certain file formats
				if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
				&& $imageFileType != "gif" ) {
				    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
				    $uploadOk = 0;
				}
				// Check if $uploadOk is set to 0 by an error
				if ($uploadOk == 1) {
				    if (move_uploaded_file($_FILES["coverphoto"]["tmp_name"], $target_file)) {
								$timestamp = date('Y-m-d H:i:s');
				        $response = editPostAcion($_POST["id"], $_POST["content"], $filename, $_POST["title"]);
								if($response["statusText"] == "SUCCESS") {
									echo json_encode("SUCCESS");
								}
				    }
				}
			}
			else {
				$response = editPostAcion($_POST["id"], $_POST["content"], "", $_POST["title"]);
				if($response["statusText"] == "SUCCESS") {
					echo json_encode("SUCCESS");
				}
			}
		}
	}

	function getPost() {
		if(isSessionActive()) {
			$response = getPostAction(substr($_POST["id"], 4));
			if($response["statusText"] == "SUCCESS") {
				echo json_encode($response["data"]);
			}
		}
	}

	function getTour() {
		if(isSessionActive()) {
			$response = getTourAction(substr($_POST["id"], 5));
			if($response["statusText"] == "SUCCESS") {
				echo json_encode($response["data"]);
			}
		}
	}

	function editTour() {
		if(isSessionActive()) {
			$datetime = $_POST["date"] . " " . $_POST["time"];
			$response = editTourAction($_POST["id"], $_POST["city"], $_POST["address"], $datetime, $_POST["cost"]);
			if($response["statusText"] == "SUCCESS") {
				echo json_encode($response["data"]);
			}
		}
	}

	function getMembers() {
		$response = getMembersAction();
		if($response["statusText"] == "SUCCESS") {
			echo json_encode($response["data"]);
		}
	}

	function getMember() {
		if(isSessionActive()) {
			$response = getMemberAction(substr($_POST["id"], 5));
			if($response["statusText"] == "SUCCESS") {
				echo json_encode($response["data"]);
			}
		}
	}

 ?>
