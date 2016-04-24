CREATE DATABASE densobanddb;
USE densobanddb;

CREATE TABLE Administrators(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(35),
	passwrd VARCHAR(35),
	fname VARCHAR(50),
	lname VARCHAR(50),
	email VARCHAR(50),
  PRIMARY KEY(id)
);

CREATE TABLE Posts(
	id INT NOT NULL AUTO_INCREMENT,
	content TEXT NOT NULL,
	cover_photo VARCHAR(30),
	id_author INT NOT NULL,
	post_date DATETIME NOT NULL,
	title VARCHAR(50) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (id_author) REFERENCES Administrators(id)
);

CREATE TABLE Albums (
	id INT NOT NULL AUTO_INCREMENT,
	release_date DATATIME NOT NULL,
	cover_photo VARCHAR(30),
	name VARCHAR(30),
	PRIMARY KEY (id)
);

CREATE TABLE Songs (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	track_number INT NOT NULL,
	id_album INT NOT NULL,
	duration VARCHAR(5) NOT NULL,
	file_name VARCHAR(40) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (id_album) REFERENCES Albums(id)
)


CREATE TABLE Tours (
	id INT NOT NULL AUTO_INCREMENT,
	city VARCHAR(30) NOT NULL,
	address VARCHAR(50) NOT NULL,
	date DATETIME NOT NULL,
	cost INT NOT NULL,
	PRIMARY KEY (id)
)

CREATE TABLE Members (
		id INT NOT NULL AUTO_INCREMENT,
		fname VARCHAR(50) NOT NULL,
		lname VARCHAR(50) NOT NULL,
		birth_date DATETIME NOT NULL,
		instruments VARCHAR() NOT NULL,
		member_since DATETIME NOT NULL,
		biography TEXT NOT NULL
)
