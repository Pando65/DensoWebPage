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
