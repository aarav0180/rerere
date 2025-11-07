import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { CameraView } from 'expo-camera';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HandDetectorProps {
  onSignDetected: (sign: string) => void;
  isPaused: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getISLSignImage = (letter: string) => {
  // Temporary: Using colorful letter placeholders
  const colors = ['4CAF50', 'FF9800', '2196F3', 'E91E63', '9C27B0', 'FF5722'];
  const colorIndex = letter.charCodeAt(0) % colors.length;
  
  return `https://via.placeholder.com/100x100/${colors[colorIndex]}/FFFFFF?text=ISL%20${letter}`;
};

// Note: TensorFlow.js logs in console are from gesture detection initialization
// They are harmless and can be ignored. The game uses button taps for now.
// When you implement actual hand gesture recognition, you'll need to add TensorFlow model files.
//hbjbjhbjhbhj


export default function HandDetector({ onSignDetected, isPaused }: HandDetectorProps) {
  const [facing, setFacing] = useState<'front' | 'back'>('front');

  // Calculate button size - 8 buttons per row (smaller size)
  const buttonSize = (SCREEN_WIDTH - 45) / 8;

  return (
    <View style={styles.container}>
      {/* Camera View without children */}
      <CameraView style={styles.camera} facing={facing} />
      
      {/* Overlay positioned absolutely on top of camera */}
      <View style={styles.overlay}>
        <View style={styles.signsContainer}>
          <Text style={styles.instructions}>
            🤟 Tap the ISL sign
          </Text>
          
          <View style={styles.signsGrid}>
            {ALPHABET.map(letter => {
              return (
                <TouchableOpacity
                  key={letter}
                  style={[styles.signButton, { width: buttonSize, height: buttonSize }]}
                  onPress={() => !isPaused && onSignDetected(letter)}
                  disabled={isPaused}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={{ uri: getISLSignImage(letter) }}
                    style={styles.signImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          
          <Text style={styles.footerNote}>
            💡 Add your ISL images to make it authentic
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  signsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 100,
    pointerEvents: 'auto',
  },
  instructions: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  signsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  signButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(132, 166, 39, 0.4)',
    overflow: 'hidden',
  },
  signImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  footerNote: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },
});
