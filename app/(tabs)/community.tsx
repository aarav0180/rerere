import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Hand } from 'lucide-react-native';

interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  highFives: number;
  timestamp: string;
}

const suggestedFriends: Friend[] = [
  { id: '1', name: 'Lily', avatar: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: '2', name: 'Max', avatar: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { id: '3', name: 'Chloe', avatar: 'https://images.pexels.com/photos/3771854/pexels-photo-3771854.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

const activities: Activity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Lily',
    userAvatar: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'Look! My first signed tree. Can you sign it too?',
    image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
    highFives: 24,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Max',
    userAvatar: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'I built a tall tower today! It was so much fun!',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600',
    highFives: 18,
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Chloe',
    userAvatar: 'https://images.pexels.com/photos/3771854/pexels-photo-3771854.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'This is my favorite teddy! He helps me learn new signs.',
    image: 'https://images.pexels.com/photos/4546122/pexels-photo-4546122.jpeg?auto=compress&cs=tinysrgb&w=600',
    highFives: 32,
    timestamp: '1 day ago',
  },
];

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Feed</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.suggestedSection}>
            <Text style={styles.sectionTitle}>Suggested Friends</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.friendsContainer}
            >
              {suggestedFriends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <Image
                    source={{ uri: friend.avatar }}
                    style={styles.friendAvatar}
                    resizeMode="cover"
                  />
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <TouchableOpacity style={styles.connectButton} activeOpacity={0.8}>
                    <Text style={styles.connectButtonText}>Connect</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Today's Activities</Text>
            {activities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Image
                    source={{ uri: activity.userAvatar }}
                    style={styles.activityAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.activityUserInfo}>
                    <Text style={styles.activityUserName}>{activity.userName}</Text>
                    <Text style={styles.activityTime}>{activity.timestamp}</Text>
                  </View>
                </View>

                {activity.image && (
                  <Image
                    source={{ uri: activity.image }}
                    style={styles.activityImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.content}</Text>

                  <TouchableOpacity style={styles.highFiveButton} activeOpacity={0.8}>
                    <Hand size={18} color="#666" strokeWidth={2} />
                    <Text style={styles.highFiveText}>High-Five</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    paddingBottom: 40,
  },
  suggestedSection: {
    marginBottom: 32,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  friendsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 24,
  },
  friendCard: {
    alignItems: 'center',
    width: 100,
  },
  friendAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  connectButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  connectButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  activitiesSection: {
    paddingHorizontal: 24,
  },
  activityCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  activityAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
  },
  activityUserInfo: {
    flex: 1,
  },
  activityUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: '#666',
  },
  activityImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#e5e7eb',
  },
  activityContent: {
    padding: 16,
  },
  activityText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
    marginBottom: 12,
  },
  highFiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  highFiveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});
