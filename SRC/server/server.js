var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "recipe_app"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


//api stuff begins
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, "..", 'client')));
const router = express.Router();
router.use(express.json());

//middleware for logging
app.use((req,res,next) => {//for all routes
    console.log(`${req.method} request for ${req.url}`)
    next();
});

// Defining /api/getUsers endpoint
app.get('/api/getUsers', (req, res) => {
    const query = 'SELECT username FROM user';

    con.query(query, (error, results) => {
        if (error) {
            console.error('Failed to fetch users from database:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Defining getRecipesByTag API endpoint 
// Finds all recipes with a given tag
// Will return the recipe name
app.get('/api/getRecipesByTag/:tag', (req, res) => {
    const { tag } = req.params;
    const query = `
        SELECT r.name AS recipeName
        FROM recipeTags rt
        JOIN author a ON a.recipeID = rt.recipeID
        JOIN recipes r ON r.recipeID = a.recipeID
        WHERE ? IN (rt.tag1, rt.tag2, rt.tag3, rt.tag4, rt.tag5);
    `;

    con.query(query, [tag], (error, results) => {
        if (error) {
            console.error('Failed to fetch recipes by tag:', error);
            res.status(500).json({ error: 'Failed to fetch recipes by tag' });
        } else {
            res.status(200).json(results);
        }
    });
});



//THIS IS UPDATED QUERY THE ORIGINAL ONE WAS INCORRECT
// API endpoint for getting recipes by ingredient's name and user range
//returns recipe name inputs are ingredient name and user range
app.get('/api/getRecipesByIngredientNameAndUserRange/:ingredientName/:startUser/:endUser', (req, res) => {
    const { ingredientName, startUser, endUser } = req.params;

    const query = `
        SELECT r.name AS recipeName
        FROM recipeIngredients ri
        JOIN author a ON a.recipeID = ri.recipeID
        JOIN recipes r ON r.recipeID = a.recipeID
        WHERE ri.ingredientID = (
            SELECT ingredientID 
            FROM ingredients 
            WHERE name = ?
        )
        AND a.username > ? AND a.username < ?;
    `;

    con.query(query, [ingredientName, startUser, endUser], (error, results) => {
        if (error) {
            console.error('Failed to fetch recipes by ingredient name and user range:', error);
            res.status(500).json({ error: 'Failed to fetch recipes' });
        } else {
            res.status(200).json(results);
        }
    });
});


//API endpoint to delete all recipes by a speicifed author
//This endpoint would be used for if an author deletes their account as an example
//input would be username and would delete all recipes by the user that username refers to

app.delete('/api/deleteRecipesByUser/:username', (req, res) => {
    const { username } = req.params;

    // Query to delete all recipes based on the given username
    const query = `
        DELETE FROM recipes
        WHERE recipeID IN (
            SELECT recipeID FROM author WHERE username = ?
        );
    `;

    con.query(query, [username], (error, results) => {
        if (error) {
            console.error('Failed to delete recipes by user:', error);
            res.status(500).json({ error: 'Failed to delete recipes by user' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: `No recipes found by user: ${username}` });
        } else {
            res.status(200).json({ message: `Sucess, deleted all recipes by user: ${username}` });
        }
    });
});


// Starting the server on port 3000,
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});