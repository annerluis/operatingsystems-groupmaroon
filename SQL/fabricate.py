import mysql.connector
import random
import string

db_connection = mysql.connector.connect( #connect to the database
    host="localhost",
    user="root", 
    password="",  
    database="recipe_app"  
)
cursor = db_connection.cursor()

def insert_users(n): #insert users 
    print("Inserting users...")
    try:
        for userID in range(1, n + 1): 
            username = f"user_{userID}" #generate the username as user_1 to user_n
            password = "password"  #dummy password
            
            #insert the new user into the table
            cursor.execute("INSERT INTO user (username, password) VALUES (%s, %s)", (username, password))
            db_connection.commit() 
        print("Success: Dummy users inserted.")
    
    except mysql.connector.Error as err:
        print(f"Error inserting dummy users: {err}")

def insert_recipes(n): #insert recipes
    print("Inserting recipes...")
    try:
        for recipeID in range(1, n + 1):
            recipe_name = f"Recipe {recipeID}" 

            cursor.execute("INSERT INTO recipes (recipeID, name) VALUES (%s, %s)", (recipeID, recipe_name))
            db_connection.commit() 
        print("Success: Recipes inserted.")
    
    except mysql.connector.Error as err:
        print(f"Error inserting recipes: {err}")

def insert_tags(n): #insert tags
    print("Inserting tags...")
    try:
        for tagID in range(1, n + 1):
            tagID_str = str(tagID).zfill(10)
            tag_name = f"Tag {tagID}"  
            
            cursor.execute("INSERT INTO tags (tagID, name) VALUES (%s, %s)", (tagID_str, tag_name))
            db_connection.commit() 
        print("Success: Tags inserted.")
    
    except mysql.connector.Error as err:
        print(f"Error inserting tags: {err}")

def insert_ratings(n): #insert ratings
    print("Inserting ratings...")
    try:
        for i in range(n):
            cursor.execute("SELECT username FROM user ORDER BY RAND() LIMIT 1") #select a user
            username = cursor.fetchone()[0]
            cursor.execute("SELECT recipeID FROM recipes ORDER BY RAND() LIMIT 1") #select a recipe
            recipeID = cursor.fetchone()[0]
            rating = random.randint(1, 5) #generate a rating between 1 - 5
            
            cursor.execute("INSERT INTO ratings (username, recipeID, rating) VALUES (%s, %s, %s)", 
                           (username, recipeID, rating)) #insert the data into ratings
            db_connection.commit() 
        print("Success: Ratings inserted.")

    except mysql.connector.Error as err:
        print(f"Error inserting ratings: {err}")

def insert_ingredients(n):  #insert ingredients
    print("Inserting ingredients...")
    try:
        for ingredientID in range(1, n + 1):
            ingredient_name = f"ingredient_{ingredientID}"
            food_groups = ["East Asian", "Mediterranean", "Greek", "Fast Food", "Healthy", "Italian", "Mexican", "Indian", "American"]
            food_group = random.choice(food_groups)  #pick a food group
            
            cursor.execute("INSERT INTO ingredients (ingredientID, foodGroup, name) VALUES (%s, %s, %s)", 
                           (ingredientID, food_group, ingredient_name))  #insert ingredient into table
            db_connection.commit()
        print("Success: Ingredients inserted.")
    
    except mysql.connector.Error as err:
        print(f"Error inserting ingredients: {err}")

def insert_authors(n): #insert authors
    print("Inserting authors...")
    try:
        authors_to_insert = []
        used_recipes = set() #recipeIDs already assigned

        cursor.execute("SELECT username FROM user ORDER BY RAND() LIMIT 10") #get 10 existing users to become authors
        users = cursor.fetchall()
        cursor.execute("SELECT recipeID FROM recipes") #get all existing recipe IDs
        recipes = [row[0] for row in cursor.fetchall()] #put recipeIDs into a list

        
        for i in range(1, n + 1): #pick a username and a recipeID for each author
            username = random.choice(users)[0] #pick a username
            recipeID = None #find an unused recipeID
            while recipeID is None or recipeID in used_recipes:
                recipeID = random.choice(recipes)
            recipeText = f"Recipe text for {username}"
            used_recipes.add(recipeID)  #mark recipeID as used

            authors_to_insert.append((username, recipeID, recipeText))
        
        if authors_to_insert: #insert all authors
            cursor.executemany("INSERT INTO author (username, recipeID, recipeText) VALUES (%s, %s, %s)", authors_to_insert)
            db_connection.commit()
            print("Success: Authors inserted.")
        else:
            print("No authors to insert.")

    except mysql.connector.Error as err:
        print(f"Error inserting authors: {err}")

def insert_recipeTags(n):
    print("Inserting recipeTags...")
    try:
        cursor.execute("SELECT recipeID FROM recipes ORDER BY RAND() LIMIT %s", (n,))
        recipes = cursor.fetchall()
        cursor.execute("SELECT tagID FROM tags")
        tags = [tag[0] for tag in cursor.fetchall()]
        
        for recipe in recipes:
            recipeID = recipe[0]
            num_tags = random.randint(1, 5) #choose 1-5 tags
            selected_tags = random.sample(tags, num_tags)
            
            tag_data = selected_tags + [None] * (5 - num_tags) #unused columns = none
            
            cursor.execute("""
                INSERT INTO recipeTags (recipeID, tag1, tag2, tag3, tag4, tag5)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (recipeID, *tag_data))
        
        db_connection.commit()
        print("Recipe tags insertion complete!")
    
    except mysql.connector.Error as err:
        print(f"Error inserting recipeTags: {err}")


def insert_userSavedRecipes(n): #insert userSavedRecipes
    try:
        cursor.execute("SELECT username FROM user ORDER BY RAND() LIMIT %s", (n,)) #get 50 random users from user table
        users = cursor.fetchall()
        cursor.execute("SELECT recipeID FROM recipes") #get recipeIDs from recipes
        recipes = cursor.fetchall()

        for user in users: #for each user assign a recipe
            username = user[0] 
            recipes_per_user = random.randint(1, 10)  #random number of recipes per user

            for _ in range(recipes_per_user): 
                recipeID = random.choice(recipes)[0]  #randomly choose a recipe

                #insert username and recipeID into userSavedRecipes
                cursor.execute("INSERT INTO userSavedRecipes (username, recipeID) VALUES (%s, %s)", (username, recipeID))
                db_connection.commit()

        print(f"Success: {n} user-saved recipes inserted.")
    
    except mysql.connector.Error as err:
        print(f"Error inserting userSavedRecipes: {err}")

def insert_userSavedSearches(n): #insert userSavedSearches
    try:
        cursor.execute("SELECT username FROM user ORDER BY RAND() LIMIT %s", (n,)) 
        users = cursor.fetchall()
        
        for user in users: #insert a random saved search for each user
            username = user[0] 
            searches_per_user = random.randint(1, 10)  

            for _ in range(searches_per_user):
                search = generate_random_search_term() 

                #insert username and search term into userSavedSearches
                cursor.execute("INSERT INTO userSavedSearches (username, search) VALUES (%s, %s)", (username, search))
                db_connection.commit()
        print(f"Success: random user-saved searches inserted.")
    
    except mysql.connector.Error as err:
        print(f"Error inserting userSavedSearches: {err}")

def generate_random_search_term():
    length = random.randint(1, 100)  #random length between 1 and 100
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits + " ", k=length))
    return random_string

#main function
def main():
    print("Starting data insertion!")
    
    insert_users(100)
    insert_recipes(1500)
    insert_tags(100)
    insert_authors(10)
    insert_ingredients(200)
    insert_ratings(1500)
    insert_userSavedRecipes(50)
    insert_userSavedSearches(20)
    insert_recipeTags(50)
    
    print("Data insertion complete!")

#run main function
if __name__ == "__main__":
    main()

#close database connection after operations
cursor.close()
db_connection.close()