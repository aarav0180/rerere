import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions, Alert, Linking } from 'react-native';
import { Play, Clock, X, ExternalLink } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { useState } from 'react';

const { width: screenWidth } = Dimensions.get('window');

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
  youtubeId: string;
  description: string;
}

const tutorials: VideoTutorial[] = [
  // Module 1: Motivation & Awareness
  {
    id: '5',
    title: 'Importance of ISL in Educating Deaf Children',
    duration: '8 min',
    thumbnail: 'https://img.youtube.com/vi/9B1nE62sBes/maxresdefault.jpg',
    category: 'Motivation',
    youtubeId: '9B1nE62sBes',
    description: 'Understanding why early sign language access is crucial for deaf children\'s development and communication.'
  },
  
  // Module 2: Basics (Alphabet & Basic Words)
  {
    id: '1',
    title: 'Indian Sign Language 101 - Alphabet',
    duration: '15 min',
    thumbnail: 'https://img.youtube.com/vi/qcdivQfA41Y/maxresdefault.jpg',
    category: 'Alphabet',
    youtubeId: 'qcdivQfA41Y',
    description: 'Learn the complete ISL alphabet - the foundation for fingerspelling and sign recognition.'
  },
  {
    id: '2',
    title: 'Basic Words in ISL - Everyday Vocabulary',
    duration: '12 min',
    thumbnail: 'https://img.youtube.com/vi/VtbYvVDItvg/maxresdefault.jpg',
    category: 'Basic Words',
    youtubeId: 'VtbYvVDItvg',
    description: 'Essential everyday vocabulary to start communicating with your deaf child in ISL.'
  },
  
  // Module 3: Everyday Communication
  {
    id: '3',
    title: 'Basic Phrases in ISL - Common Sentences',
    duration: '18 min',
    thumbnail: 'https://img.youtube.com/vi/gtEjG8cLMro/maxresdefault.jpg',
    category: 'Phrases',
    youtubeId: 'gtEjG8cLMro',
    description: 'Learn simple conversational sentences like introductions and common greetings in ISL.'
  },
  {
    id: '4',
    title: 'Action Words & Verbs in ISL',
    duration: '14 min',
    thumbnail: 'https://img.youtube.com/vi/HFUcDBSKtqo/maxresdefault.jpg',
    category: 'Action Words',
    youtubeId: 'HFUcDBSKtqo',
    description: 'Master action signs for daily routines - run, eat, see, play, and more essential verbs.'
  },
  
  // Additional ISL Resources
  {
    id: '6',
    title: 'ISL Numbers and Counting',
    duration: '10 min',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Placeholder - replace with actual ISL numbers video
    category: 'Numbers',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder - replace with actual video ID
    description: 'Learn to sign numbers 1-100 and basic mathematical concepts in Indian Sign Language.'
  },
  {
    id: '7',
    title: 'Family Members in ISL',
    duration: '8 min',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Placeholder
    category: 'Family',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    description: 'Signs for family relationships - mother, father, brother, sister, grandparents, and more.'
  },
  {
    id: '8',
    title: 'Colors in Indian Sign Language',
    duration: '6 min',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Placeholder
    category: 'Colors',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    description: 'Learn to sign all basic colors and use them in everyday conversations with your child.'
  },
  {
    id: '9',
    title: 'Emotions and Feelings in ISL',
    duration: '12 min',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Placeholder
    category: 'Emotions',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    description: 'Express and recognize emotions - happy, sad, angry, excited, tired, and other feelings.'
  },
  {
    id: '10',
    title: 'Daily Routine Signs in ISL',
    duration: '16 min',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Placeholder
    category: 'Daily Life',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    description: 'Signs for daily activities - wake up, brush teeth, eat breakfast, go to school, and bedtime routines.'
  }
];

export default function ParentsScreen() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [useDirectLink, setUseDirectLink] = useState(false);

  const handleVideoPress = (tutorial: VideoTutorial) => {
    // For better reliability, ask user's preference
    Alert.alert(
      'Watch Video',
      'How would you like to watch this ISL tutorial?',
      [
        {
          text: 'In App',
          onPress: () => {
            setSelectedVideo(tutorial);
            setUseDirectLink(false);
            setVideoModalVisible(true);
          }
        },
        {
          text: 'YouTube App',
          onPress: () => openInYouTube(tutorial.youtubeId)
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
  };

  const openInYouTube = async (youtubeId: string) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const youtubeAppUrl = `youtube://watch?v=${youtubeId}`;
    
    try {
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        await Linking.openURL(youtubeUrl);
      }
      closeVideoModal();
    } catch (error) {
      Alert.alert('Error', 'Unable to open video. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ISL Learning Hub for Parents</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Master Indian Sign Language</Text>
          <Text style={styles.description}>
            Comprehensive ISL video tutorials to help you communicate effectively with your deaf child
          </Text>

          {/* Learning Modules Section */}
          <View style={styles.moduleSection}>
            <Text style={styles.moduleTitle}>📚 Learning Modules</Text>
            
            <View style={styles.tutorialsContainer}>
              {tutorials.map((tutorial) => (
                <TouchableOpacity
                  key={tutorial.id}
                  style={styles.tutorialCard}
                  activeOpacity={0.8}
                  onPress={() => handleVideoPress(tutorial)}
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
                    <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Video Modal */}
          <Modal
            visible={videoModalVisible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={closeVideoModal}
          >
            <View style={styles.videoModalContainer}>
              <View style={styles.videoHeader}>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={closeVideoModal}
                >
                  <X size={24} color="#333" strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.videoModalTitle}>
                  {selectedVideo?.title || ''}
                </Text>
                <TouchableOpacity 
                  style={styles.youtubeButton}
                  onPress={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                >
                  <ExternalLink size={20} color="#FF0000" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              
              {selectedVideo && (
                <View style={styles.videoContainer}>
                  <WebView
                    source={{ 
                      html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                          <style>
                            * { 
                              margin: 0; 
                              padding: 0; 
                              box-sizing: border-box;
                            }
                            body { 
                              margin: 0; 
                              padding: 0; 
                              background: #000; 
                              overflow: hidden;
                            }
                            .video-container { 
                              position: relative; 
                              width: 100%; 
                              height: 100vh;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                            }
                            .video-wrapper {
                              position: relative;
                              width: 100%;
                              padding-bottom: 56.25%;
                            }
                            .video-wrapper iframe { 
                              position: absolute; 
                              top: 0; 
                              left: 0; 
                              width: 100%; 
                              height: 100%; 
                              border: none;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="video-container">
                            <div class="video-wrapper">
                              <iframe 
                                src="https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1"
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                              </iframe>
                            </div>
                          </div>
                        </body>
                        </html>
                      ` 
                    }}
                    style={styles.webView}
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    mixedContentMode="compatibility"
                    originWhitelist={['*']}
                    allowsBackForwardNavigationGestures={false}
                    bounces={false}
                    scrollEnabled={false}
                    onShouldStartLoadWithRequest={() => true}
                    onError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      console.warn('WebView error: ', nativeEvent);
                    }}
                    onHttpError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      console.warn('WebView HTTP error: ', nativeEvent);
                    }}
                    renderError={() => (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                          Unable to load video. Tap the YouTube icon above to open in the YouTube app.
                        </Text>
                        <TouchableOpacity 
                          style={styles.retryButton}
                          onPress={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                        >
                          <Text style={styles.retryButtonText}>Open in YouTube</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoCategory}>{selectedVideo.category}</Text>
                    <Text style={styles.videoDescription}>{selectedVideo.description}</Text>
                  </View>
                </View>
              )}
            </View>
          </Modal>

          {/* Learning Path Section */}
          <View style={styles.learningPath}>
            <Text style={styles.learningPathTitle}>🎯 Recommended Learning Path</Text>
            <View style={styles.pathStep}>
              <Text style={styles.pathStepNumber}>1</Text>
              <Text style={styles.pathStepText}>Start with motivation video to understand the importance of ISL</Text>
            </View>
            <View style={styles.pathStep}>
              <Text style={styles.pathStepNumber}>2</Text>
              <Text style={styles.pathStepText}>Learn the ISL alphabet for foundational fingerspelling</Text>
            </View>
            <View style={styles.pathStep}>
              <Text style={styles.pathStepNumber}>3</Text>
              <Text style={styles.pathStepText}>Master basic words and everyday vocabulary</Text>
            </View>
            <View style={styles.pathStep}>
              <Text style={styles.pathStepNumber}>4</Text>
              <Text style={styles.pathStepText}>Practice phrases and action words for daily communication</Text>
            </View>
          </View>

          {/* Quick Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 ISL Learning Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>1</Text>
              </View>
              <Text style={styles.tipText}>
                Practice ISL signs daily for 15-20 minutes to build muscle memory
              </Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>2</Text>
              </View>
              <Text style={styles.tipText}>
                Use facial expressions and body language - they're crucial in ISL
              </Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>3</Text>
              </View>
              <Text style={styles.tipText}>
                Join local deaf communities to practice and learn cultural context
              </Text>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>4</Text>
              </View>
              <Text style={styles.tipText}>
                Be patient - sign language fluency develops gradually over time
              </Text>
            </View>
          </View>

          {/* Resources Section */}
          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesTitle}>📖 Additional Resources</Text>
            <View style={styles.resourceCard}>
              <Text style={styles.resourceCardTitle}>ISLRTC Official Channel</Text>
              <Text style={styles.resourceCardDesc}>Access the official Indian Sign Language dictionary and training materials</Text>
            </View>
            <View style={styles.resourceCard}>
              <Text style={styles.resourceCardTitle}>Local ISL Communities</Text>
              <Text style={styles.resourceCardDesc}>Connect with deaf communities in your area for practice and cultural immersion</Text>
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
  
  // Module Section
  moduleSection: {
    marginBottom: 32,
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  
  // Video Tutorials
  tutorialsContainer: {
    gap: 20,
  },
  tutorialCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  // Video Modal
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  youtubeButton: {
    padding: 8,
    marginLeft: 16,
  },
  videoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  videoContainer: {
    flex: 1,
  },
  webView: {
    height: Math.round((screenWidth * 9) / 16), // 16:9 aspect ratio
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 0,
  },
  videoInfo: {
    padding: 20,
  },
  videoCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#84a627',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  
  // Error Handling
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Learning Path Section
  learningPath: {
    backgroundColor: '#f8f9ff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  learningPathTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  pathStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#84a627',
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  pathStepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  
  // Tips Section
  tipsSection: {
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff7e6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#84a627',
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
  
  // Resources Section
  resourcesSection: {
    marginBottom: 32,
  },
  resourcesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  resourceCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  resourceCardDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
