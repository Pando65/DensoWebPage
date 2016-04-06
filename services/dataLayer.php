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
			$sql = "SELECT * FROM Posts";
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

?>
