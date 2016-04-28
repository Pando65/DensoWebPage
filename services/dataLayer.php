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
			} else {
				$finalResponse = array("statusText" => "SUCCESS", "data" => array());
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
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function getSongAction($id_song) {
		$conn = connect();
		if($conn != null) {
			$id_song = intval($id_song);
			$sql = "SELECT * FROM Songs WHERE Songs.id = $id_song";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					$response = $row;
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function getPlaylistAction($id_array) {
		$conn = connect();
		if($conn != null) {
			$response = array();
			foreach ($id_array as $id) {
				$id_song = intval($id);
				$sql = "SELECT * FROM Songs WHERE Songs.id = $id_song";
				$result = $conn->query($sql);
				if($result->num_rows > 0) {
					while($row = $result->fetch_assoc()) {
						array_push($response, $row);
					}
				}
			}
			return array("statusText" => "SUCCESS", "data" => $response);
		}
	}

	function getToursAction() {
		$conn = connect();
		if($conn != null) {
			$sql = "SELECT * FROM Tours";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				$response = array();
				while($row = $result->fetch_assoc()) {
					array_push($response, $row);
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function loginAction($username, $password) {
		$conn = connect();
		if($conn != null) {
			$sql = "SELECT * FROM Administrators WHERE passwrd = '$password' AND username = '$username'";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					$response = $row;
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function getAlbumsAction() {
		$conn = connect();
		if($conn != null) {
			$sql = "SELECT * FROM Albums";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				$response = array();
				while($row = $result->fetch_assoc()) {
					array_push($response, $row);
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function addPostAction($title, $content, $id_author, $post_date, $photofile) {
		$conn = connect();
		if($conn != null) {
			$id_author = intval($id_author);
			$sql = "INSERT INTO Posts(content, cover_photo, id_author, post_date, title) VALUES
					('$content', '$photofile', $id_author, '$post_date', '$title')";
			if(mysqli_query($conn, $sql))
				return array("statusText" => "SUCCESS");
		}

	}

	function createSongAction($name, $track, $album, $duration, $filename) {
		$conn = connect();
		if($conn != null) {
			$album = intval($album);
			$track = intval($track);
			$sql = "INSERT INTO Songs(name, track_number, id_album, duration, file_name) VALUES
				('$name', $track, $album, '$duration', '$filename')";
			if(mysqli_query($conn, $sql))
				return array("statusText" => "SUCCESS");
		}
	}

	function editPostAcion($id, $content, $cover_photo, $title) {
		$conn = connect();
		if($conn != null) {
			$id = intval($id);
			if($cover_photo != "") {
				$sql = "UPDATE Posts SET content='$content', cover_photo='$cover_photo', title='$title'
						WHERE id=$id";
			}
			else {
				$sql = "UPDATE Posts SET content='$content', title='$title' WHERE id=$id";
			}
			if(mysqli_query($conn, $sql))
				return array("statusText" => "SUCCESS");
		}
	}

	function editMemberAcion($id, $fname, $lname, $bdate, $instruments, $member_since, $biography, $file) {
		$conn = connect();
		if($conn != null) {
			$id = intval($id);
			if($file != "") {
				$sql = "UPDATE Members SET fname='$fname', lname='$lname', birth_date='$bdate',
						instruments='$instruments', member_since='$member_since', biography='$biography',
						profile_picture='$file' WHERE id=$id";
			}
			else {
				$sql = "UPDATE Members SET fname='$fname', lname='$lname', birth_date='$bdate',
						instruments='$instruments', member_since='$member_since', biography='$biography'
						WHERE id=$id";
			}
			if(mysqli_query($conn, $sql))
				return array("statusText" => "SUCCESS");
		}
	}

	function getPostAction($id) {
		$conn = connect();
		if($conn != null) {
			$id = intval($id);
			$sql = "SELECT * FROM Posts WHERE id = $id";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					$response = $row;
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function getTourAction($id) {
		$conn = connect();
		if($conn != null) {
			$id = intval($id);
			$sql = "SELECT * FROM Tours WHERE id = $id";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					$response = $row;
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function editTourAction($id, $city, $address, $datetime, $cost) {
		$conn = connect();
		if($conn != null) {
			$id = intval($id);
			$sql = "UPDATE Tours SET city='$city', address='$address', date='$datetime', cost='$cost'
					WHERE id = $id";
			if(mysqli_query($conn, $sql))
				return array("statusText" => "SUCCESS");
		}
	}

	function getMembersAction() {
		$conn = connect();
		if($conn != null) {
			$sql = "SELECT * FROM Members";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				$response = array();
				while($row = $result->fetch_assoc()) {
					array_push($response, $row);
				}
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}
	}

	function getMemberAction($id) {
		$conn = connect();
		if($conn != null) {
			$id = intval($id);
			$sql = "SELECT * FROM Members WHERE id = $id";
			$result = $conn->query($sql);
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc())
					$response = $row;
				return array("statusText" => "SUCCESS", "data" => $response);
			}
		}

	}

?>
