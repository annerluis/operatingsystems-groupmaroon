SELECT a.recipeID							#Find all recipes by user with given tag
FROM recipeTags rt JOIN author a
WHERE ('example' IN (rt.tag1, rt.tag2, rt.tag3, rt.tag4, rt.tag5)) AND 
(a.recipeID = rt.recipeID);



SELECT recipeID r FROM recipes
WHERE (r.name == "example")                          #Add way to 

#Take the above and put into the the next thing

SELECT username FROM ratings rt					#Find all users who gave a recipe highest rating
WHERE (rt.recipeID = 'example') AND (rating = 5);



INSERT INTO ingredients VALUES (	#This makes a new ingredient
	1234567890,
    'meat',
    'chicken'
);


UPDATE userSavedSearches u		#This updates a users saved search to be something different
SET u.search = 'example'
WHERE (u.username = 'input' AND search = "input");


SELECT a.recipeID							#Returns all recipes with an ingredients from a range of users
FROM recipeIngredients ri JOIN author a
WHERE (ri.ingredientId) AND 
(a.recipeID = ri.recipeID AND 'user_10' > a.username > 'user_20');
