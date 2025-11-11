import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, Dimensions } from 'react-native';
import { Video, Lightbulb, Camera, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { useProgress } from '../../contexts/ProgressContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ISL Alphabet mapping
const ISL_ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default function SignRecognitionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [currentAlphabet, setCurrentAlphabet] = useState('A');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [model, setModel] = useState<any>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<'loading' | 'real' | 'mock'>('loading');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [modelIssueDetected, setModelIssueDetected] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const consecutiveHCount = useRef(0);
  const { updateAIRecognition } = useProgress();

  // Load TensorFlow model
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      setDebugInfo('Starting TensorFlow initialization...');
      
      await tf.ready();
      setDebugInfo('TensorFlow ready. Loading model files...');
      console.log('✅ TensorFlow.js is ready!');
      
      try {
        // Simple model loading without complex error handling
        const modelJson = require('../../model/model.json');
        setDebugInfo('Model JSON loaded. Checking structure...');
        
        // Log model structure
        console.log('Model config:', {
          hasTopology: !!modelJson.modelTopology,
          hasWeightsManifest: !!modelJson.weightsManifest,
          manifestLength: modelJson.weightsManifest?.length,
          weightsPath: modelJson.weightsManifest?.[0]?.paths
        });
        
        const { Asset } = require('expo-asset');
        
        // Try loading the bin file
        let binAsset;
        try {
          binAsset = Asset.fromModule(require('../../model/group1-shard1of1.bin'));
        } catch {
          setDebugInfo('❌ ERROR: Cannot find bin file!');
          throw new Error('Bin file not found in ../../model/group1-shard1of1.bin');
        }
        
        setDebugInfo('Downloading weight file...');
        await binAsset.downloadAsync();
        
        setDebugInfo('Fetching weight data...');
        const response = await fetch(binAsset.localUri || binAsset.uri);
        const weightData = await response.arrayBuffer();
        
        console.log('Weight data size:', weightData.byteLength);
        setDebugInfo(`Weight loaded: ${weightData.byteLength} bytes`);
        
        if (weightData.byteLength === 0) {
          throw new Error('Weight file is empty');
        }
        
        setDebugInfo('Creating model artifacts...');
        
        const modelArtifacts = {
          modelTopology: modelJson.modelTopology,
          weightsManifest: modelJson.weightsManifest,
          format: modelJson.format,
          generatedBy: modelJson.generatedBy,
          convertedBy: modelJson.convertedBy,
          weightData: weightData,
          weightSpecs: modelJson.weightsManifest[0].weights
        };
        
        setDebugInfo('Loading TensorFlow model...');
        const loadedModel = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
        
        console.log('✅✅✅ MODEL LOADED SUCCESSFULLY! ✅✅✅');
        console.log('Input shape:', loadedModel.inputs[0].shape);
        console.log('Output shape:', loadedModel.outputs[0].shape);
        
        // CRITICAL TEST: Make a real prediction to verify model works
        const testInput = tf.randomNormal([1, 28, 28, 1]);
        const testOutput = loadedModel.predict(testInput) as tf.Tensor;
        const testData = await testOutput.data();
        
        console.log('TEST PREDICTION:', Array.from(testData).map((v, i) => 
          `${ISL_ALPHABET[i]}:${v.toFixed(3)}`
        ).join(', '));
        
        const testMaxIndex = Array.from(testData).indexOf(Math.max(...Array.from(testData)));
        console.log('Test predicts:', ISL_ALPHABET[testMaxIndex]);
        
        testInput.dispose();
        testOutput.dispose();
        
        setModel(loadedModel);
        setModelStatus('real');
        setDebugInfo('✅ Real model loaded!');
        
      } catch (error: any) {
        console.error('❌ Model loading failed:', error);
        setDebugInfo(`❌ Failed: ${error.message}`);
        
        // Use mock model
        console.log('⚠️ USING MOCK MODEL');
        const mockModel = {
          isMock: true,
          predict: () => ({
            data: async () => {
              const data = new Float32Array(26);
              const randomIdx = Math.floor(Math.random() * 26);
              data[randomIdx] = 0.9;
              return data;
            },
            dispose: () => {}
          })
        };
        setModel(mockModel);
        setModelStatus('mock');
      }
    } catch (error) {
      console.error('Fatal error:', error);
      setDebugInfo('❌ Fatal error loading model');
      setModelStatus('mock');
    } finally {
      setIsModelLoading(false);
    }
  };

  const generateRandomAlphabet = () => {
    const randomIndex = Math.floor(Math.random() * ISL_ALPHABET.length);
    setCurrentAlphabet(ISL_ALPHABET[randomIndex]);
    setPrediction('');
    setIsCorrect(null);
  };

  const handleStartSigning = () => {
    if (Platform.OS !== 'web') {
      if (!permission?.granted) {
        requestPermission();
      } else {
        setShowCamera(true);
        generateRandomAlphabet();
      }
    } else {
      Alert.alert('Camera Not Available', 'Camera features are not available on web platform.');
    }
  };

  const preprocessImage = async (imageUri: string, base64Image?: string) => {
    try {
      if (!base64Image) {
        throw new Error('Base64 image data required');
      }
      
      // Decode base64 to byte array
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Use TensorFlow.js React Native's decodeJpeg
      const { decodeJpeg } = require('@tensorflow/tfjs-react-native');
      const imageTensor = decodeJpeg(bytes);
      
      // Resize to model input size (28x28)
      const resized = tf.image.resizeBilinear(imageTensor, [28, 28]);
      
      // Convert to grayscale (average RGB channels)
      const grayscale = tf.mean(resized, -1, true);
      
      // Normalize to 0-1
      const normalized = grayscale.div(255.0);
      
      // Add batch dimension [1, 28, 28, 1]
      const batched = normalized.expandDims(0);
      
      // Clean up intermediate tensors
      imageTensor.dispose();
      resized.dispose();
      grayscale.dispose();
      normalized.dispose();
      
      return batched;
    } catch (error) {
      console.error('Error preprocessing image:', error);
      // Return a default tensor if preprocessing fails
      return tf.zeros([1, 28, 28, 1]);
    }
  };

  const captureAndPredict = async () => {
    if (!cameraRef.current || isCapturing || !model) return;

    try {
      setIsCapturing(true);
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 PREDICTION ATTEMPT');
      console.log('Expected:', currentAlphabet);
      console.log('Model type:', modelStatus);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: false,
      });

      if (photo && photo.base64) {
        const processedImage = await preprocessImage(photo.uri, photo.base64);
        
        const predictions = model.predict(processedImage) as tf.Tensor;
        const predictionData = await predictions.data();
        
        console.log('\n📊 PREDICTION RESULTS:');
        console.log('─────────────────────────────────');
        
        const sortedPreds = Array.from(predictionData)
          .map((prob, idx) => ({ letter: ISL_ALPHABET[idx], prob, idx }))
          .sort((a, b) => b.prob - a.prob);
        
        sortedPreds.slice(0, 5).forEach((p, i) => {
          const bar = '█'.repeat(Math.floor(p.prob * 20));
          console.log(`${i + 1}. ${p.letter}: ${(p.prob * 100).toFixed(1)}% ${bar}`);
        });
        
        const maxProb = Math.max(...Array.from(predictionData));
        const predictedIndex = Array.from(predictionData).indexOf(maxProb);
        const predictedLetter = ISL_ALPHABET[predictedIndex];
        
        // Detect if model is stuck on 'H'
        if (predictedLetter === 'H') {
          consecutiveHCount.current += 1;
          if (consecutiveHCount.current >= 3 && !modelIssueDetected) {
            setModelIssueDetected(true);
            Alert.alert(
              '⚠️ Model Training Issue Detected',
              'The AI model appears to be biased towards predicting "H". This is a model training issue, not a problem with your signs.\n\nThe model needs to be retrained with a balanced dataset.',
              [{ text: 'OK' }]
            );
          }
        } else {
          consecutiveHCount.current = 0;
        }
        
        console.log('─────────────────────────────────');
        console.log('🎯 FINAL:', predictedLetter, `(${(maxProb * 100).toFixed(2)}%)`);
        console.log('✓ Expected:', currentAlphabet);
        console.log('Match:', predictedLetter === currentAlphabet ? '✅' : '❌');
        
        // Show if model is overconfident on wrong answer (potential overfitting)
        if (maxProb > 0.7 && predictedLetter !== currentAlphabet) {
          console.warn('⚠️ High confidence on wrong prediction - possible model overfitting');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        setPrediction(predictedLetter);
        const correct = predictedLetter === currentAlphabet && maxProb > 0.3;
        setIsCorrect(correct);
        
        // Update progress
        updateAIRecognition(correct);
        
        if (correct) setScore(score + 1);
        setAttempts(attempts + 1);
        
        predictions.dispose();
        processedImage.dispose();
        
        setTimeout(() => generateRandomAlphabet(), 2000);
      }
    } catch (error) {
      console.error('❌ Prediction error:', error);
      Alert.alert('Error', 'Failed to analyze sign');
    } finally {
      setIsCapturing(false);
    }
  };

  // Image preprocessing removed - using mock predictions for demo

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    generateRandomAlphabet();
  };

  const goBack = () => {
    setShowCamera(false);
    resetGame();
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        {/* Header */}
        <View style={styles.cameraHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <ArrowLeft size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>Sign Recognition</Text>
          <Text style={styles.scoreText}>{score}/{attempts}</Text>
        </View>

        {/* Camera View */}
        <CameraView 
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        >
          {/* Current Alphabet Display */}
          <View style={styles.alphabetDisplay}>
            <Text style={styles.alphabetText}>Show sign for:</Text>
            <Text style={styles.currentLetter}>{currentAlphabet}</Text>
          </View>

          {/* Prediction Result */}
          {prediction && (
            <View style={[
              styles.predictionDisplay,
              { backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)' }
            ]}>
              <Text style={styles.predictionText}>
                Predicted: {prediction}
              </Text>
              {isCorrect ? (
                <CheckCircle size={24} color="white" strokeWidth={2} />
              ) : (
                <XCircle size={24} color="white" strokeWidth={2} />
              )}
            </View>
          )}

          {/* Capture Button */}
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={[styles.captureButton, { opacity: isCapturing ? 0.5 : 1 }]}
              onPress={captureAndPredict}
              disabled={isCapturing || !model}
            >
              {isCapturing ? (
                <RefreshCw size={32} color="white" strokeWidth={2} />
              ) : (
                <Camera size={32} color="white" strokeWidth={2} />
              )}
            </TouchableOpacity>
            <Text style={styles.captureText}>
              {isCapturing ? 'Analyzing...' : 'Capture Sign'}
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ISL AI Recognition</Text>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.feedbackBadge}>
            <Text style={styles.feedbackText}>
              {modelStatus === 'real' ? '✅ AI Ready!' : modelStatus === 'mock' ? '⚠️ Demo Mode' : '⏳ Loading...'}
            </Text>
          </View>
        </View>

        <Text style={styles.readyText}>Ready to test your ISL skills?</Text>
        <Text style={styles.descriptionText}>
          Use your camera to show ISL alphabet signs and let AI recognize them!
        </Text>

        {/* Debug Info Display */}
        {debugInfo && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>{debugInfo}</Text>
          </View>
        )}

        {modelStatus === 'mock' && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ MOCK MODEL ACTIVE - Predictions are random!{'\n'}
              Check console for loading errors.
            </Text>
          </View>
        )}

        {isModelLoading && (
          <View style={styles.loadingContainer}>
            <RefreshCw size={20} color="#84a627" strokeWidth={2} />
            <Text style={styles.loadingText}>Loading AI Model...</Text>
          </View>
        )}

        {modelIssueDetected && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>⚠️ Model Training Issue</Text>
            <Text style={styles.errorText}>
              The AI model is biased towards 'H'. This requires retraining the model with:
              {'\n\n'}• Balanced dataset (equal samples for all letters)
              {'\n'}• Better data augmentation
              {'\n'}• Proper validation during training
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.startButton, { opacity: isModelLoading ? 0.5 : 1 }]}
          onPress={handleStartSigning}
          activeOpacity={0.8}
          disabled={isModelLoading}
        >
          <Camera size={20} color="white" strokeWidth={2} />
          <Text style={styles.startButtonText}>Start Recognition</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.howToButton}
          activeOpacity={0.8}
        >
          <Lightbulb size={20} color="white" strokeWidth={2} />
          <Text style={styles.howToButtonText}>How to Use AI</Text>
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
    marginBottom: 16,
    color: '#000',
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#84a627',
    fontWeight: '600',
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
  
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  alphabetDisplay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(132, 166, 39, 0.9)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  alphabetText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  currentLetter: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
  },
  predictionDisplay: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(132, 166, 39, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  debugContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  debugText: {
    fontSize: 12,
    color: '#1565C0',
    fontFamily: 'monospace',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  warningText: {
    color: '#856404',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 20,
  },
});
