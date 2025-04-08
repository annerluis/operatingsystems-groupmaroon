import { Image, StyleSheet, Platform } from 'react-native';
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
    Dimensions
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SearchScreen() {

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
            <ThemedText type="title">Search Recipes Here!</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Hello</ThemedText>
            <ThemedText>
              This is a recipe app.
            </ThemedText>
            <SearchBar />
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <DisplayRecipes />
          </ThemedView>
        </ParallaxScrollView>
      );
}

function SearchBar (){
    const [searchInput, setSearchInput] = useState('');

    return (
        <View>
            <TextInput style={styles.input} placeholder="Recipe Name" value={searchInput} onChangeText={setSearchInput} />
        </View>
    );
}

function DisplayRecipes (){
    return (
        <View>
            <ThemedText>
              This is where the results will go.
            </ThemedText>
        </View>
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
});
  