import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Video, Lightbulb } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

export default function SignRecognitionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);

  const handleStartSigning = () => {
    if (Platform.OS !== 'web') {
      if (!permission?.granted) {
        requestPermission();
      } else {
        setShowCamera(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Sign Recognition</Text>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.image}
            resizeMode="cover"
          />
          {showFeedback && (
            <View style={styles.feedbackBadge}>
              <Text style={styles.feedbackText}>Well Done!</Text>
            </View>
          )}
        </View>

        <Text style={styles.readyText}>Ready to learn?</Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSigning}
          activeOpacity={0.8}
        >
          <Video size={20} color="white" strokeWidth={2} />
          <Text style={styles.startButtonText}>Start Signing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.howToButton}
          activeOpacity={0.8}
        >
          <Lightbulb size={20} color="white" strokeWidth={2} />
          <Text style={styles.howToButtonText}>How to Sign</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#fef3c7',
    borderRadius: 32,
    marginTop: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  feedbackBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#84a627',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  readyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 24,
    color: '#000',
  },
  startButton: {
    backgroundColor: '#84a627',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  howToButton: {
    backgroundColor: '#f87171',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  howToButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
