/*id, username, passwrd, fname, lname, email */
INSERT INTO Administrators VALUES (1, 'omjrrz', 'contra', 'Omar', 'Manjarrez Osornio', 'omjrrz@outlook.com');

/* id, contnt , cover_photo,id_author, post date, title */
INSERT INTO Posts VALUES (1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'photo1.jpg', 1, '2015-09-03', 'Denso en el Bull Dog Café');

/* id, release_date, cover_photo */
INSERT INTO Albums VALUES (1, '2013-06-01', 'album1.jpg', 'Bello & Cruel');
INSERT INTO Albums VALUES (2, '2015-12-01', 'album2.jpg', 'EP');

/* id, name, track_number, id_abum, duration */
INSERT INTO Songs VALUES (1, 'Dulces pensamientos grises', 1, 1, '3:20', 'dulcespensamientosgrises.mp3');
INSERT INTO Songs VALUES (2, 'Matame una vez', 2, 1, '4:13', 'matameunavez.mp3');
INSERT INTO Songs VALUES (3, 'Mi turno', 3, 1, '3:48', 'miturno.mp3');
INSERT INTO Songs VALUES (4, 'No eres diferente eres especial', 4, 1, '3:47', 'noeresdiferenteerespecial.mp3');
INSERT INTO Songs VALUES (5, 'Por que no?', 1, 2, '3:36', 'porqueno.mp3');
INSERT INTO Songs VALUES (6, 'El tiempo que deje partir', 2, 2, '3:34', 'eltiempoquedejepartir.mp3');
