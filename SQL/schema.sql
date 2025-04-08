CREATE DATABASE recipe_app;

USE recipe_app;


CREATE TABLE tags (
	tagID 			CHAR(10) NOT NULL PRIMARY KEY,
	name 			VARCHAR(30)
    );
CREATE TABLE ingredients (
	ingredientID 	CHAR(10) NOT NULL PRIMARY KEY,
	foodGroup 		VARCHAR(30),
    name 			VARCHAR(30)
    );    
CREATE TABLE user (
	username 	VARCHAR(30) NOT NULL PRIMARY KEY,
    password	VARCHAR(30) NOT NULL
    );
CREATE TABLE author (
	username 	VARCHAR(30) NOT NULL,
    recipeID 	CHAR(10) NOT NULL,
    recipeText	CHAR(100) NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username)
	);
CREATE TABLE recipes (
	recipeID		INT NOT NULL PRIMARY KEY,
    name 			VARCHAR(50) NOT NULL
    #instructions 	CHAR(100) NOT NULL,
    #FOREIGN KEY (instructions) REFERENCES author(recipeText)
    );
CREATE TABLE ratings (
	username 	VARCHAR(30) NOT NULL,
    recipeID 	INT NOT NULL,
	rating 		INT,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (recipeID) REFERENCES recipes(recipeID)
	);
    
CREATE TABLE recipeTags (
	recipeID		INT NOT NULL,
	tag1			VARCHAR(50),
    tag2			VARCHAR(50),
    tag3			VARCHAR(50),
    tag4			VARCHAR(50),
    tag5			VARCHAR(50),
    
    FOREIGN KEY (recipeID) REFERENCES recipes(recipeID),
    FOREIGN KEY (tag1) REFERENCES tags(tagID),
    FOREIGN KEY (tag2) REFERENCES tags(tagID),
    FOREIGN KEY (tag3) REFERENCES tags(tagID),
    FOREIGN KEY (tag4) REFERENCES tags(tagID),
    FOREIGN KEY (tag5) REFERENCES tags(tagID)
	);    
CREATE TABLE userSavedRecipes (
	username 	VARCHAR(30) NOT NULL,
    recipeID 	INT NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (recipeID) REFERENCES recipes(recipeID)
    );
CREATE TABLE userSavedSearches (
	username 	VARCHAR(30) NOT NULL,
    search		VARCHAR(100) NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username)
	);
CREATE TABLE recipeIngredients (
	recipeID 		INT NOT NULL,
    ingredientID 	CHAR(10) NOT NULL,
    FOREIGN KEY (ingredientID) REFERENCES ingredients(ingredientID),
	FOREIGN KEY (recipeID) REFERENCES recipes(recipeID)    
);