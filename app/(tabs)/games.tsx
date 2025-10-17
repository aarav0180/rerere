import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, Target, Palette, Hand, Puzzle, Grid3x3 } from 'lucide-react-native';

interface GameCard {
  id: string;
  title: string;
  icon: string;
  color: string;
}

const games: GameCard[] = [
  { id: '1', title: 'Alphabet\nMatch', icon: 'sparkles', color: '#fef9c3' },
  { id: '2', title: 'Number\nChallenge', icon: 'target', color: '#fecaca' },
  { id: '3', title: 'Sign Story Fun', icon: 'palette', color: '#fef9c3' },
  { id: '4', title: 'Daily Word\nSigns', icon: 'hand', color: '#fecaca' },
  { id: '5', title: 'Puzzle Signs', icon: 'puzzle', color: '#fef9c3' },
  { id: '6', title: 'Memory Match', icon: 'grid', color: '#fecaca' },
];

const IconComponent = ({ iconName, color }: { iconName: string; color: string }) => {
  const iconProps = { size: 48, color, strokeWidth: 2 };

  switch (iconName) {
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'target':
      return <Target {...iconProps} />;
    case 'palette':
      return <Palette {...iconProps} />;
    case 'hand':
      return <Hand {...iconProps} />;
    case 'puzzle':
      return <Puzzle {...iconProps} />;
    case 'grid':
      return <Grid3x3 {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export default function GamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Educational Games</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Choose Your Adventure!</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
              <Sparkles size={16} color="white" strokeWidth={2} />
              <Text style={styles.filterButtonText}>Alphabet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]} activeOpacity={0.8}>
              <Text style={styles.filterButtonTextInactive}>Numbers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]} activeOpacity={0.8}>
              <Text style={styles.filterButtonTextInactive}>Words</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.gamesGrid}>
            {games.map((game, index) => (
              <TouchableOpacity
                key={game.id}
                style={[
                  styles.gameCard,
                  { backgroundColor: game.color },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <IconComponent iconName={game.icon} color="#000" />
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#84a627',
    marginBottom: 20,
  },
  filterScroll: {
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#84a627',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  filterButtonInactive: {
    backgroundColor: '#f3f4f6',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  filterButtonTextInactive: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
});
