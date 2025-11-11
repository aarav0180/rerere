import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const loadImage = (letter: string) => {
  try {
    switch (letter) {
      case 'A': return require('../../assets/images/A.jpeg');
      case 'B': return require('../../assets/images/B.jpeg');
      case 'C': return require('../../assets/images/C.jpeg');
      case 'D': return require('../../assets/images/D.jpeg');
      case 'E': return require('../../assets/images/E.jpeg');
      case 'F': return require('../../assets/images/F.jpeg');
      case 'G': return require('../../assets/images/G.jpeg');
      case 'H': return require('../../assets/images/H.jpeg');
      case 'I': return require('../../assets/images/I.jpeg');
      case 'J': return require('../../assets/images/J.jpeg');
      case 'K': return require('../../assets/images/K.jpeg');
      case 'L': return require('../../assets/images/L.jpeg');
      case 'M': return require('../../assets/images/M.jpeg');
      case 'N': return require('../../assets/images/N.jpeg');
      case 'O': return require('../../assets/images/O.jpeg');
      case 'P': return require('../../assets/images/P.jpeg');
      case 'Q': return require('../../assets/images/Q.jpeg');
      case 'R': return require('../../assets/images/R.jpeg');
      case 'S': return require('../../assets/images/S.jpeg');
      case 'T': return require('../../assets/images/T.jpeg');
      case 'U': return require('../../assets/images/U.jpeg');
      case 'V': return require('../../assets/images/V.jpeg');
      case 'W': return require('../../assets/images/W.jpeg');
      case 'X': return require('../../assets/images/X.jpeg');
      case 'Y': return require('../../assets/images/Y.jpeg');
      case 'Z': return require('../../assets/images/Z.jpeg');
      default: return null;
    }
  } catch {
    return null;
  }
};

export default function AlphabetMatchGame() {
  const router = useRouter();
  const { updateGamePlayed } = useProgress();
  
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateRound();
  }, []);

  const generateRound = () => {
    const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setCurrentLetter(letter);

    // Generate 3 wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      if (randomLetter !== letter && !wrongOptions.includes(randomLetter)) {
        wrongOptions.push(randomLetter);
      }
    }

    // Mix correct answer with wrong options
    const allOptions = [...wrongOptions, letter].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (selectedLetter: string) => {
    if (selectedLetter === currentLetter) {
      // Correct answer
      setScore(prev => prev + 10);
      setRound(prev => prev + 1);
      
      if (round >= 10) {
        endGame(true);
      } else {
        generateRound();
      }
    } else {
      // Wrong answer
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          endGame(false);
        } else {
          generateRound();
        }
        return newLives;
      });
    }
  };

  const endGame = (completed: boolean) => {
    setGameOver(true);
    updateGamePlayed('alphabet-match', score);
    
    Alert.alert(
      completed ? '🎉 Congratulations!' : '💔 Game Over',
      `Your Score: ${score}\nRounds Completed: ${round - 1}/10`,
      [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setLives(3);
    setGameOver(false);
    generateRound();
  };

  const imageSource = loadImage(currentLetter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alphabet Match</Text>
        <View style={styles.scoreContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.roundText}>Round {round}/10</Text>
        <View style={styles.livesContainer}>
          {Array.from({ length: lives }).map((_, i) => (
            <Text key={i} style={styles.heart}>❤️</Text>
          ))}
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <Text style={styles.questionText}>Which letter is this ISL sign?</Text>
        
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

        {/* Options */}
        <View style={styles.optionsGrid}>
          {options.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={styles.optionButton}
              onPress={() => !gameOver && handleAnswer(letter)}
              disabled={gameOver}
            >
              <Text style={styles.optionText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Restart Button */}
      <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
        <RotateCcw size={20} color="#fff" />
        <Text style={styles.restartText}>Restart Game</Text>
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
  livesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  heart: {
    fontSize: 24,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  optionButton: {
    width: (SCREEN_WIDTH - 80) / 2 - 8,
    paddingVertical: 20,
    backgroundColor: '#84a627',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  optionText: {
    fontSize: 32,
    fontWeight: '700',
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
