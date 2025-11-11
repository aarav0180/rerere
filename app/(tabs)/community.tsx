import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, FlatList, Animated, Alert } from 'react-native';
import { Heart, MessageCircle, Share2, Send, Users, BookOpen, HelpCircle, Award, Plus, Search, Filter, TrendingUp, Video, Calendar, Bell } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useCommunity } from '../../contexts/CommunityContext';

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  category: 'story' | 'question' | 'achievement' | 'tip' | 'event';
  verified?: boolean;
  trending?: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

const communityPosts: Post[] = [
  {
    id: '1',
    author: 'Priya Sharma',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=84a627&color=fff',
    time: '2 hours ago',
    content: 'My 5-year-old daughter just signed "I love you" for the first time! 😭❤️ All those practice sessions with ISL videos are finally paying off. Never give up parents!',
    likes: 124,
    comments: 18,
    shares: 12,
    category: 'story',
    trending: true,
  },
  {
    id: '2',
    author: 'Dr. Rajesh Kumar',
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2196F3&color=fff',
    time: '5 hours ago',
    content: 'Question: How do I explain abstract concepts like "tomorrow" or "later" in ISL to my 4-year-old? Any tips from experienced parents?',
    likes: 45,
    comments: 23,
    shares: 5,
    category: 'question',
    verified: true,
  },
  {
    id: '3',
    author: 'Anita Desai',
    avatar: 'https://ui-avatars.com/api/?name=Anita+Desai&background=9C27B0&color=fff',
    time: '1 day ago',
    content: '🎉 Achievement Unlocked! My son scored 100% in his ISL test at school. So proud! Remember, consistency is key. We practiced 30 minutes daily for 6 months.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    likes: 256,
    comments: 42,
    shares: 34,
    category: 'achievement',
    trending: true,
  },
  {
    id: '4',
    author: 'Vikram Singh',
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=FF9800&color=fff',
    time: '2 days ago',
    content: 'Pro tip: Use meal times to practice food-related signs. My kids learned 20+ signs just during breakfast and dinner conversations! Make learning natural and fun. 🍎🥗',
    likes: 189,
    comments: 31,
    shares: 56,
    category: 'tip',
  },
  {
    id: '5',
    author: 'ISL Community India',
    avatar: 'https://ui-avatars.com/api/?name=ISL+Community&background=4CAF50&color=fff',
    time: '3 days ago',
    content: '📅 Upcoming Event: Virtual ISL Workshop for Parents on Saturday, 3 PM IST. Join 500+ parents learning together! Free registration. Limited spots available.',
    likes: 412,
    comments: 89,
    shares: 145,
    category: 'event',
    verified: true,
    trending: true,
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Virtual ISL Workshop',
    date: 'Saturday, 3 PM IST',
    attendees: 234,
    type: 'online',
  },
  {
    id: '2',
    title: 'Parent Support Group Meet',
    date: 'Sunday, 10 AM IST',
    attendees: 89,
    type: 'hybrid',
  },
];

const featuredExperts = [
  {
    id: '1',
    name: 'Dr. Meera Patel',
    role: 'ISL Educator',
    followers: '12.5K',
    avatar: 'https://ui-avatars.com/api/?name=Meera+Patel&background=4CAF50&color=fff',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    role: 'Deaf Advocate',
    followers: '8.3K',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=2196F3&color=fff',
  },
];

export default function CommunityScreen() {
  const {
    posts: communityPosts,
    addPost,
    likePost,
    addComment: addCommentToPost,
    sharePost,
    isPostLiked,
    refreshPosts,
  } = useCommunity();

  const [newPostModal, setNewPostModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'story' | 'question' | 'achievement' | 'tip' | 'event'>('story');
  const [newComment, setNewComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | any>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Refresh time stamps when component mounts
    refreshPosts();
  }, []);

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleShare = async (post: any) => {
    await sharePost(post.id);
    Alert.alert('Shared!', 'Post has been shared with the community');
  };

  const openComments = (post: any) => {
    setSelectedPost(post);
    setCommentsModal(true);
  };

  const handleAddPost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please write something before posting');
      return;
    }

    await addPost(newPostContent, newPostCategory);
    setNewPostModal(false);
    setNewPostContent('');
    Alert.alert('Posted!', 'Your post has been shared with the community 🎉');
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    await addCommentToPost(selectedPost.id, newComment);
    setNewComment('');
    
    // Refresh selected post to show new comment
    const updatedPost = communityPosts.find(p => p.id === selectedPost.id);
    if (updatedPost) {
      setSelectedPost(updatedPost);
    }
  };

  const getCategoryIcon = (category: Post['category']) => {
    switch (category) {
      case 'story': return <Heart size={16} color="#FF6B6B" />;
      case 'question': return <HelpCircle size={16} color="#2196F3" />;
      case 'achievement': return <Award size={16} color="#FFD700" />;
      case 'tip': return <BookOpen size={16} color="#4CAF50" />;
      case 'event': return <Calendar size={16} color="#9C27B0" />;
    }
  };

  const getCategoryColor = (category: Post['category']) => {
    switch (category) {
      case 'story': return '#FFE5E5';
      case 'question': return '#E3F2FD';
      case 'achievement': return '#FFF9E6';
      case 'tip': return '#E8F5E9';
      case 'event': return '#F3E5F5';
    }
  };

  const filteredPosts = communityPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [280, 180],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { height: headerHeight }]}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>ISL Community</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={24} color="#000" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats
        <View style={styles.quickStats}>
          <View style={styles.statBox}>
            <TrendingUp size={20} color="#84a627" />
            <Text style={styles.statNumber}>1.2K+</Text>
            <Text style={styles.statLabel}>Active Members</Text>
          </View>
          <View style={styles.statBox}>
            <Video size={20} color="#2196F3" />
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Live Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Award size={20} color="#FFD700" />
            <Text style={styles.statNumber}>200+</Text>
            <Text style={styles.statLabel}>Success Stories</Text>
          </View>
        </View> */}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search posts, people..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextActive]}>
            All Posts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'story' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('story')}
        >
          <Heart size={14} color={selectedCategory === 'story' ? '#fff' : '#666'} />
          <Text style={[styles.filterChipText, selectedCategory === 'story' && styles.filterChipTextActive]}>
            Stories
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'question' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('question')}
        >
          <HelpCircle size={14} color={selectedCategory === 'question' ? '#fff' : '#666'} />
          <Text style={[styles.filterChipText, selectedCategory === 'question' && styles.filterChipTextActive]}>
            Q&A
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'achievement' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('achievement')}
        >
          <Award size={14} color={selectedCategory === 'achievement' ? '#fff' : '#666'} />
          <Text style={[styles.filterChipText, selectedCategory === 'achievement' && styles.filterChipTextActive]}>
            Wins
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'tip' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('tip')}
        >
          <BookOpen size={14} color={selectedCategory === 'tip' ? '#fff' : '#666'} />
          <Text style={[styles.filterChipText, selectedCategory === 'tip' && styles.filterChipTextActive]}>
            Tips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'event' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('event')}
        >
          <Calendar size={14} color={selectedCategory === 'event' ? '#fff' : '#666'} />
          <Text style={[styles.filterChipText, selectedCategory === 'event' && styles.filterChipTextActive]}>
            Events
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Posts Feed */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Upcoming Events Section */}
        {selectedCategory === 'all' || selectedCategory === 'event' ? (
          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>📅 Upcoming Events</Text>
            {upcomingEvents.map(event => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <Calendar size={24} color="#9C27B0" />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <View style={styles.eventMeta}>
                    <Users size={14} color="#666" />
                    <Text style={styles.eventAttendees}>{event.attendees} attending</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.eventButton}>
                  <Text style={styles.eventButtonText}>Join</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {/* Featured Experts */}
        {selectedCategory === 'all' ? (
          <View style={styles.expertsSection}>
            <Text style={styles.sectionTitle}>⭐ Featured Experts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredExperts.map(expert => (
                <TouchableOpacity key={expert.id} style={styles.expertCard}>
                  <Image source={{ uri: expert.avatar }} style={styles.expertAvatar} />
                  <Text style={styles.expertName}>{expert.name}</Text>
                  <Text style={styles.expertRole}>{expert.role}</Text>
                  <Text style={styles.expertFollowers}>{expert.followers} followers</Text>
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Posts */}
        <View style={styles.postsContainer}>
          <Text style={styles.sectionTitle}>📱 Community Feed</Text>
          {filteredPosts.map(post => (
            <View key={post.id} style={styles.postCard}>
              {/* Trending Badge */}
              {post.trending && (
                <View style={styles.trendingBadge}>
                  <TrendingUp size={14} color="#FF6B6B" />
                  <Text style={styles.trendingText}>Trending</Text>
                </View>
              )}

              {/* Post Header */}
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                <View style={styles.postHeaderInfo}>
                  <View style={styles.authorRow}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    {post.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                  {getCategoryIcon(post.category)}
                </View>
              </View>

              {/* Post Content */}
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Post Image */}
              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              )}

              {/* Engagement Stats */}
              <View style={styles.engagementStats}>
                <Text style={styles.engagementText}>
                  {post.likes} likes
                </Text>
                <Text style={styles.engagementText}>
                  {post.comments.length} comments • {post.shares} shares
                </Text>
              </View>

              {/* Post Actions */}
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <Heart
                    size={20}
                    color={isPostLiked(post.id) ? '#FF6B6B' : '#666'}
                    fill={isPostLiked(post.id) ? '#FF6B6B' : 'none'}
                  />
                  <Text style={[styles.actionText, isPostLiked(post.id) && styles.actionTextActive]}>
                    Like
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openComments(post)}
                >
                  <MessageCircle size={20} color="#666" />
                  <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleShare(post)}
                >
                  <Share2 size={20} color="#666" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Community Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>💡 Community Guidelines</Text>
          <Text style={styles.guidelinesText}>
            • Be respectful and supportive{'\n'}
            • Share your experiences to help others{'\n'}
            • Ask questions - there are no silly questions{'\n'}
            • Celebrate every small achievement{'\n'}
            • Keep content relevant to ISL learning{'\n'}
            • Report inappropriate content
          </Text>
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setNewPostModal(true)}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* New Post Modal */}
      <Modal
        visible={newPostModal}
        animationType="slide"
        transparent
        onRequestClose={() => setNewPostModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share with Community</Text>
            
            {/* Category Selection */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
              <TouchableOpacity
                style={[styles.categoryOption, newPostCategory === 'story' && styles.categoryOptionActive]}
                onPress={() => setNewPostCategory('story')}
              >
                <Heart size={20} color={newPostCategory === 'story' ? '#fff' : '#FF6B6B'} />
                <Text style={[styles.categoryOptionText, newPostCategory === 'story' && styles.categoryOptionTextActive]}>Story</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryOption, newPostCategory === 'question' && styles.categoryOptionActive]}
                onPress={() => setNewPostCategory('question')}
              >
                <HelpCircle size={20} color={newPostCategory === 'question' ? '#fff' : '#2196F3'} />
                <Text style={[styles.categoryOptionText, newPostCategory === 'question' && styles.categoryOptionTextActive]}>Question</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryOption, newPostCategory === 'achievement' && styles.categoryOptionActive]}
                onPress={() => setNewPostCategory('achievement')}
              >
                <Award size={20} color={newPostCategory === 'achievement' ? '#fff' : '#FFD700'} />
                <Text style={[styles.categoryOptionText, newPostCategory === 'achievement' && styles.categoryOptionTextActive]}>Achievement</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryOption, newPostCategory === 'tip' && styles.categoryOptionActive]}
                onPress={() => setNewPostCategory('tip')}
              >
                <BookOpen size={20} color={newPostCategory === 'tip' ? '#fff' : '#4CAF50'} />
                <Text style={[styles.categoryOptionText, newPostCategory === 'tip' && styles.categoryOptionTextActive]}>Tip</Text>
              </TouchableOpacity>
            </ScrollView>

            <TextInput
              style={styles.postInput}
              placeholder="Share your story, ask a question, or give a tip..."
              multiline
              numberOfLines={6}
              value={newPostContent}
              onChangeText={setNewPostContent}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setNewPostModal(false);
                  setNewPostContent('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalButtonPost}
                onPress={handleAddPost}
              >
                <Send size={18} color="#fff" />
                <Text style={styles.modalButtonPostText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={commentsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.commentsHeader}>
              <Text style={styles.modalTitle}>Comments ({selectedPost?.comments?.length || 0})</Text>
              <TouchableOpacity onPress={() => setCommentsModal(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {selectedPost?.comments?.map((comment: any) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image
                    source={{ uri: comment.avatar }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                </View>
              ))}
              
              {(!selectedPost?.comments || selectedPost.comments.length === 0) && (
                <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
              )}
            </ScrollView>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                style={styles.sendCommentButton}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send size={20} color={newComment.trim() ? '#84a627' : '#ccc'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  animatedHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 0,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    maxHeight: 40,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    height: 35,
  },
  filterChipActive: {
    backgroundColor: '#84a627',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  eventsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventAttendees: {
    fontSize: 12,
    color: '#666',
  },
  eventButton: {
    backgroundColor: '#84a627',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  eventButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  expertsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  expertCard: {
    width: 140,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  expertAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  expertName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  expertRole: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  expertFollowers: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
  },
  followButton: {
    backgroundColor: '#84a627',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  postsContainer: {
    padding: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  verifiedBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  engagementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  engagementText: {
    fontSize: 13,
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  actionTextActive: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  guidelinesCard: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    marginBottom: 100,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#84a627',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  categorySelector: {
    marginBottom: 10,
    maxHeight: 36,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    height: 28,
  },
  categoryOptionActive: {
    backgroundColor: '#84a627',
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryOptionTextActive: {
    color: '#fff',
  },
  postInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    minHeight: 150,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonPost: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#84a627',
  },
  modalButtonPostText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 16,
    color: '#84a627',
    fontWeight: '600',
  },
  commentsList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendCommentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 40,
    fontStyle: 'italic',
  },
});
