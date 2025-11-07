import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface FallingLetterProps {
  letter: string;
  x: number;
  y: Animated.Value;
  sliced: boolean;
}

export default function FallingLetter({ letter, x, y, sliced }: FallingLetterProps) {
  const sliceAnimation = new Animated.Value(1);
  const rotateAnimation = new Animated.Value(0);

  useEffect(() => {
    if (sliced) {
      // Slice animation
      Animated.parallel([
        Animated.timing(sliceAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sliced]);

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View
      style={[
        styles.letterContainer,
        {
          left: x,
          transform: [
            { translateY: y },
            { scale: sliceAnimation },
            { rotate },
          ],
        },
      ]}
    >
      <Text style={[styles.letter, sliced && styles.slicedLetter]}>{letter}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  letterContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 60,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  slicedLetter: {
    color: '#84a627',
  },
});
