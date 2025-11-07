import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import FallingLetter from './FallingLetter';
import HandDetector from './HandDetector';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Letter {
  id: string;
  letter: string;
  x: number;
  y: Animated.Value;
  speed: number;
  sliced: boolean;
}

interface SignNinjaGameProps {
  isPaused: boolean;
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LETTER_SPAWN_INTERVAL = 4000; // 4 seconds (increased from 3)
const MAX_MISSED_LETTERS = 3;

export default function SignNinjaGame({ isPaused, onScoreUpdate, onGameOver }: SignNinjaGameProps) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const letterIdCounter = useRef(0);

  // Spawn new falling letter
  const spawnLetter = () => {
    if (isPaused || missedCount >= MAX_MISSED_LETTERS) return;

    const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const randomX = Math.random() * (SCREEN_WIDTH - 80); // 80 is letter width
    
    const newLetter: Letter = {
      id: `letter-${letterIdCounter.current++}`,
      letter: randomLetter,
      x: randomX,
      y: new Animated.Value(-100),
      speed: 8000 + Math.random() * 3000, // 8-11 seconds to fall (much slower)
      sliced: false,
    };

    setLetters(prev => [...prev, newLetter]);

    // Animate letter falling
    Animated.timing(newLetter.y, {
      toValue: SCREEN_HEIGHT + 100,
      duration: newLetter.speed,
      useNativeDriver: true,
    }).start(() => {
      // Letter reached bottom without being sliced
      if (!newLetter.sliced) {
        setMissedCount(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_MISSED_LETTERS) {
            onGameOver(score);
          }
          return newCount;
        });
      }
      // Remove letter from array
      setLetters(prev => prev.filter(l => l.id !== newLetter.id));
    });
  };

  // Start spawning letters
  useEffect(() => {
    if (!isPaused && missedCount < MAX_MISSED_LETTERS) {
      spawnTimerRef.current = setInterval(spawnLetter, LETTER_SPAWN_INTERVAL);
      spawnLetter(); // Spawn first letter immediately
    }

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [isPaused, missedCount]);

  // Handle sign detection
  const handleSignDetected = (sign: string) => {
    setDetectedSign(sign);
    
    // Check if detected sign matches any falling letter
    setLetters(prev => {
      const updatedLetters = prev.map(letter => {
        if (letter.letter === sign && !letter.sliced) {
          // Mark as sliced
          letter.sliced = true;
          
          // Update score
          setScore(currentScore => {
            const newScore = currentScore + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          
          return { ...letter, sliced: true };
        }
        return letter;
      });
      return updatedLetters;
    });

    // Clear detected sign after a short delay
    setTimeout(() => setDetectedSign(null), 500);
  };

  return (
    <View style={styles.gameContainer}>
      {/* Camera View for Hand Detection */}
      <HandDetector 
        onSignDetected={handleSignDetected}
        isPaused={isPaused}
      />

      {/* Falling Letters */}
      <View style={styles.lettersContainer} pointerEvents="none">
        {letters.map(letter => (
          <FallingLetter
            key={letter.id}
            letter={letter.letter}
            x={letter.x}
            y={letter.y}
            sliced={letter.sliced}
          />
        ))}
      </View>

      {/* Lives Indicator */}
      <View style={styles.livesContainer}>
        {Array.from({ length: MAX_MISSED_LETTERS - missedCount }).map((_, i) => (
          <View key={i} style={styles.heart} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    position: 'relative',
  },
  lettersContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  livesContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 20,
  },
  heart: {
    width: 30,
    height: 30,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
  },
});
