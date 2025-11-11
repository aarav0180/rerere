import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import SignNinjaGame from '../../components/games/SignNinja/SignNinjaGame';
import { useProgress } from '../../contexts/ProgressContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// TensorFlow.js initialization logs are expected behavior
// Currently using tap-based controls instead of gesture recognition
// To disable TensorFlow logs, remove any ML model imports or suppress console warnings

export default function SignNinjaScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const { updateGamePlayed } = useProgress();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Suppress TensorFlow warnings if needed
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    console.warn = (...args) => {
      if (args[0]?.includes?.('Could not load model')) return;
      originalWarn(...args);
    };
    
    console.log = (...args) => {
      if (args[0]?.includes?.('TensorFlow') || args[0]?.includes?.('Loading model')) return;
      originalLog(...args);
    };

    return () => {
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);

  const handleStartGame = () => {
    if (hasPermission) {
      setShowInstructions(false);
      setGameStarted(true);
      setScore(0);
    } else {
      Alert.alert('Camera Permission Required', 'Please grant camera permission to play Sign Ninja.');
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setIsPaused(false);
    setScore(0);
    setShowInstructions(true);
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  const handleGameOver = (finalScore: number) => {
    // Update progress when game ends
    updateGamePlayed('sign-ninja', finalScore);
    
    Alert.alert(
      'Game Over!',
      `Your final score: ${finalScore}`,
      [
        { text: 'Play Again', onPress: handleRestart },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission denied</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Ninja 🥷</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
      </View>

      {/* Instructions Overlay */}
      {showInstructions && !gameStarted && (
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>How to Play</Text>
            <Text style={styles.instructionsText}>
              • Letters will fall from the top of the screen{'\n'}
              • Make the correct ISL hand sign for each letter{'\n'}
              • Your hand gesture will "slice" the letter{'\n'}
              • Score points for each correct sign{'\n'}
              • Game ends after 3 missed letters
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
              <Play size={24} color="#fff" />
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Game Area */}
      {gameStarted && (
        <SignNinjaGame
          isPaused={isPaused}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
        />
      )}

      {/* Game Controls */}
      {gameStarted && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePauseResume}>
            {isPaused ? (
              <Play size={28} color="#fff" />
            ) : (
              <Pause size={28} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleRestart}>
            <RotateCcw size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
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
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  scoreContainer: {
    backgroundColor: '#84a627',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  instructionsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  instructionsBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: SCREEN_WIDTH * 0.85,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 28,
    marginBottom: 30,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#84a627',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(132, 166, 39, 0.9)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#84a627',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
