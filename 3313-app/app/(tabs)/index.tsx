import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
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



//We don't need to worry about this right now, could be used for account information later

export default function BrowseScreen() {
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
        <ThemedText type="title">Welcome To Recipe App!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Hello</ThemedText>
        <ThemedText>
          This is a recipe app.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}



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
});
