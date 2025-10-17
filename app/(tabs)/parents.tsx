import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Play, Clock } from 'lucide-react-native';

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
}

const tutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'Getting Started with Sign Language',
    duration: '12 min',
    thumbnail: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Basics',
  },
  {
    id: '2',
    title: 'Teaching Your Child Daily Signs',
    duration: '15 min',
    thumbnail: 'https://images.pexels.com/photos/8612994/pexels-photo-8612994.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Daily Life',
  },
  {
    id: '3',
    title: 'Emotional Expression in Sign Language',
    duration: '10 min',
    thumbnail: 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Emotions',
  },
  {
    id: '4',
    title: 'Fun Activities to Practice Together',
    duration: '18 min',
    thumbnail: 'https://images.pexels.com/photos/8613314/pexels-photo-8613314.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Activities',
  },
];

export default function ParentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parental Learning Hub</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Learn Together</Text>
          <Text style={styles.description}>
            Video tutorials to help you guide your child's sign language journey
          </Text>

          <View style={styles.tutorialsContainer}>
            {tutorials.map((tutorial) => (
              <TouchableOpacity
                key={tutorial.id}
                style={styles.tutorialCard}
                activeOpacity={0.8}
              >
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: tutorial.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <View style={styles.playButton}>
                      <Play size={32} color="white" fill="white" strokeWidth={2} />
                    </View>
                  </View>
                  <View style={styles.durationBadge}>
                    <Clock size={12} color="white" strokeWidth={2} />
                    <Text style={styles.durationText}>{tutorial.duration}</Text>
                  </View>
                </View>
                <View style={styles.tutorialInfo}>
                  <Text style={styles.categoryTag}>{tutorial.category}</Text>
                  <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Quick Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>1</Text>
              </View>
              <Text style={styles.tipText}>
                Practice signs consistently every day for better retention
              </Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>2</Text>
              </View>
              <Text style={styles.tipText}>
                Make learning fun by incorporating signs into games and activities
              </Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>3</Text>
              </View>
              <Text style={styles.tipText}>
                Celebrate small victories to keep your child motivated
              </Text>
            </View>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  tutorialsContainer: {
    gap: 20,
  },
  tutorialCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(132, 166, 39, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tutorialInfo: {
    padding: 16,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#84a627',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    lineHeight: 24,
  },
  tipsSection: {
    marginTop: 32,
  },
  tipsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef9c3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#84a627',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
  },
});
