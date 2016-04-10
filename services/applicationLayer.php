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

 ?>
