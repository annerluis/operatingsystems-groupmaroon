// C++ program to demonstrate
// multithreading using three
// different callables.
#include <iostream> 
#include <string>
#include <fstream>
#include <filesystem>  

#include <sstream>
#include <vector>
#include <thread>
#include <semaphore>

#include <unistd.h> 
#include <signal.h>

using namespace std; 

std::counting_semaphore<10> sem(1); 

class CountryProcess {
    public:
        string country;
        vector<vector<string>> cities;
        int pid;
};

string checkPlace(vector<vector<string>> parsedCsv, string search)
{
  
    for (int i = 0; i < parsedCsv.size(); i++)
    {
        if(parsedCsv[i][2] == search){
            return parsedCsv[i][0];
        }
    }
    return "-1";
}

int checkCities(vector<CountryProcess> &countryPro, int location, string search)
{

    for (int i = 0; i < countryPro[location].cities.size(); i++)
    {
        if(countryPro[location].cities[i][0] == search){
            return i;
        }
    }

    return -1;
}


vector<vector<string>> readCSV(){
    ifstream  data("cities.csv");
    string line;
  
    vector<vector<string>> parsedCsv;
  
    while(getline(data,line))
    {
        stringstream lineStream(line);
        string cell;
        vector<string> parsedRow;
        while(getline(lineStream,cell,','))
        {
            parsedRow.push_back(cell);
        }
  
        parsedCsv.push_back(parsedRow);
    }
  
    return parsedCsv;
}

  
vector<string> countryFileToArray(string country){
    std::ifstream input(country + ".txt");

    vector<string> contents;
    string line;

    while (std::getline(input, line)) {
        contents.push_back(line);
    }

    input.close();

    return contents;
}



int getFileLength(string city) { 
    int number_of_lines = 0;
    std::string line;

    std::ifstream myfile(city + ".txt");

    if(myfile.good()){
        while (std::getline(myfile, line))
            ++number_of_lines;
        return number_of_lines;
    }
    else {
        return -1;
    }    
}


void writeToFile(string country, vector<vector<string>> parsedCsv, int location, int currentPosition){
    sem.acquire();

    vector<string> contents = countryFileToArray(country); 
    std::filesystem::remove(country + ".txt");

    std::ofstream outfile;
    string myFile = country + ".txt";

    outfile.open(myFile, std::ios_base::app);

    for (int i = 0; i < contents.size(); i++){
        
        stringstream ss(contents[i]);
        vector<string> v;
        string s;
        
        while (getline(ss, s, ' ')) {
 
            // store token string in the vector
            v.push_back(s);
        }

        if (std::stoi(v[0]) < currentPosition){
            double currentAvg = stod(v[2])*stod(v[0]);
            //cout << v[0];
            double avg = ((std::stod(parsedCsv[location][13+i]) + currentAvg)/(std::stod(v[0]) + 1));

            outfile << currentPosition << " " << parsedCsv[0][13+i] << " " << avg << std::endl;

        }
        else {
            outfile << v[0] << " " << v[1] << " " << v[2] << std::endl;
        }
        
        
    }
    if (currentPosition == 1){
        int len = getFileLength(country);
        outfile << "1" << " " << parsedCsv[0][13+len] << " " << parsedCsv[location][13+len] << std::endl;
    }
    

    outfile.close();
    sem.release(); 
    
}

int scheduleManager(vector<vector<string>> parsedCsv, CountryProcess &country){
    for (int i = 0; i< parsedCsv[0].size(); i++){
        for (int j = 0; j < country.cities.size(); j++){ 
            cout << j;   
            thread t(writeToFile, country.country, parsedCsv, stoi(country.cities[j][1]), (j+1)); //, parsedCsv, country.locationNum
         
            t.join();
        }
    }

    return 0;
}

int getCountryRow(vector<CountryProcess> &countryPro, string country){
    for (int i = 0; i < countryPro.size(); i++){
        if(countryPro[i].country == country){
            return i;
        }
    }

    return -1;
}


// Driver code
int main()
{
    string city;
    bool ongoing = true;

    vector<vector<string>> parsedCsv = readCSV();
    vector<CountryProcess> countryPro;

    while (ongoing){

        cout << "Type a city: "; // Type a number and press enter

        cin >> city; // Get user input from the keyboard

        if (city == "exit"){
            ongoing = false;
            kill(-1*getpid(), SIGKILL);
            break;
        }

        //Getting location of city in the csv file
        int locationNum = (std::stoi(checkPlace(parsedCsv, city)) +1);
        if (locationNum == 0){
            cout << "Not a city." << std::endl;
            continue;
        }


        //Getting the country of the city
        string country = parsedCsv[locationNum][5];

        //Getting the countries location in 
        int countryRowLocation = getCountryRow(countryPro, country);


        if(countryRowLocation == -1){
            CountryProcess temp;
            temp.country = country;
            temp.cities.push_back({city, std::to_string(locationNum)});
            
            int c_pid = fork(); 
  
            if (c_pid == -1) { 
                perror("fork"); 
                exit(EXIT_FAILURE); 
            } 
            else if (c_pid > 0) { 
                temp.pid = c_pid;
                countryPro.push_back(temp);
                continue;
            } 
            else { 
                countryPro.push_back(temp);
                countryRowLocation = countryPro.size() -1;
                
                scheduleManager(parsedCsv, countryPro[countryRowLocation]);
                exit(EXIT_FAILURE); 
            }
            //scheduleManager(parsedCsv, countryPro[countryRowLocation]);
        }
        else{
            int cityPos = checkCities(countryPro, countryRowLocation, city);
            if(cityPos == -1){
                countryPro[countryRowLocation].cities.push_back({city, std::to_string(locationNum)});

                kill(countryPro[countryRowLocation].pid, SIGKILL);

                int c_pid = fork(); 
  
                if (c_pid == -1) { 
                    perror("fork"); 
                    exit(EXIT_FAILURE); 
                } 
                else if (c_pid > 0) { 
                    countryPro[countryRowLocation].pid = c_pid;
                    continue;
                } 
                else {
                    scheduleManager(parsedCsv, countryPro[countryRowLocation]);
                    exit(EXIT_FAILURE); 
                }
            }
            else{
                cout << "City already exsists" << endl;
            }
        }
    }


    return 0;
}
