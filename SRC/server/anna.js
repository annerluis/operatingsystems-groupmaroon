//db
var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "IWillFollowYouIntoTheDark!",
  database: "assignment3"
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



//routes
router.post('/create-ingredient', (req,res) => {
    const { ingredientID, foodGroup, name } = req.body;

    if (!ingredientID || !foodGroup || !name) {
        if (!ingredientID) console.log('no id');
        if (!foodGroup) console.log('no food group');
        if (!name) console.log('no name');
        return res.status(400).json({ error: 'All fields (ingredientID, foodGroup, name) are required' });
    }

    const query = `INSERT INTO ingredients (ingredientID, foodGroup, name) VALUES (?, ?, ?)`;

    con.query(query, [ingredientID, foodGroup, name], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        console.log('ingredient inserted:,', ingredientID );
        res.status(201).json({ message: 'Ingredient created successfully', data: { ingredientID, foodGroup, name } });
    });

});

router.get('/get-highest-rated-users/:recipeName', (req,res) => {
    let recipeName = req.params.recipeName;
    
    const query = `
        SELECT username 
        FROM ratings rt 
        WHERE rt.recipeID = (
            SELECT recipeID 
            FROM recipes 
            WHERE name = ?
        )
        AND rating = 5
    `;
    con.query(query, [recipeName], (err, result) => {
        console.log('query');
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(result);
    });
});


router.get('/getUsers', (req, res) => {
    console.log('inside');


    const query = 'SELECT username FROM user';

    con.query(query, (error, results) => {
        if (error) {
            console.error('Failed to fetch users from database:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
});

router.get('/getRecipesByIngredientNameAndUserRange/:ingredientName/:startUser/:endUser', (req, res) => {
    const { ingredientName, startUser, endUser } = req.params;

    const query = `
        SELECT a.recipeID
        FROM recipeIngredients ri
        JOIN author a ON a.recipeID = ri.recipeID
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

router.get('/getRecipesByTag/:tag', (req, res) => {
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


router.delete('/deleteRecipesByUser/:username', (req, res) => {
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



router.get('/search-ingredients/:column/:input', (req, res) => {//where column is either name or foodGroup and input is the query string
    const input = req.params.input;
    const column = req.params.column;

    console.log(input, column)

    const query = `SELECT * FROM ingredients WHERE ${column} LIKE '%${input}%'`

    con.query(query, (err,results) => {
        if (err) {
            console.error('Error executing query: ', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        console.log('search query works');
        res.status(200).json(results);
    });
});

router.get('/search-tags/:tag', (req,res) => {
    const tag = req.params.tag;

    const query = `SELECT * FROM tags WHERE name LIKE '%${tag}%'`;

    con.query(query, (err,results) => {
        if (err) {
            console.error('Error executing query: ',err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});

app.use('/api', router);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


module.exports = router;