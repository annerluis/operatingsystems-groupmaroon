import { Image, StyleSheet, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
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

export default function AccountScreen() {
  return (
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
    );
}

function LoginArea (){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const login = () => {

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