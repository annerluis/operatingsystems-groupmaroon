const express = require("express");
const app = express();
const cors = require("cors");
var mysql = require("mysql2"); //Getting SQL information


// temporary fix, recommended fix is to use a connection pool instead of using con to make mysql queries
const events = require("events");
events.EventEmitter.defaultMaxListeners = 20;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello from our server!");
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

var con = mysql.createConnection({
  //Connecting to SQL server hosting
  host: "localhost", //Change to match Yugabyte information later
  user: "root",
  password: "!",
  database: "recipe_app",
});

con.connect(function (err) {
  //Connecting to nodemonasz
  if (err) throw err;
  console.log("Connected to MySQL.");
});

// Will return the recipe name
app.post('/getRecipes', (req, res) => {
    const { recipeName } = req.body;

    const search = "%" + recipeName + "%";

    const query = `
        SELECT * 
        FROM recipes
        WHERE name LIKE ?;
    `;

    con.query(query, [search], (error, results) => {
        if (error) {
            console.error('Failed to fetch recipes by tag:', error);
            res.status(500).json({ error: 'Failed to fetch recipes by tag' });
        } else {
            res.status(200).json(results);
        }
    });
});


// Will return the recipe name
app.get('/getRandomRecipes', (req, res) => {

  const query = `
      SELECT * FROM recipes
      ORDER BY RAND()
      LIMIT 3;
  `;

  con.query(query, [], (error, results) => {
      if (error) {
          console.error('Failed to fetch recipes by tag:', error);
          res.status(500).json({ error: 'Failed to fetch recipes by tag' });
      } else {
        console.log(results);
          res.status(200).json(results);
      }
  });
});


// Will return the recipe name
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * 
    FROM user
    WHERE username = ?
    AND password = ?;
  `;

  con.query(query, [username, password], (error, results) => {
      if (error) {
          console.error('Failed to fetch recipes by tag:', error);
          res.status(500).json({ error: 'Failed to fetch recipes by tag' });
      } else {
        console.log(results);
        res.status(200).json(results);
      }
  });
});

// Will return the recipe name
app.post('/createNewRecipe', (req, res) => {
  const { username, name, instructions } = req.body;

  recipeID = Math.floor(Math.random() * 100000); 

  const query = `
    INSERT INTO recipes VALUES(
      ?,
      ?,
      ?,
      ?
    );
  `;

  con.query(query, [recipeID, name, instructions, username], (error, results) => {
      if (error) {
          console.error('Failed to fetch recipes by tag:', error);
          res.status(500).json({ error: 'Failed to fetch recipes by tag' });
      } else {
        console.log(results);
        res.status(200).json(results);
      }
  });
});