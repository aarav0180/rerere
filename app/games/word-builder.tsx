import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy, RotateCcw, CheckCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WORDS = [
  { word: 'CAT', hint: 'A furry pet that says meow' },
  { word: 'DOG', hint: 'A loyal pet that barks' },
  { word: 'BAT', hint: 'Flies at night' },
  { word: 'HAT', hint: 'You wear this on your head' },
  { word: 'CAR', hint: 'A vehicle with 4 wheels' },
  { word: 'BED', hint: 'You sleep on this' },
  { word: 'SUN', hint: 'Bright star in the sky' },
  { word: 'BAG', hint: 'You carry things in this' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function WordBuilderGame() {
  const router = useRouter();
  const { updateGamePlayed } = useProgress();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  useEffect(() => {
    initializeRound();
  }, [currentWordIndex]);

  const initializeRound = () => {
    setUserAnswer([]);
    const targetWord = WORDS[currentWordIndex].word;
    
    // Get letters from target word plus some random letters
    const wordLetters = targetWord.split('');
    const randomLetters = ALPHABET
      .filter(l => !wordLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    const allLetters = [...wordLetters, ...randomLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(allLetters);
  };

  const handleLetterPress = (letter: string) => {
    if (userAnswer.length < WORDS[currentWordIndex].word.length) {
      setUserAnswer(prev => [...prev, letter]);
      setAvailableLetters(prev => {
        const index = prev.indexOf(letter);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const handleRemoveLetter = (index: number) => {
    const letter = userAnswer[index];
    setUserAnswer(prev => prev.filter((_, i) => i !== index));
    setAvailableLetters(prev => [...prev, letter]);
  };

  const checkAnswer = () => {
    const answer = userAnswer.join('');
    const correctWord = WORDS[currentWordIndex].word;

    if (answer === correctWord) {
      setScore(prev => prev + 30);
      Alert.alert('✅ Correct!', 'Well done!', [
        {
          text: 'Next Word',
          onPress: () => {
            if (currentWordIndex < WORDS.length - 1) {
              setCurrentWordIndex(prev => prev + 1);
            } else {
              endGame();
            }
          }
        }
      ]);
    } else {
      Alert.alert('❌ Incorrect', `The correct word is: ${correctWord}`, [
        { text: 'Try Again', onPress: initializeRound }
      ]);
    }
  };

  const endGame = () => {
    updateGamePlayed('word-builder', score);
    Alert.alert(
      '🎉 Game Complete!',
      `Final Score: ${score}`,
      [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word Builder</Text>
        <View style={styles.scoreContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.progressText}>Word {currentWordIndex + 1}/{WORDS.length}</Text>
      </View>

      {/* Game Area */}
      <ScrollView contentContainerStyle={styles.gameArea}>
        <Text style={styles.instructions}>Build the word using ISL signs!</Text>

        {/* Hint */}
        <View style={styles.hintBox}>
          <Text style={styles.hintLabel}>Hint:</Text>
          <Text style={styles.hintText}>{WORDS[currentWordIndex].hint}</Text>
        </View>

        {/* Answer Area */}
        <View style={styles.answerArea}>
          <Text style={styles.answerLabel}>Your Answer:</Text>
          <View style={styles.answerBoxes}>
            {Array.from({ length: WORDS[currentWordIndex].word.length }).map((_, index) => (
              <TouchableOpacity
                key={index}
                style={styles.answerBox}
                onPress={() => userAnswer[index] && handleRemoveLetter(index)}
              >
                <Text style={styles.answerLetter}>{userAnswer[index] || '_'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Letters */}
        <View style={styles.lettersArea}>
          <Text style={styles.lettersLabel}>Available Letters:</Text>
          <View style={styles.lettersGrid}>
            {availableLetters.map((letter, index) => (
              <TouchableOpacity
                key={`${letter}-${index}`}
                style={styles.letterButton}
                onPress={() => handleLetterPress(letter)}
              >
                <Text style={styles.letterText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Check Button */}
        <TouchableOpacity
          style={[
            styles.checkButton,
            userAnswer.length !== WORDS[currentWordIndex].word.length && styles.checkButtonDisabled
          ]}
          onPress={checkAnswer}
          disabled={userAnswer.length !== WORDS[currentWordIndex].word.length}
        >
          <CheckCircle size={24} color="#fff" />
          <Text style={styles.checkButtonText}>Check Answer</Text>
        </TouchableOpacity>
      </ScrollView>

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
    alignItems: 'center',
    paddingVertical: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  gameArea: {
    padding: 20,
  },
  instructions: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  hintBox: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  hintLabel: {
    fontSize: 14,
    color: '#84a627',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  answerArea: {
    marginBottom: 32,
  },
  answerLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  answerBoxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  answerBox: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerLetter: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  lettersArea: {
    marginBottom: 24,
  },
  lettersLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  letterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#84a627',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  checkButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: 18,
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
