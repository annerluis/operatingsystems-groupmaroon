#include <iostream>
#include <string>
#include <sstream>
#include <fstream>
#include <cstring> // Include the <cstring> header for memset

#include <httplib.h>

/* https://stackoverflow.com/questions/70141812/how-to-run-cprogram-at-the-backend-of-a-web-application */


int main(void)
{
    using namespace httplib;

    Server svr;

    svr.Get(R"(/numbers/(\d+))", [&](const Request &req, Response &res)
            {
            auto numbers = req.matches[1];
            res.set_content(numbers, "text/plain");
        });

    svr.Get("/stop", [&](const Request &req, Response &res)
            { svr.stop(); });

    svr.listen("localhost", 6000);
}