import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy, RotateCcw, Timer, Zap } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const GAME_DURATION = 60; // 60 seconds

const loadImage = (letter: string) => {
  // ...existing loadImage function from alphabet-match...
  try {
    switch (letter) {
      case 'A': return require('../../assets/images/A.jpeg');
      case 'B': return require('../../assets/images/B.jpeg');
      // ... rest of cases
      default: return null;
    }
  } catch {
    return null;
  }
};

export default function SpeedSignsGame() {
  const router = useRouter();
  const { updateGamePlayed } = useProgress();
  
  const [currentLetter, setCurrentLetter] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(true);
  const [combo, setCombo] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateNewLetter();
    startTimer();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateNewLetter = () => {
    const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setCurrentLetter(letter);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!gameActive) return;

    if (isCorrect) {
      const points = 10 + (combo * 2); // Combo bonus
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      generateNewLetter();
    } else {
      setCombo(0);
      // Penalty: lose 2 seconds
      setTimeLeft(prev => Math.max(0, prev - 2));
    }
  };

  const endGame = () => {
    setGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    updateGamePlayed('speed-signs', score);
    
    Alert.alert(
      '⏰ Time Up!',
      `Final Score: ${score}\nMax Combo: ${combo}`,
      [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setGameActive(true);
    generateNewLetter();
    startTimer();
  };

  const imageSource = loadImage(currentLetter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Speed Signs</Text>
        <View style={styles.scoreContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <View style={styles.timerBox}>
          <Timer size={24} color={timeLeft <= 10 ? '#FF6B6B' : '#fff'} />
          <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>
            {timeLeft}s
          </Text>
        </View>
        
        {combo > 0 && (
          <View style={styles.comboBox}>
            <Zap size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.comboText}>x{combo} Combo!</Text>
          </View>
        )}
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <Text style={styles.questionText}>Is this the sign for "{currentLetter}"?</Text>
        
        {/* Sign Image */}
        <View style={styles.signContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.signImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderSign}>
              <Text style={styles.placeholderText}>Sign for {currentLetter}</Text>
            </View>
          )}
        </View>

        {/* Answer Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.answerButton, styles.correctButton]}
            onPress={() => handleAnswer(true)}
            disabled={!gameActive}
          >
            <Text style={styles.answerButtonText}>✓ YES</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.answerButton, styles.wrongButton]}
            onPress={() => handleAnswer(false)}
            disabled={!gameActive}
          >
            <Text style={styles.answerButtonText}>✗ NO</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tipText}>Answer as fast as you can!</Text>
      </View>

      {/* Restart Button */}
      <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
        <RotateCcw size={20} color="#fff" />
        <Text style={styles.restartText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#16213e',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#84a627',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  timerWarning: {
    color: '#FF6B6B',
  },
  comboBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comboText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  signContainer: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  signImage: {
    width: '100%',
    height: '100%',
  },
  placeholderSign: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9f0',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#84a627',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  wrongButton: {
    backgroundColor: '#FF6B6B',
  },
  answerButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 16,
  },
  restartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
