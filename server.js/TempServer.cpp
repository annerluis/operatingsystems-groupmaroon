#include <iostream>
#include <mysql/mysql.h>
#include <httplib.h>
#include <json.hpp>
#include <string>
#include <sstream>
#include <cstdlib>

using namespace httplib;
using json = nlohmann::json;

// MySQL connection details (change password if needed)
const char* HOST = "localhost";
const char* USER = "root";
const char* PASS = "root";
const char* DB = "recipe_app";

// Establish connection to MySQL and return it
MYSQL* connectToDatabase() {
    MYSQL* conn = mysql_init(nullptr);
    if (!conn) {
        std::cerr << "MySQL init failed\n";
        return nullptr;
    }

    if (!mysql_real_connect(conn, HOST, USER, PASS, DB, 0, nullptr, 0)) {
        std::cerr << "MySQL connection error: " << mysql_error(conn) << "\n";
        return nullptr;
    }

    return conn;
}

// Ignores wildcard characters in recipe search input
std::string escapeWildcards(const std::string& input) {
    std::string result;
    for (char c : input) {
        if (c == '%' || c == '_') result += '\\';
        result += c;
    }
    return result;
}

int main() {
    Server svr;
    MYSQL* conn = connectToDatabase();

    if (!conn) return 1;
    std::cout << "Connected to MySQL.\n";

    // Check that the server is running
    svr.Get("/", [](const Request&, Response& res) {
        res.set_content("Hello from our server!", "text/plain");
    });

    // Search for recipes by name
    svr.Post("/getRecipes", [conn](const Request& req, Response& res) {
        json body = json::parse(req.body);
        std::string recipeName = body["recipeName"];
        std::string search = "%" + escapeWildcards(recipeName) + "%";

        std::string query = "SELECT * FROM recipes WHERE name LIKE ?";

        MYSQL_STMT* stmt = mysql_stmt_init(conn);
        mysql_stmt_prepare(stmt, query.c_str(), query.length());

        MYSQL_BIND param[1];
        memset(param, 0, sizeof(param));
        param[0].buffer_type = MYSQL_TYPE_STRING;
        param[0].buffer = (void*)search.c_str();
        param[0].buffer_length = search.length();
        mysql_stmt_bind_param(stmt, param);

        mysql_stmt_execute(stmt);
        MYSQL_RES* meta = mysql_stmt_result_metadata(stmt);
        int columns = mysql_num_fields(meta);

        MYSQL_BIND results[columns];
        memset(results, 0, sizeof(results));

        char name[100], instructions[255], author[100];
        int id;

        results[0].buffer_type = MYSQL_TYPE_LONG;
        results[0].buffer = &id;

        results[1].buffer_type = MYSQL_TYPE_STRING;
        results[1].buffer = name;
        results[1].buffer_length = sizeof(name);

        results[2].buffer_type = MYSQL_TYPE_STRING;
        results[2].buffer = instructions;
        results[2].buffer_length = sizeof(instructions);

        results[3].buffer_type = MYSQL_TYPE_STRING;
        results[3].buffer = author;
        results[3].buffer_length = sizeof(author);

        mysql_stmt_bind_result(stmt, results);

        // Build JSON response array
        json result = json::array();
        while (mysql_stmt_fetch(stmt) == 0) {
            result.push_back({
                {"recipeID", id},
                {"name", name},
                {"instructions", instructions},
                {"author", author}
            });
        }

        mysql_free_result(meta);
        mysql_stmt_close(stmt);
        res.set_content(result.dump(), "application/json");
    });

    // Fetch 3 random rows from recipe table
    svr.Get("/getRandomRecipes", [conn](const Request&, Response& res) {
        const char* query = "SELECT * FROM recipes ORDER BY RAND() LIMIT 3";
        if (mysql_query(conn, query)) {
            res.status = 500;
            res.set_content("Failed to fetch recipes", "text/plain");
            return;
        }

        MYSQL_RES* result = mysql_store_result(conn);
        MYSQL_ROW row;
        json recipes = json::array();

        while ((row = mysql_fetch_row(result))) {
            recipes.push_back({
                {"recipeID", std::stoi(row[0])},
                {"name", row[1]},
                {"instructions", row[2]},
                {"author", row[3]}
            });
        }

        mysql_free_result(result);
        res.set_content(recipes.dump(), "application/json");
    });

    // Login - verify username and password
    svr.Post("/login", [conn](const Request& req, Response& res) {
        json body = json::parse(req.body);
        std::string username = body["username"];
        std::string password = body["password"];

        if (username.empty() || password.empty()) {
            res.status = 400;
            res.set_content("{\"message\": \"Username and password are required\"}", "application/json");
            return;
        }

        std::ostringstream query;
        query << "SELECT * FROM user WHERE username='" << username
              << "' AND password='" << password << "'";

        if (mysql_query(conn, query.str().c_str())) {
            res.status = 500;
            res.set_content("{\"message\": \"Database error\"}", "application/json");
            return;
        }

        MYSQL_RES* result = mysql_store_result(conn);
        if (mysql_num_rows(result) == 0) {
            res.status = 404;
            res.set_content("{\"message\": \"No account found\"}", "application/json");
        } else {
            json user = {{"username", username}};
            res.status = 200;
            res.set_content(json({{"message", "Login successful"}, {"user", user}}).dump(), "application/json");
        }

        mysql_free_result(result);
    });

    // Insert a new recipe into the database
    svr.Post("/createNewRecipe", [conn](const Request& req, Response& res) {
        json body = json::parse(req.body);
        std::string username = body["username"];
        std::string name = body["name"];
        std::string instructions = body["instructions"];
        int recipeID = rand() % 100000;

        std::ostringstream query;
        query << "INSERT INTO recipes VALUES(" << recipeID << ", '" << name
              << "', '" << instructions << "', '" << username << "')";

        if (mysql_query(conn, query.str().c_str())) {
            res.status = 500;
            res.set_content("{\"error\": \"Failed to insert recipe\"}", "application/json");
        } else {
            res.status = 200;
            res.set_content("{\"message\": \"Recipe created successfully\"}", "application/json");
        }
    });

    std::cout << "Server running at http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);

    mysql_close(conn);
    return 0;
}
