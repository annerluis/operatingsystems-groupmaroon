import { Image, StyleSheet, Platform } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Modal,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});


var userToken = false;
//var accountType = "";

export { userToken };

// things to disable patient search for admin users
const AuthContext = createContext<{
  accountType: string;
  setAccountType: (type: string) => void;
}>({ accountType: '', setAccountType: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AccountScreen (){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userToken, setUserToken] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');

  const createRecipe = () => {
    try {
      apiClient.post('/createNewRecipe', {  username: username, name: recipeName, instructions: recipeInstructions })
      .then(response => {
          if (response.data.length === 0) {
            alert('No account was found');
          }
          else {
            alert(response.data); //update state with the patient data
          }
        } 
      );
    } catch (err) {
      console.error('Error fetching patient data:', err);
    }
  }

  const logout = () => {
    setUserToken(false);
  }

    
  const login = () => {
    apiClient.post('/login', { username: username, password: password })
        .then(response => {
            if (response.data && response.data.user) {
                setUserToken(true);
                alert("Successful login!");
            } else {
                alert('No account was found');
            }
        })
        .catch(error => {
            if (error.response) {
                if (error.response.status === 404) {
                    alert('Invalid username or password');
                } else {
                    alert('An error occurred. Please try again.');
                }
            } else {
                alert('Network error');
            }
            console.error('Error logging in:', error);
        });
};


    const createAccount = () => {
        if (!username || !password) {
            alert('Please fill in both fields');
            return;
        }

        apiClient.post('/createAccount', { username, password })
            .then(response => {
                alert(response.data.message);
                setUserToken(true);
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message); // show errors
                } else {
                    alert('Failed to create account');
                    console.error(error);
                }
            });
    };

  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D5FFFD', dark: '#D5FFFD' }}
      headerImage={
        <Image
          source={require('@/assets/images/dish.png')}
          style={styles.reactLogo}
        />
      }>

      <ThemedView style={styles.stepContainer}>
        {userToken === false ? (
          <InputGroup>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Login or Create Account</ThemedText>
              <Text></Text>
            </ThemedView>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                <Button
                    style={styles.button}
                    onClick={login}
                    variant="outline-secondary"
                >
                    Login
                </Button>

                <Button
                    style={styles.button}
                    onClick={createAccount}
                    variant="outline-secondary"
                >
                    Create Account
                </Button>
            </InputGroup>
        ) : (
            <InputGroup>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Create a Recipe</ThemedText>
                    <Text></Text>
                </ThemedView>

                <TextInput
                    style={styles.input}
                    placeholder="Recipe Name"
                    value={recipeName}
                    onChangeText={setRecipeName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Instructions"
                    value={recipeInstructions}
                    onChangeText={setRecipeInstructions}
                />

                <Button
                    style={styles.button}
                    onClick={createRecipe}
                    variant="outline-secondary"
                    id="button-addon2"
                >
                    Create Recipe
                </Button>

                <Button
                    style={styles.button}
                    onClick={logout}
                    variant="outline-secondary"
                    id="button-addon2"
                >
                    Logout
                </Button>
            </InputGroup>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

function LoginArea (){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const login = () => {
    try {
      apiClient.post('/login', { username: username, password: password })
      .then(response => {
          if (response.data.length === 0) {
            //setError('No patient data found for this clinician.'); 
            alert('No account was found');
          }
          else {
            userToken = true;
            alert(response.data); //update state with the patient data
          }
        } 
      );
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to fetch patient data. Please try again.');
    }
  }


  return (
    <View>
      <InputGroup>
        <TextInput style={styles.input} placeholder="Username" value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Password" value={username} onChangeText={setUsername} secureTextEntry={true}/>

        <Button style={styles.button} onClick={login} variant="outline-secondary" id="button-addon2">
          Login
        </Button>
      </InputGroup>
    </View>
  );
}


function CreateArea (){
  const [recipeName, setRecipeName] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');

  const createRecipe = () => {
    try {
      apiClient.post('/createNewRecipe', {  username: userToken, name: recipeName, instructions: recipeInstructions })
      .then(response => {
          if (response.data.length === 0) {
            //setError('No patient data found for this clinician.'); 
            alert('No account was found');
          }
          else {
            userToken = true;
            alert(response.data); //update state with the patient data
          }
        } 
      );
    } catch (err) {
      console.error('Error fetching patient data:', err);
    }
  }

  const logout = () => {
    userToken = false;
  }

  return (
    <View>
      <InputGroup>
        <TextInput style={styles.input} placeholder="Username" value={recipeName} onChangeText={setRecipeName} />
        <TextInput style={styles.input} placeholder="Password" value={recipeInstructions} onChangeText={setRecipeInstructions}/>

        <Button style={styles.button} onClick={createRecipe} variant="outline-secondary" id="button-addon2">
          Create Recipe
        </Button>

        <Button style={styles.button} onClick={logout} variant="outline-secondary" id="button-addon2">
          Logout
        </Button>
      </InputGroup>
    </View>
  );
}




/*export default*/ function TabLayout() {
  const [lModalVisible, setLModalVisible] = useState(false); //login modal 
  const [cModalVisible, setCModalVisible] = useState(false); //create account modal

  const [accountType, setAccountType] = useState('');
  const [userToken, setUserToken] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const confirmLogout = () => {
    setUserToken(false);


  };




  const login = () => {
    try {
      apiClient.post('/login', { username: username, password: password })
      .then(response => {
          if (response.data.length === 0) {
            //setError('No patient data found for this clinician.'); 
            alert('No account was found');
          }
          else {
            setUserToken(true);
            alert(response.data); //update state with the patient data
          }
        } 
      );
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to fetch patient data. Please try again.');
    }
  }

  
  
  return (
    <AuthContext.Provider value={{ accountType, setAccountType }}>
    <>
      {userToken == false ? (
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#D5FFFD', dark: '#D5FFFD' }}
        headerImage={
          <Image
            source={require('@/assets/images/dish.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Login to your account</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <LoginArea />
        </ThemedView>
      </ParallaxScrollView>
      ) : (
        // User is signed in
      <>
      </>
      )}
    </>
    </AuthContext.Provider>
  );
}



/*export default function AccountScreen() {
  const [accountType, setAccountType] = useState('');
  
  return (
    <AuthContext.Provider value={{ accountType, setAccountType }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D5FFFD', dark: '#D5FFFD' }}
        headerImage={
          <Image
            source={require('@/assets/images/dish.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Login to your account</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <LoginArea />
        </ThemedView>
      </ParallaxScrollView>
    </AuthContext.Provider>
    );
}*/


// Styling
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 230,
    width: 230,
    top: 10,
    left: 10,
    position: 'absolute',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00796B',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 10,
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 5,
    alignItems: 'center',
  },
  addSymptomButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 5,
    alignItems: 'center',
  },
  submitQuestionnaireButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    margin: 8
  },
  checkboxContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 6, 
    width: '100%', 
    paddingLeft: 10, 
  },
  checkboxLabel: {
    fontSize: 16, 
    marginLeft: 8, 
    color: '#333', 
  },
  checkboxGroup: {
    width: '100%',
    marginTop: 15, 
    marginBottom: 20, 
  },
  questionnaireContainer: {
    alignItems: 'flex-start', 
    width: '100%', 
    paddingHorizontal: 10, 
    marginTop: 15, 
    marginBottom: 20, 
  },
  questionnaireLabel: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 5, 
  },
  questionnaireInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginBottom: 15, 
  },
  fetchButton: {
    backgroundColor: '#00796B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  patientItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  patientName: {
  },
  patientList: {
    width: '100%',
    marginTop: 10,
  },
  error: {
    textAlign: 'center',
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    width: 250,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dashboardContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dashboardSection: {
    marginBottom: 15,
  },
  pSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 6,
    paddingBottom: 6,
  },
  scrollContainer: {
    width: '100%',
    maxHeight: 600,
  },
  picker: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#00796B',
    borderRadius: 8,
    backgroundColor: '#E0F2F1',
    marginVertical: 8,
    paddingLeft: 10,
    color: '#004D40', 
  },

  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
    marginTop: 15,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
});