import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Trophy, Target, Flame, Star, Award, TrendingUp, Calendar, Zap } from 'lucide-react-native';
import { useProgress } from '../../contexts/ProgressContext';

export default function ProgressScreen() {
  const { progress, resetProgress } = useProgress();

  const getNextLevelXP = () => {
    return progress.level * 100;
  };

  const getCurrentLevelXP = () => {
    return progress.xp % 100;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Level and XP Card */}
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <Star size={32} color="#FFD700" fill="#FFD700" />
                <Text style={styles.levelNumber}>Level {progress.level}</Text>
              </View>
              <Text style={styles.xpText}>{getCurrentLevelXP()} / {getNextLevelXP()} XP</Text>
            </View>
            <View style={styles.xpBar}>
              <View style={[styles.xpBarFill, { width: `${(getCurrentLevelXP() / getNextLevelXP()) * 100}%` }]} />
            </View>
          </View>

          {/* Overall Progress */}
          <View style={styles.progressCard}>
            <Text style={styles.cardTitle}>Overall Progress</Text>
            <View style={styles.circularProgress}>
              <Text style={styles.progressPercentage}>{progress.totalProgress}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${progress.totalProgress}%` }]} />
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.streakCard}>
            <Flame size={40} color="#FF6B35" fill="#FF6B35" />
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{progress.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{progress.longestStreak}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
          </View>

          {/* Activity Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Activity Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Trophy size={24} color="#2196F3" />
                </View>
                <Text style={styles.statNumber}>{progress.gamesPlayed}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Target size={24} color="#9C27B0" />
                </View>
                <Text style={styles.statNumber}>{progress.videosWatched}</Text>
                <Text style={styles.statLabel}>Videos Watched</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Zap size={24} color="#4CAF50" />
                </View>
                <Text style={styles.statNumber}>{progress.practiceAttempts}</Text>
                <Text style={styles.statLabel}>Practice Sessions</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                  <TrendingUp size={24} color="#FF9800" />
                </View>
                <Text style={styles.statNumber}>{progress.aiRecognitionAttempts}</Text>
                <Text style={styles.statLabel}>AI Recognition</Text>
              </View>
            </View>
          </View>

          {/* Game Stats */}
          <View style={styles.gameStatsSection}>
            <Text style={styles.sectionTitle}>Game Performance</Text>
            
            <View style={styles.gameStatCard}>
              <Text style={styles.gameStatTitle}>🥷 Sign Ninja</Text>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>High Score:</Text>
                <Text style={styles.gameStatValue}>{progress.signNinjaHighScore}</Text>
              </View>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>Times Played:</Text>
                <Text style={styles.gameStatValue}>{progress.signNinjaPlays}</Text>
              </View>
            </View>

            <View style={styles.gameStatCard}>
              <Text style={styles.gameStatTitle}>✨ Alphabet Match</Text>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>High Score:</Text>
                <Text style={styles.gameStatValue}>{progress.alphabetMatchHighScore}</Text>
              </View>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>Times Played:</Text>
                <Text style={styles.gameStatValue}>{progress.alphabetMatchPlays}</Text>
              </View>
            </View>

            <View style={styles.gameStatCard}>
              <Text style={styles.gameStatTitle}>🎯 Number Challenge</Text>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>High Score:</Text>
                <Text style={styles.gameStatValue}>{progress.numberChallengeHighScore}</Text>
              </View>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>Times Played:</Text>
                <Text style={styles.gameStatValue}>{progress.numberChallengePlays}</Text>
              </View>
            </View>

            <View style={styles.gameStatCard}>
              <Text style={styles.gameStatTitle}>🎴 Memory Match</Text>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>High Score:</Text>
                <Text style={styles.gameStatValue}>{progress.memoryMatchHighScore}</Text>
              </View>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>Times Played:</Text>
                <Text style={styles.gameStatValue}>{progress.memoryMatchPlays}</Text>
              </View>
            </View>

            <View style={styles.gameStatCard}>
              <Text style={styles.gameStatTitle}>🧩 Word Builder</Text>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>High Score:</Text>
                <Text style={styles.gameStatValue}>{progress.wordBuilderHighScore}</Text>
              </View>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>Times Played:</Text>
                <Text style={styles.gameStatValue}>{progress.wordBuilderPlays}</Text>
              </View>
            </View>

            <View style={styles.gameStatCard}>
              <Text style={styles.gameStatTitle}>⚡ Speed Signs</Text>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>High Score:</Text>
                <Text style={styles.gameStatValue}>{progress.speedSignsHighScore}</Text>
              </View>
              <View style={styles.gameStatRow}>
                <Text style={styles.gameStatLabel}>Times Played:</Text>
                <Text style={styles.gameStatValue}>{progress.speedSignsPlays}</Text>
              </View>
            </View>
          </View>

          {/* Milestones */}
          <View style={styles.milestonesSection}>
            <Text style={styles.sectionTitle}>Learning Milestones</Text>
            
            <View style={styles.milestoneCard}>
              <Award size={20} color={progress.alphabetMastered ? '#4CAF50' : '#9E9E9E'} />
              <Text style={[styles.milestoneText, progress.alphabetMastered && styles.milestoneComplete]}>
                ISL Alphabet Mastered
              </Text>
              {progress.alphabetMastered && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <View style={styles.milestoneCard}>
              <Award size={20} color={progress.numbersMastered ? '#4CAF50' : '#9E9E9E'} />
              <Text style={[styles.milestoneText, progress.numbersMastered && styles.milestoneComplete]}>
                Numbers 1-10 Mastered
              </Text>
              {progress.numbersMastered && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <View style={styles.milestoneCard}>
              <Award size={20} color={progress.basicWordsMastered ? '#4CAF50' : '#9E9E9E'} />
              <Text style={[styles.milestoneText, progress.basicWordsMastered && styles.milestoneComplete]}>
                Basic Words Mastered
              </Text>
              {progress.basicWordsMastered && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>

          {/* Reset Button (for testing) */}
          <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
            <Text style={styles.resetButtonText}>Reset Progress (Debug)</Text>
          </TouchableOpacity>
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
  
  // Level Card
  levelCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  xpBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  
  // Progress Card
  progressCard: {
    backgroundColor: '#84a627',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  circularProgress: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressPercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  progressLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  
  // Streak Card
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B35',
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  
  // Stats Section
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Game Stats
  gameStatsSection: {
    marginBottom: 24,
  },
  gameStatCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  gameStatTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  gameStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gameStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  gameStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  // Milestones
  milestonesSection: {
    marginBottom: 24,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  milestoneText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  milestoneComplete: {
    color: '#000',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
  },
  
  // Reset Button
  resetButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
