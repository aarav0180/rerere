import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_WIDTH - 60) / 4 - 8;

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const loadImage = (letter: string) => {
  try {
    const images: { [key: string]: any } = {
      A: require('../../assets/images/A.jpeg'),
      B: require('../../assets/images/B.jpeg'),
      C: require('../../assets/images/C.jpeg'),
      D: require('../../assets/images/D.jpeg'),
      E: require('../../assets/images/E.jpeg'),
      F: require('../../assets/images/F.jpeg'),
      G: require('../../assets/images/G.jpeg'),
      H: require('../../assets/images/H.jpeg'),
    };
    return images[letter];
  } catch {
    return null;
  }
};

interface Card {
  id: number;
  letter: string;
  type: 'sign' | 'text';
  matched: boolean;
  flipped: boolean;
}

export default function MemoryMatchGame() {
  const router = useRouter();
  const { updateGamePlayed } = useProgress();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      checkMatch();
    }
  }, [flippedCards]);

  const initializeGame = () => {
    const gameCards: Card[] = [];
    let id = 0;

    LETTERS.forEach(letter => {
      gameCards.push({
        id: id++,
        letter,
        type: 'sign',
        matched: false,
        flipped: false,
      });
      gameCards.push({
        id: id++,
        letter,
        type: 'text',
        matched: false,
        flipped: false,
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
  };

  const handleCardPress = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.matched || flippedCards.includes(cardId)) return;

    setFlippedCards(prev => [...prev, cardId]);
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, flipped: true } : c
      )
    );
  };

  const checkMatch = () => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    setMoves(prev => prev + 1);

    if (firstCard && secondCard && firstCard.letter === secondCard.letter) {
      // Match found
      setCards(prevCards =>
        prevCards.map(c =>
          c.id === firstId || c.id === secondId
            ? { ...c, matched: true }
            : c
        )
      );
      setScore(prev => prev + 20);
      setMatches(prev => {
        const newMatches = prev + 1;
        if (newMatches === LETTERS.length) {
          setTimeout(() => endGame(), 500);
        }
        return newMatches;
      });
      setFlippedCards([]);
    } else {
      // No match
      setTimeout(() => {
        setCards(prevCards =>
          prevCards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, flipped: false }
              : c
          )
        );
        setFlippedCards([]);
      }, 1000);
    }
  };

  const endGame = () => {
    updateGamePlayed('memory-match', score);
    Alert.alert(
      '🎉 Congratulations!',
      `You completed the game!\nScore: ${score}\nMoves: ${moves}`,
      [
        { text: 'Play Again', onPress: initializeGame },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Match</Text>
        <View style={styles.scoreContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <Text style={styles.infoText}>Moves: {moves}</Text>
        <Text style={styles.infoText}>Matches: {matches}/{LETTERS.length}</Text>
      </View>

      {/* Instructions */}
      <Text style={styles.instructions}>Match ISL signs with their letters!</Text>

      {/* Cards Grid */}
      <View style={styles.cardsGrid}>
        {cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { width: CARD_SIZE, height: CARD_SIZE },
              card.matched && styles.cardMatched,
            ]}
            onPress={() => handleCardPress(card.id)}
            disabled={card.matched}
          >
            {card.flipped || card.matched ? (
              card.type === 'sign' ? (
                <Image
                  source={loadImage(card.letter)}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.cardLetter}>{card.letter}</Text>
              )
            ) : (
              <View style={styles.cardBack}>
                <Text style={styles.cardBackText}>?</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Restart Button */}
      <TouchableOpacity style={styles.restartButton} onPress={initializeGame}>
        <RotateCcw size={20} color="#fff" />
        <Text style={styles.restartText}>New Game</Text>
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
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardMatched: {
    opacity: 0.5,
  },
  cardImage: {
    width: '90%',
    height: '90%',
  },
  cardLetter: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
  },
  cardBack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#84a627',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackText: {
    fontSize: 48,
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
    marginTop: 20,
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
