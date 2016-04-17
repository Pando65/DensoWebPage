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
		default: break;
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
			echo $_COOKIE["playlist"];
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

 ?>
