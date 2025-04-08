import { Tabs } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

import { View } from 'react-native';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

var userToken = false;

export { userToken };

// things to disable patient search for admin users
const AuthContext = createContext<{
  accountType: string;
  setAccountType: (type: string) => void;
}>({ accountType: '', setAccountType: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}


export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [cModalVisible, setCModalVisible] = useState(false);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#152e2e',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: '#D5FFFD',
              
          },
          default: {
            backgroundColor: '#D5FFFD',
          }
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
      name="browse"
      options={{
        title: 'Browse Recipes',
        //tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
      }}
    />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search Recipes',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
