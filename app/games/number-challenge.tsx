import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy, RotateCcw, Timer } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function NumberChallengeGame() {
  const router = useRouter();
  const { updateGamePlayed } = useProgress();
  
  const [currentNumber, setCurrentNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameActive]);

  const generateRound = () => {
    const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    setCurrentNumber(number);
    setUserAnswer('');
    setTimeLeft(10);
  };

  const handleNumberInput = (digit: string) => {
    if (userAnswer.length < 2) {
      const newAnswer = userAnswer + digit;
      setUserAnswer(newAnswer);
      
      // Auto-check if 2 digits entered
      if (newAnswer.length === 2 || (newAnswer.length === 1 && parseInt(newAnswer) <= 10)) {
        checkAnswer(newAnswer);
      }
    }
  };

  const checkAnswer = (answer: string) => {
    const numAnswer = parseInt(answer);
    
    if (numAnswer === currentNumber) {
      // Correct
      const points = Math.max(10, timeLeft * 2); // Bonus for speed
      setScore(prev => prev + points);
      setRound(prev => prev + 1);
      
      if (round >= 10) {
        endGame();
      } else {
        generateRound();
      }
    } else {
      // Wrong
      Alert.alert('❌ Incorrect', `The correct answer was ${currentNumber}`, [
        { text: 'Continue', onPress: () => {
          setRound(prev => prev + 1);
          if (round >= 10) {
            endGame();
          } else {
            generateRound();
          }
        }}
      ]);
    }
  };

  const handleTimeout = () => {
    Alert.alert('⏰ Time Up!', `The correct answer was ${currentNumber}`, [
      { text: 'Continue', onPress: () => {
        setRound(prev => prev + 1);
        if (round >= 10) {
          endGame();
        } else {
          generateRound();
        }
      }}
    ]);
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const endGame = () => {
    setGameActive(false);
    updateGamePlayed('number-challenge', score);
    
    Alert.alert(
      '🎉 Game Complete!',
      `Final Score: ${score}\nRounds: ${round}/10`,
      [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setGameActive(true);
    generateRound();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Number Challenge</Text>
        <View style={styles.scoreContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.roundText}>Question {round}/10</Text>
        <View style={styles.timerContainer}>
          <Timer size={20} color={timeLeft <= 3 ? '#FF6B6B' : '#fff'} />
          <Text style={[styles.timerText, timeLeft <= 3 && styles.timerWarning]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <Text style={styles.questionText}>Show this number in ISL:</Text>
        
        <View style={styles.numberDisplay}>
          <Text style={styles.numberText}>{currentNumber}</Text>
        </View>

        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>Your Answer:</Text>
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>{userAnswer || '_'}</Text>
          </View>
        </View>

        {/* Number Pad */}
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.padButton,
                item === '✓' && styles.checkButton,
                item === '⌫' && styles.backButton,
              ]}
              onPress={() => {
                if (item === '✓') {
                  if (userAnswer) checkAnswer(userAnswer);
                } else if (item === '⌫') {
                  handleBackspace();
                } else {
                  handleNumberInput(item.toString());
                }
              }}
            >
              <Text style={styles.padButtonText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  roundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  timerWarning: {
    color: '#FF6B6B',
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
    marginBottom: 24,
  },
  numberDisplay: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    backgroundColor: '#84a627',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  numberText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#fff',
  },
  answerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  answerLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  answerBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    minWidth: 100,
  },
  answerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  padButton: {
    width: (SCREEN_WIDTH - 80) / 3 - 8,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
  },
  padButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
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
