import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { CameraView } from 'expo-camera';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HandDetectorProps {
  onSignDetected: (sign: string) => void;
  isPaused: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Safe image loader - returns null if image doesn't exist
const loadImage = (letter: string) => {
  try {
    // Try to load from assets/images with .jpeg extension
    switch (letter) {
      case 'A': return require('../../../assets/images/A.jpeg');
      case 'B': return require('../../../assets/images/B.jpeg');
      case 'C': return require('../../../assets/images/C.jpeg');
      case 'D': return require('../../../assets/images/D.jpeg');
      case 'E': return require('../../../assets/images/E.jpeg');
      case 'F': return require('../../../assets/images/F.jpeg');
      case 'G': return require('../../../assets/images/G.jpeg');
      case 'H': return require('../../../assets/images/H.jpeg');
      case 'I': return require('../../../assets/images/I.jpeg');
      case 'J': return require('../../../assets/images/J.jpeg');
      case 'K': return require('../../../assets/images/K.jpeg');
      case 'L': return require('../../../assets/images/L.jpeg');
      case 'M': return require('../../../assets/images/M.jpeg');
      case 'N': return require('../../../assets/images/N.jpeg');
      case 'O': return require('../../../assets/images/O.jpeg');
      case 'P': return require('../../../assets/images/P.jpeg');
      case 'Q': return require('../../../assets/images/Q.jpeg');
      case 'R': return require('../../../assets/images/R.jpeg');
      case 'S': return require('../../../assets/images/S.jpeg');
      case 'T': return require('../../../assets/images/T.jpeg');
      case 'U': return require('../../../assets/images/U.jpeg');
      case 'V': return require('../../../assets/images/V.jpeg');
      case 'W': return require('../../../assets/images/W.jpeg');
      case 'X': return require('../../../assets/images/X.jpeg');
      case 'Y': return require('../../../assets/images/Y.jpeg');
      case 'Z': return require('../../../assets/images/Z.jpeg');
      default: return null;
    }
  } catch (error) {
    return null;
  }
};

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
              const imageSource = loadImage(letter);
              
              return (
                <TouchableOpacity
                  key={letter}
                  style={[styles.signButton, { width: buttonSize, height: buttonSize }]}
                  onPress={() => !isPaused && onSignDetected(letter)}
                  disabled={isPaused}
                  activeOpacity={0.7}
                >
                  {imageSource ? (
                    <Image 
                      source={imageSource}
                      style={styles.signImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>{letter}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f9f0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#84a627',
  },
});
