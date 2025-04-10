CREATE DATABASE recipe_app;

USE recipe_app;




CREATE TABLE user (
	username 	VARCHAR(30) NOT NULL PRIMARY KEY,
    password	VARCHAR(30) NOT NULL
);

CREATE TABLE recipes (
	recipeID		INT NOT NULL PRIMARY KEY,
    name 			VARCHAR(50) NOT NULL
    instructions 	VARCHAR(100) NOT NULL,
    author          VARCHAR(30) NOT NULL,
    FOREIGN KEY (author) REFERENCES user(username)
);

CREATE TABLE ratings (
	username 	VARCHAR(30) NOT NULL,
    recipeID 	INT NOT NULL,
	rating 		INT,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (recipeID) REFERENCES recipes(recipeID)
);
    
CREATE TABLE userSavedRecipes (
	username 	VARCHAR(30) NOT NULL,
    recipeID 	INT NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (recipeID) REFERENCES recipes(recipeID)
);
