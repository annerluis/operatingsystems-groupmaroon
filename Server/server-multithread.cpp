// Required dependencies: 
// curl -O https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
// curl -O https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp


#include "httplib.h"
#include "json.hpp"
#include <mysqlx/xdevapi.h>
#include <mutex>

using namespace httplib;
using json = nlohmann::json;
using namespace std;
using namespace mysqlx;

// Mutex for thread-safe access to data
mutex data_mutex;

// Connect to MySQL
Session sess("localhost", 33060, "root", "", "recipe_app"); // Adjust credentials if needed
Schema db = sess.getSchema("recipe_app");

int main() {
    Server svr;

    svr.Get("/api/getUsers", [](const Request& req, Response& res) {
        lock_guard<mutex> lock(data_mutex);

        json result = json::array();

        try {
            Table userTable = db.getTable("user");
            RowResult users = userTable.select("username", "password").execute();

            for (Row row : users) {
                result.push_back({
                    {"username", std::string(row[0])},
                    {"password", std::string(row[1])}
                });
            }

            res.set_content(result.dump(), "application/json");
        } catch (const mysqlx::Error& err) {
            res.status = 500;
            res.set_content(json({{"error", err.what()}}).dump(), "application/json");
        }
    });

    svr.Get("/", [](const Request& req, Response& res) {
        res.set_content("Welcome to the Recipe API!", "text/plain");
    });

    cout << "Server is running at http://localhost:8080" << endl;
    svr.listen("0.0.0.0", 8080);
}
