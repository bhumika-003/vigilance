import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';

export type MascotMood = 'neutral' | 'happy' | 'sad' | 'shocked';

interface MascotProps {
  mood?: MascotMood;
  score?: number;
  message?: string;
}

const MOOD_MESSAGES: Record<MascotMood, string> = {
  neutral: 'Ready for action!',
  happy: 'Great move! Keep going! ✨',
  sad: 'Watch out! Lost power! 💧',
  shocked: 'Whoops! Got caught! 😱',
};

const GLOW_COLORS: Record<MascotMood, string> = {
  neutral: 'rgba(59, 130, 246, 0.45)', // Pastel Blue
  happy: 'rgba(34, 197, 94, 0.55)',   // Pastel Green
  sad: 'rgba(239, 68, 68, 0.55)',     // Pastel Red
  shocked: 'rgba(245, 158, 11, 0.55)', // Pastel Gold/Orange
};

export const DynamicMascot: React.FC<MascotProps> = ({
  mood = 'neutral',
  score = 0,
  message,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 300 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  // Safe image loader to prevent app crashes if image paths fail
  const renderMascotImage = () => {
    let imageSource;
    try {
      switch (mood) {
        case 'happy':
          imageSource = require('../assets/images/happy.png');
          break;
        case 'sad':
          imageSource = require('../assets/images/sad.png');
          break;
        case 'shocked':
          imageSource = require('../assets/images/shocked.png');
          break;
        case 'neutral':
        default:
          imageSource = require('../assets/images/neutral.png');
          break;
      }
      return <Image source={imageSource} style={styles.mascotImage} resizeMode="contain" />;
    } catch (e) {
      // Fallback text avatar if asset is not found
      return (
        <View style={styles.fallbackAvatar}>
          <Text style={{ fontSize: 32 }}>🧠</Text>
        </View>
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Speech Bubble */}
      <View style={[styles.bubble, { borderColor: GLOW_COLORS[mood] }]}>
        <Text style={styles.bubbleText}>{message || MOOD_MESSAGES[mood]}</Text>
      </View>

      {/* Brain Container with Pastel Glow Ring */}
      <View style={[styles.glowRing, { shadowColor: GLOW_COLORS[mood] }]}>
        {renderMascotImage()}
        
        {/* Score Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ {score}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default DynamicMascot;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    alignItems: 'center',
    cursor: 'pointer',
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  glowRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 16,
    elevation: 8,
  },
  mascotImage: {
    width: 75,
    height: 75,
  },
  fallbackAvatar: {
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
