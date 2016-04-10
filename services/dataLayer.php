<?php
	function connect() {
		$servername = "localhost";
		$username = "root";
		$password = "root";
		$dbname = "densobanddb";
		$connection = new mysqli($servername, $username, $password, $dbname);
		if ($conn->connect_error) {
			return null;
		}
		else {
			return $connection;
		}
	}

	function getPostsAction() {
		$conn = connect();
		if ($conn != null) {
			$sql = "SELECT * FROM Posts ORDER BY post_date DESC";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				$response = array();
				while($row = $result->fetch_assoc()) {
					array_push($response, $row);
				}
				$finalResponse = array("statusText" => "SUCCESS", "data" => $response);
				return $finalResponse;
			}
		}
	}

	function getMusicAction() {
		$conn = connect();
		if ($conn != null) {
			$sql = "SELECT * FROM Albums ORDER BY release_date DESC";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				$response = array();
				while($row = $result->fetch_assoc()) {
					$innerArray = array($row);
					$currentAlbumId = intval($row['id']);
					$sql2 = "SELECT * FROM Songs WHERE id_album = $currentAlbumId ORDER BY track_number";
					$result2 = $conn->query($sql2);
					if($result2->num_rows > 0) {
						while($row2 = $result2->fetch_assoc()) {
							array_push($innerArray, $row2);
						}
						array_push($response, $innerArray);
					}
				}
				return array("statusText" => "SUCCESS", "data" => $response);;
			}
		}
	}



?>
