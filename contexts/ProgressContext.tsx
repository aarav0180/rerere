import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressData {
  // Overall progress
  totalProgress: number;
  level: number;
  xp: number;
  
  // Activity tracking
  videosWatched: number;
  gamesPlayed: number;
  practiceAttempts: number;
  aiRecognitionAttempts: number;
  
  // Game-specific progress
  signNinjaHighScore: number;
  signNinjaPlays: number;
  alphabetMatchHighScore: number;
  alphabetMatchPlays: number;
  numberChallengeHighScore: number;
  numberChallengePlays: number;
  memoryMatchHighScore: number;
  memoryMatchPlays: number;
  wordBuilderHighScore: number;
  wordBuilderPlays: number;
  speedSignsHighScore: number;
  speedSignsPlays: number;
  
  // Learning milestones
  alphabetMastered: boolean;
  numbersMastered: boolean;
  basicWordsMastered: boolean;
  
  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

interface ProgressContextType {
  progress: ProgressData;
  updateVideoWatched: () => void;
  updateGamePlayed: (gameName: string, score?: number) => void;
  updatePracticeAttempt: (correct: boolean) => void;
  updateAIRecognition: (correct: boolean) => void;
  resetProgress: () => void;
}

const defaultProgress: ProgressData = {
  totalProgress: 0,
  level: 1,
  xp: 0,
  videosWatched: 0,
  gamesPlayed: 0,
  practiceAttempts: 0,
  aiRecognitionAttempts: 0,
  signNinjaHighScore: 0,
  signNinjaPlays: 0,
  alphabetMatchHighScore: 0,
  alphabetMatchPlays: 0,
  numberChallengeHighScore: 0,
  numberChallengePlays: 0,
  memoryMatchHighScore: 0,
  memoryMatchPlays: 0,
  wordBuilderHighScore: 0,
  wordBuilderPlays: 0,
  speedSignsHighScore: 0,
  speedSignsPlays: 0,
  alphabetMastered: false,
  numbersMastered: false,
  basicWordsMastered: false,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  // Load progress from AsyncStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress();
  }, [progress]);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
        updateStreak(parsed);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('userProgress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateStreak = (currentProgress: ProgressData) => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = new Date(currentProgress.lastActiveDate);
    const todayDate = new Date(today);
    
    const diffTime = Math.abs(todayDate.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
      return;
    } else if (diffDays === 1) {
      // Consecutive day, increase streak
      const newStreak = currentProgress.currentStreak + 1;
      setProgress(prev => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
        lastActiveDate: today,
      }));
    } else {
      // Streak broken
      setProgress(prev => ({
        ...prev,
        currentStreak: 1,
        lastActiveDate: today,
      }));
    }
  };

  const calculateTotalProgress = (data: ProgressData): number => {
    // Calculate progress percentage based on various activities
    const videoProgress = Math.min((data.videosWatched / 10) * 20, 20); // Max 20%
    const gameProgress = Math.min((data.gamesPlayed / 20) * 30, 30); // Max 30%
    const practiceProgress = Math.min((data.practiceAttempts / 50) * 25, 25); // Max 25%
    const aiProgress = Math.min((data.aiRecognitionAttempts / 30) * 25, 25); // Max 25%
    
    return Math.round(videoProgress + gameProgress + practiceProgress + aiProgress);
  };

  const calculateLevel = (xp: number): number => {
    // Level up every 100 XP
    return Math.floor(xp / 100) + 1;
  };

  const updateVideoWatched = () => {
    setProgress(prev => {
      const newXP = prev.xp + 10;
      const newVideos = prev.videosWatched + 1;
      const newProgress = calculateTotalProgress({ ...prev, videosWatched: newVideos, xp: newXP });
      
      return {
        ...prev,
        videosWatched: newVideos,
        xp: newXP,
        level: calculateLevel(newXP),
        totalProgress: newProgress,
      };
    });
    
    updateStreak(progress);
  };

  const updateGamePlayed = (gameName: string, score?: number) => {
    setProgress(prev => {
      const newXP = prev.xp + 20;
      const newGamesPlayed = prev.gamesPlayed + 1;
      
      let updates: Partial<ProgressData> = {
        gamesPlayed: newGamesPlayed,
        xp: newXP,
        level: calculateLevel(newXP),
      };
      
      // Game-specific updates
      switch (gameName) {
        case 'sign-ninja':
          updates.signNinjaPlays = prev.signNinjaPlays + 1;
          if (score && score > prev.signNinjaHighScore) {
            updates.signNinjaHighScore = score;
          }
          break;
        
        case 'alphabet-match':
          updates.alphabetMatchPlays = prev.alphabetMatchPlays + 1;
          if (score && score > prev.alphabetMatchHighScore) {
            updates.alphabetMatchHighScore = score;
          }
          break;
        
        case 'number-challenge':
          updates.numberChallengePlays = prev.numberChallengePlays + 1;
          if (score && score > prev.numberChallengeHighScore) {
            updates.numberChallengeHighScore = score;
          }
          break;
        
        case 'memory-match':
          updates.memoryMatchPlays = prev.memoryMatchPlays + 1;
          if (score && score > prev.memoryMatchHighScore) {
            updates.memoryMatchHighScore = score;
          }
          break;
        
        case 'word-builder':
          updates.wordBuilderPlays = prev.wordBuilderPlays + 1;
          if (score && score > prev.wordBuilderHighScore) {
            updates.wordBuilderHighScore = score;
          }
          break;
        
        case 'speed-signs':
          updates.speedSignsPlays = prev.speedSignsPlays + 1;
          if (score && score > prev.speedSignsHighScore) {
            updates.speedSignsHighScore = score;
          }
          break;
      }
      
      const updatedProgress = { ...prev, ...updates };
      updates.totalProgress = calculateTotalProgress(updatedProgress);
      
      return { ...prev, ...updates };
    });
    
    updateStreak(progress);
  };

  const updatePracticeAttempt = (correct: boolean) => {
    setProgress(prev => {
      const xpGain = correct ? 5 : 2;
      const newXP = prev.xp + xpGain;
      const newAttempts = prev.practiceAttempts + 1;
      const newProgress = calculateTotalProgress({ ...prev, practiceAttempts: newAttempts, xp: newXP });
      
      return {
        ...prev,
        practiceAttempts: newAttempts,
        xp: newXP,
        level: calculateLevel(newXP),
        totalProgress: newProgress,
      };
    });
    
    updateStreak(progress);
  };

  const updateAIRecognition = (correct: boolean) => {
    setProgress(prev => {
      const xpGain = correct ? 15 : 5;
      const newXP = prev.xp + xpGain;
      const newAttempts = prev.aiRecognitionAttempts + 1;
      const newProgress = calculateTotalProgress({ ...prev, aiRecognitionAttempts: newAttempts, xp: newXP });
      
      return {
        ...prev,
        aiRecognitionAttempts: newAttempts,
        xp: newXP,
        level: calculateLevel(newXP),
        totalProgress: newProgress,
      };
    });
    
    updateStreak(progress);
  };

  const resetProgress = async () => {
    setProgress(defaultProgress);
    await AsyncStorage.removeItem('userProgress');
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateVideoWatched,
        updateGamePlayed,
        updatePracticeAttempt,
        updateAIRecognition,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
