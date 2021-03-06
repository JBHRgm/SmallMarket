create database marketstorage;
drop database marketstorage;
use marketstorage;
show tables;


drop table user_table;
drop table article_table;
drop table art_pic_table;
drop table art_cat_table;
drop table chat_table;
select * from user_table;
select * from article_table;
select * from category_table;
select * from art_cat_table;
select * from chat_table;
select * from art_pic_table;

delete from user_table where id = 9;

SELECT @@global.time_zone;
SET @@global.time_zone = '+02:00';

INSERT INTO art_pic_table (article, ctr, picture) VALUES (1,0,'art1pic0.jpg'),(1,1,'art1pic1.jpg'),(1,2,'art1pic2.jpg'),(2,0,'art2pic0.jpg'),(2,1,'art2pic1.jpg');

INSERT INTO article_table (id, title, description, price, owner) VALUES (11,'Grafikkarte AMD RX 570', 'Ganz neu mit OVP.', 99.99, 1);
INSERT INTO article_table (id, title, description, price, owner) VALUES (2,'Autoreifen BMW-3er', 'Gummigeschmack', 45.50, 2);
INSERT INTO article_table (id, title, description, price, owner) VALUES (3,'Grafikkarte NVIDIA GTX 980 Ti', 'Ganz neu mit OVP.', 110.99, 3);
INSERT INTO article_table (id, title, description, price, owner) VALUES (4,'Waschmaschine Bosch MX-340', 'Wäscht wunderbar.', 149.99, 3);
INSERT INTO article_table (id, title, description, price, owner) VALUES (5,'Alte Brettspiele (Mensch Ärgere dich nicht, Mühle, ...)', 'Gebaucht aber noch gut in Schuss.', 25.00, 4);
INSERT INTO article_table (id, title, description, price, owner) VALUES (6,'Herrenhemd S.Oliver M kariert', 'Riecht wie schon mal getragen.', 30.00, 7);
INSERT INTO article_table (id, title, description, price, owner) VALUES (7,'Tischdecke kariert', 'Nur paar Flecken.', 23.99, 1);
INSERT INTO article_table (id, title, description, price, owner) VALUES (8,'Großer Luftballon', 'Da geht dir die Puste aus.', 10.00, 3);

INSERT INTO art_cat_table (article, category) VALUES (1,10), (1,18),(2,1),(2,2),(3,10),(3,18),(4,10),(4,13),(5,22),(5,24),(5,26),(6,56),(6,59),(7,47),(7,50),(8,22),(8,25);

INSERT INTO category_table (name, parent) VALUES ('Fahrzeuge', 0),('Autos & Zubehör',1),('Boote & Zubehör',1),('Laster & Zubehör',1),('Motorräder & Zubehör',1),('Nutzfahrzeuge & Zubehör',1),('Fahrräder & Zubehör',1),('Wohnwägen & Zubehör',1),('weitere',1);
INSERT INTO category_table (name, parent) VALUES ('Elektronik',0),('Audio',10),('Foto',10),('Haushaltsgeräte',10),('Video & TV',10),('Handy & Telefon',10),('Software',10),('Konsolen',10),('PCs & Zubehör',10),('Notebooks',10),('Videospiele',10),('weitere',10);
INSERT INTO category_table (name, parent) VALUES ('Familie',0),('Baby-Ausstattung',22),('Spielsachen',22),('weitere',22);
INSERT INTO category_table (name, parent) VALUES ('Freizeit & Hobby',0),('Denksport',26),('Sport',26),('Kochen',26),('Kunst',26),('Basteln',26),('Modellbau',26),('Reise',26),('Camping',26),('Musik, Filme, Bücher',26),('weitere',26);
INSERT INTO category_table (name, parent) VALUES ('Haustiere',0),('Katzen',37),('Hunde',37),('Reptilien',37),('Spinnen',37),('Vögel',37),('Kleintiere',37),('Fische',37),('Pferde',37),('weitere',37);
INSERT INTO category_table (name, parent) VALUES ('Haus & Garten',0),('Kinderzimmer',47),('Schlafzimmer',47),('Küche & Esszimmer',47),('Wohnzimmer',47),('Büro',47),('Badezimmer',47),('Garten & Zubehör',47),('weitere',47);
INSERT INTO category_table (name, parent) VALUES ('Mode & Beauty',0),('Kinderkleidung',56),('Babykleidung',56),('Herrenkleidund',56),('Damenkleidung',56),('Accessoires & Schmuck',56),('Gesichtpflege',56),('Körperpflege',56),('Haarpflege',56),('weitere',56);

INSERT INTO chat_table (sender, receiver, article, msg) VALUES (1, 3, 3, 'Heyo waddup'),(1,3,3,'waddup'),(3,1,3,'heyo'),(4,3,3,'noch zu haben?'),(5,3,12,'r'),(3,7,6,'geil');

DELETE FROM user_table WHERE id = 3;
DELETE FROM art_pic_table WHERE article = 1 AND ctr > 2;
SELECT id FROM article_table WHERE title LIKE '%grafik%';

SELECT * FROM chat_table AS c INNER JOIN article_table AS a ON a.id = c.article INNER JOIN user_table AS u on (u.id = c.sender OR u.id = c.receiver) WHERE c.sender = 4 OR c.receiver = 4;
SELECT sender, article, u.name, a.title, u.id from chat_table AS c INNER JOIN article_table AS a ON a.id = article INNER JOIN user_table AS u ON u.id = a.owner WHERE sender = 3 GROUP BY (article);
SELECT tb.user, u.name, tb.article, a.title FROM (SELECT sender as user, article FROM chat_table WHERE receiver = 3 UNION SELECT receiver as user, article FROM chat_table WHERE sender = 3) AS tb INNER JOIN article_table AS a ON a.id = tb.article INNER JOIN user_table AS u ON u.id = tb.user;
SELECT * FROM (SELECT DISTINCT sender, article FROM chat_table WHERE receiver = 3) AS xy INNER JOIN (SELECT DISTINCT receiver, article FROM chat_table WHERE sender = 3) AS zy ;
SELECT id, sender, receiver, msg, date FROM chat_table WHERE article = 3 AND (sender = 1 OR receiver = 1) ORDER BY id;

SELECT DISTINCT a.id, a.created, a.title, a.description, a.price, u.name, u.address, ap.picture FROM article_table AS a
INNER JOIN art_cat_table AS ac ON ac.article = a.id AND a.price BETWEEN 0 AND 50
INNER JOIN user_table AS u ON a.owner = u.id 
LEFT JOIN (SELECT article, picture FROM art_pic_table WHERE ctr = 0) AS ap ON ap.article = a.id WHERE a.title LIKE '%%' AND u.address LIKE '%%' AND ac.category > 0 ORDER BY a.created DESC;

SELECT user_table.address, count(v.id) AS anz FROM user_table LEFT JOIN (SELECT article_table.id, article_table.owner FROM article_table INNER JOIN art_cat_table ON article_table.id = art_cat_table.article WHERE article_table.title LIKE '%%' GROUP BY (article_table.id)) AS v ON user_table.id = v.owner GROUP BY (address) HAVING anz > 0;
SELECT article_table.id FROM article_table INNER JOIN art_cat_table ON article_table.id = art_cat_table.article WHERE article_table.title LIKE '%%' AND (art_cat_table.category = 18 OR art_cat_table.category = 13);

SELECT find_in_set('73547','65547,73547,55566');
SELECT category_table.name, count(v.id) FROM category_table LEFT JOIN art_cat_table ON art_cat_table.category = category_table.id LEFT JOIN (SELECT article_table.id FROM article_table INNER JOIN user_table ON user_table.id = article_table.owner WHERE title LIKE '%grafik%' AND user_table.address='73547+Lorch') AS v ON v.id = art_cat_table.article GROUP BY category_table.id;

SELECT category_table.name, count(art_cat_table.article) FROM category_table LEFT JOIN art_cat_table ON art_cat_table.category = category_table.id LEFT JOIN article_table ON article_table.id = art_cat_table.article GROUP BY category_table.id;
SELECT * FROM article_table INNER JOIN art_cat_table ON art_cat_table.article = article_table.id INNER JOIN category_table ON category_table.id = art_cat_table.category WHERE article_table.id=1;