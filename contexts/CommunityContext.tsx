import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  category: 'story' | 'question' | 'achievement' | 'tip' | 'event';
  verified?: boolean;
  trending?: boolean;
  likedBy: string[];
  createdAt: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  createdAt: number;
}

interface CommunityContextType {
  posts: Post[];
  addPost: (content: string, category: Post['category']) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  isPostLiked: (postId: string) => boolean;
  refreshPosts: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const STORAGE_KEY = '@community_posts';
const USER_ID = '@current_user_id';

// Initial seed posts with realistic Indian names and content
const seedPosts: Post[] = [
  {
    id: 'seed-1',
    author: 'Priya Sharma',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=84a627&color=fff',
    time: '2 hours ago',
    content: 'My 5-year-old daughter just signed "I love you" for the first time! 😭❤️ All those practice sessions with ISL videos are finally paying off. Never give up parents!',
    likes: 124,
    comments: [
      {
        id: 'c1',
        author: 'Rajesh Kumar',
        avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2196F3&color=fff',
        content: 'This is so heartwarming! Congratulations! 🎉',
        time: '1 hour ago',
        createdAt: Date.now() - 3600000,
      },
      {
        id: 'c2',
        author: 'Meera Patel',
        avatar: 'https://ui-avatars.com/api/?name=Meera+Patel&background=9C27B0&color=fff',
        content: 'Keep going! The journey is beautiful ❤️',
        time: '45 min ago',
        createdAt: Date.now() - 2700000,
      }
    ],
    shares: 12,
    category: 'story',
    trending: true,
    likedBy: [],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'seed-2',
    author: 'Dr. Rajesh Kumar',
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2196F3&color=fff',
    time: '5 hours ago',
    content: 'Question: How do I explain abstract concepts like "tomorrow" or "later" in ISL to my 4-year-old? Any tips from experienced parents?',
    likes: 45,
    comments: [
      {
        id: 'c3',
        author: 'Anita Desai',
        avatar: 'https://ui-avatars.com/api/?name=Anita+Desai&background=4CAF50&color=fff',
        content: 'I use a visual calendar with pictures. It really helps!',
        time: '3 hours ago',
        createdAt: Date.now() - 10800000,
      }
    ],
    shares: 5,
    category: 'question',
    verified: true,
    likedBy: [],
    createdAt: Date.now() - 18000000,
  },
  {
    id: 'seed-3',
    author: 'Anita Desai',
    avatar: 'https://ui-avatars.com/api/?name=Anita+Desai&background=9C27B0&color=fff',
    time: '1 day ago',
    content: '🎉 Achievement Unlocked! My son scored 100% in his ISL test at school. So proud! Remember, consistency is key. We practiced 30 minutes daily for 6 months.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    likes: 256,
    comments: [],
    shares: 34,
    category: 'achievement',
    trending: true,
    likedBy: [],
    createdAt: Date.now() - 86400000,
  },
];

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    initializeCommunity();
  }, []);

  const initializeCommunity = async () => {
    try {
      // Get or create user ID
      let uid = await AsyncStorage.getItem(USER_ID);
      if (!uid) {
        uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(USER_ID, uid);
      }
      setUserId(uid);

      // Load posts from storage
      const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        setPosts(parsed);
      } else {
        // First time - use seed posts
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedPosts));
        setPosts(seedPosts);
      }
    } catch (error) {
      console.error('Error initializing community:', error);
      setPosts(seedPosts);
    }
  };

  const savePosts = async (updatedPosts: Post[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  const addPost = async (content: string, category: Post['category']) => {
    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      author: 'You',
      avatar: 'https://ui-avatars.com/api/?name=You&background=84a627&color=fff',
      time: 'Just now',
      content,
      likes: 0,
      comments: [],
      shares: 0,
      category,
      likedBy: [],
      createdAt: Date.now(),
    };

    const updatedPosts = [newPost, ...posts];
    await savePosts(updatedPosts);

    // Simulate community engagement after 2-5 seconds
    setTimeout(async () => {
      simulateEngagement(newPost.id);
    }, Math.random() * 3000 + 2000);
  };

  const simulateEngagement = async (postId: string) => {
    const randomNames = [
      'Amit Singh', 'Kavya Reddy', 'Rohit Sharma', 'Sneha Gupta',
      'Arjun Patel', 'Divya Nair', 'Karan Mehta', 'Pooja Iyer'
    ];
    
    const encouragingComments = [
      'This is wonderful! Keep it up! 👏',
      'So inspiring! Thanks for sharing ❤️',
      'Great progress! You\'re doing amazing!',
      'This gives me hope! Thank you 🙏',
      'Absolutely brilliant! Keep going! 💪',
    ];

    const currentPosts = await AsyncStorage.getItem(STORAGE_KEY);
    if (!currentPosts) return;

    const parsedPosts = JSON.parse(currentPosts);
    const postIndex = parsedPosts.findIndex((p: Post) => p.id === postId);
    
    if (postIndex === -1) return;

    // Add 1-2 automatic likes
    const numLikes = Math.floor(Math.random() * 2) + 1;
    parsedPosts[postIndex].likes += numLikes;

    // Maybe add a comment (50% chance)
    if (Math.random() > 0.5) {
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomComment = encouragingComments[Math.floor(Math.random() * encouragingComments.length)];
      
      parsedPosts[postIndex].comments.push({
        id: `comment_${Date.now()}`,
        author: randomName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=${['84a627', '2196F3', '9C27B0', 'FF9800'][Math.floor(Math.random() * 4)]}&color=fff`,
        content: randomComment,
        time: 'Just now',
        createdAt: Date.now(),
      });
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedPosts));
    setPosts(parsedPosts);
  };

  const likePost = async (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId],
        };
      }
      return post;
    });

    await savePosts(updatedPosts);
  };

  const addComment = async (postId: string, content: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          author: 'You',
          avatar: 'https://ui-avatars.com/api/?name=You&background=84a627&color=fff',
          content,
          time: 'Just now',
          createdAt: Date.now(),
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });

    await savePosts(updatedPosts);

    // Simulate someone liking your comment after 3-7 seconds
    setTimeout(() => {
      // Could add comment likes in future
    }, Math.random() * 4000 + 3000);
  };

  const sharePost = async (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    });

    await savePosts(updatedPosts);
  };

  const isPostLiked = (postId: string): boolean => {
    const post = posts.find(p => p.id === postId);
    return post ? post.likedBy.includes(userId) : false;
  };

  const refreshPosts = async () => {
    // Update time stamps
    const updatedPosts = posts.map(post => ({
      ...post,
      time: getTimeAgo(post.createdAt),
      comments: post.comments.map(comment => ({
        ...comment,
        time: getTimeAgo(comment.createdAt),
      })),
    }));

    await savePosts(updatedPosts);
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        addPost,
        likePost,
        addComment,
        sharePost,
        isPostLiked,
        refreshPosts,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within CommunityProvider');
  }
  return context;
};
