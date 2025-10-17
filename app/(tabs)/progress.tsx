import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Flame, Star, Trophy, Award, Zap, Crown } from 'lucide-react-native';

interface Badge {
  id: string;
  icon: string;
  name: string;
  color: string;
  earned: boolean;
}

const badges: Badge[] = [
  { id: '1', icon: 'star', name: 'First Sign', color: '#fbbf24', earned: true },
  { id: '2', icon: 'trophy', name: '7 Day Streak', color: '#84a627', earned: true },
  { id: '3', icon: 'award', name: '50 Stars', color: '#8b5cf6', earned: true },
  { id: '4', icon: 'zap', name: 'Speed Master', color: '#f59e0b', earned: false },
  { id: '5', icon: 'crown', name: 'Champion', color: '#ef4444', earned: false },
  { id: '6', icon: 'star', name: '100 Signs', color: '#3b82f6', earned: false },
];

const BadgeIcon = ({ iconName, color, size = 32 }: { iconName: string; color: string; size?: number }) => {
  const iconProps = { size, color, strokeWidth: 2 };

  switch (iconName) {
    case 'star':
      return <Star {...iconProps} fill={color} />;
    case 'trophy':
      return <Trophy {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'crown':
      return <Crown {...iconProps} />;
    default:
      return <Star {...iconProps} />;
  }
};

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Tracker</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.iconCircle}>
                <Flame size={32} color="#f97316" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
                <Star size={32} color="#fbbf24" strokeWidth={2} fill="#fbbf24" />
              </View>
              <Text style={styles.statValue}>247</Text>
              <Text style={styles.statLabel}>Total Stars</Text>
            </View>
          </View>

          <View style={styles.weekStreakContainer}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.weekDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <View style={[
                    styles.dayCircle,
                    index < 5 && styles.dayCircleActive
                  ]}>
                    {index < 5 && (
                      <Star size={16} color="white" strokeWidth={2} fill="white" />
                    )}
                  </View>
                  <Text style={styles.dayLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.badgesGrid}>
              {badges.map((badge) => (
                <TouchableOpacity
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    !badge.earned && styles.badgeCardLocked
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.badgeIconContainer,
                    { backgroundColor: badge.earned ? `${badge.color}20` : '#f3f4f6' }
                  ]}>
                    <BadgeIcon
                      iconName={badge.icon}
                      color={badge.earned ? badge.color : '#9ca3af'}
                      size={32}
                    />
                  </View>
                  <Text style={[
                    styles.badgeName,
                    !badge.earned && styles.badgeNameLocked
                  ]}>
                    {badge.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Trophy size={20} color="#84a627" strokeWidth={2} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Completed Alphabet Match</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Text style={styles.activityStars}>+15 ⭐</Text>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Star size={20} color="#fbbf24" strokeWidth={2} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Practiced 5 new signs</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
              <Text style={styles.activityStars}>+25 ⭐</Text>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Flame size={20} color="#f97316" strokeWidth={2} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>7 Day Streak Achieved!</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
              <Text style={styles.activityStars}>+50 ⭐</Text>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  weekStreakContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#84a627',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  badgesSection: {
    marginBottom: 32,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#9ca3af',
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: '#666',
  },
  activityStars: {
    fontSize: 16,
    fontWeight: '700',
    color: '#84a627',
  },
});
