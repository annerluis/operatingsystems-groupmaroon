
//This section is complete

function getUsers(){
    fetch('/api/getUsers', {
        method: 'GET',
        headers: {'Content-type': 'application/json'}
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                console.log(data);
                displayUsers(data);
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();
}

var showSearchResults = [];

function displayUsers(users){

    showSearchResults = [];

    x = document.getElementById('getUsers');      //Showing the div area
    x.style.display = 'block';

    var resultArea = document.getElementById("userResults");       //Clearing out search results
    resultArea.innerHTML = '';


    for (var i= 0; i < users.length; i++){        //Ading all of the results to the current html
        var listItem = document.createElement("li");

        listItem.innerHTML = `<p>${users[i].username} <span>${users[i].password}</span></p>`;

        showSearchResults.push(listItem);
    }

    for (var i = 0; i< showSearchResults.length; i++){
        resultArea.appendChild(showSearchResults[i]);
    }
}


function hideUserResults(){
    x = document.getElementById('getUsers');      //Showing the div area
    x.style.display = 'none';

    x = document.getElementById("userResults");
    x.innerHTML= '';
}




function addNewIngredient(){
    let ele = document.getElementById('ingredientMessage');
    ele.innerText = "" ;
    
    var foodGroup = document.getElementById('foodGroup').value;
    var ingredientName = document.getElementById('ingredientName').value;

    let goodSearch = validateSearch(foodGroup);
    if (goodSearch == false){
        return
    }

    goodSearch = validateSearch(ingredientName);
    if (goodSearch == false){
        return
    }

    let id = (Math.floor(Math.random() * 10000000000)).toString();

    newpart = {
        foodGroup: foodGroup,
        name: ingredientName,
        ingredientID: id
    }

    fetch('/api/create-ingredient', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newpart)
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                let ele = document.getElementById('ingredientMessage');
                ele.innerText = "Ingredient sucessfully created" ;
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();
}

function validateSearch(search){
    if ( search.length > 29){       //If the text string is longer than 20 characters
        alert("ERROR: keep search result less than 20 character");
        return false;                     //Exit function
    }
    if ( search.length == 0){       //If the text string is longer than 20 characters
        alert("ERROR: input a search");
        return false;                     //Exit function
    }
    return true;        //This means that the search result is only letters and is shorter than 21 characters
}




//This section is complete

function searchHighestRatings(){
    var inputtedRecipe = document.getElementById('highestRecipeName').value;

    let goodSearch = validateSearch(inputtedRecipe);
    if (goodSearch == false){
        return;
    }


    fetch(`/api/get-highest-rated-users/${inputtedRecipe}`, {
        method: 'GET',
        headers: {'Content-type': 'application/json'}
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                displayRatingUsers(data);
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();
}

function displayRatingUsers(users){
    showSearchResults = [];

    x = document.getElementById('getUsersRating');      //Showing the div area
    x.style.display = 'block';

    var resultArea = document.getElementById("userRatingResults");       //Clearing out search results
    resultArea.innerHTML = '';


    for (var i= 0; i < users.length; i++){        //Ading all of the results to the current html
        var listItem = document.createElement("li");

        listItem.innerHTML = `<p>${users[i].username}</p>`;

        showSearchResults.push(listItem);
    }

    for (var i = 0; i< showSearchResults.length; i++){
        resultArea.appendChild(showSearchResults[i]);
    }
}

function hideUserRatingResults(){
    x = document.getElementById('getUsersRating');      //Showing the div area
    x.style.display = 'none';

    x = document.getElementById("userRatingResults");
    x.innerHTML= '';
}



function deleteRecipesByAuthor(){
    let ele = document.getElementById('authorMessage');
    ele.innerText = "" ;
    
    var authorName = document.getElementById('authorName').value;

    let goodSearch = validateSearch(authorName);
    if (goodSearch == false){
        return;
    }

    fetch(`/api/deleteRecipesByUser/${authorName}`, {
        method: 'DELETE',
        headers: {'Content-type': 'application/json'}
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                console.log(data);

                let ele = document.getElementById("authorMessage");

                ele.innerText = data.message;
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else if (res.status == 404){
            res.json()
            .then(data => {
                console.log(data);

                let ele = document.getElementById("authorMessage");

                ele.innerText = data.message;
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();

}



function getIngredientBySearch(){
    var ingredientInput = document.getElementById('ingredientInput').value;

    let goodSearch = validateSearch(authorName);
    if (goodSearch == false){
        return;
    }

    const selectedTag = document.getElementById("ingredientSearchSelect").value;
    goodSearch = validateSearch(selectedTag);
    if (goodSearch == false){
        return;
    }

    fetch(`/api/search-ingredients/${selectedTag}/${ingredientInput}`, {
        method: 'GET',
        headers: {'Content-type': 'application/json'}
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                console.log(data);

                displayIngredient(data);
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();
}

function displayIngredient(ingredients){
    const selectedTag = document.getElementById("ingredientSelect").InnerText;

    showSearchResults = [];

    x = document.getElementById('getIngredientsBySearch');      //Showing the div area
    x.style.display = 'block';

    var resultArea = document.getElementById("ingredientResults");       //Clearing out search results
    resultArea.innerHTML = '';


    for (var i= 0; i < ingredients.length; i++){        //Ading all of the results to the current html
        var listItem = document.createElement("li");

        listItem.innerHTML = `<p>${ingredients[i].name} ${ingredients[i].foodGroup} </p>`;

        showSearchResults.push(listItem);
    }

    for (var i = 0; i< showSearchResults.length; i++){
        resultArea.appendChild(showSearchResults[i]);
    }
}

function hideIngredientSearch(){
    x = document.getElementById('getIngredientsBySearch');      //Showing the div area
    x.style.display = 'none';

    x = document.getElementById("ingredientResults");
    x.innerHTML= '';
}






// Function to fetch recipes by tag
function getRecipesByTag() {
    const selectedTag = document.getElementById("ingredientSelect").value;
    let goodSearch = validateSearch(selectedTag);
    if (goodSearch == false){
        return;
    }

    fetch(`/api/getRecipesByTag/${selectedTag}`, {
        method: 'GET',
        headers: {'Content-type': 'application/json'}
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                displayRecipes(data, selectedTag, 'tag');
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();
}

// Function to fetch recipes by ingredient
function getRecipesByIngredient() {
    const selectedIngredient = document.getElementById("ingredientSelect").value;

    var lowAuthor = document.getElementById('lowestAuthor').value;
    var highAuthor = document.getElementById('highestAuthor').value;

    let goodSearch = validateSearch(lowAuthor);
    if (goodSearch == false){
        return;
    }

    goodSearch = validateSearch(highAuthor);
    if (goodSearch == false){
        return;
    }


    fetch(`/api/getRecipesByIngredientNameAndUserRange/${selectedIngredient}/${lowAuthor}/${highAuthor}`, {
        method: 'GET',
        headers: {'Content-type': 'application/json'}
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .then(data => {
                displayRecipes(data, selectedIngredient, 'ingredient');
            })       //Calling to display all of the lists
            .catch(err => console.log('Failed to get json object'))
        }
        else {
            console.log('Error: ', res.status)
        }        
    })
    .catch();
}


function displayRecipes(recipes, criterion, type) {
    const resultArea = document.getElementById("recipeResults");
    resultArea.innerHTML = ''; // Clear any previous results

    // Set the heading based on the context (tag or ingredient)
    const heading = document.getElementById('recipeHeading');
    if (type === 'tag') {
        heading.innerText = `Recipes for Tag ${criterion}`;
    } else if (type === 'ingredient') {
        heading.innerText = `Recipes with ${criterion}`;
    }

    // Loop through the recipes and create a list item for each
    recipes.forEach(recipe => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<p>Recipe Name: ${recipe.name} <br>Recipe ID: ${recipe.recipeID}</p>`;
        resultArea.appendChild(listItem);
    });

    // Show the results section
    document.getElementById('getRecipes').style.display = 'block';
}

function hideRecipesByIngredient(){
    x = document.getElementById('recipesByIngredient');      //Showing the div area
    x.style.display = 'none';
}
