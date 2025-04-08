import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
  