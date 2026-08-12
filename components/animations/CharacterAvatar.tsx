import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { MotiView } from 'moti';

export type ExpressionType = 'sad' | 'neutral' | 'happy' | 'shocked';

const characterImages = {
  sad: require('../../assets/charecter/sad.png'),
  neutral: require('../../assets/charecter/neutral.png'),
  happy: require('../../assets/charecter/happy.png'),
  shocked: require('../../assets/charecter/shocked.png'),
};

interface CharacterAvatarProps {
  expression: ExpressionType;
  size?: number;
}

export const CharacterAvatar = ({ expression = 'neutral', size = 180 }: CharacterAvatarProps) => {
  return (
    <MotiView
      from={{ opacity: 0.2, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 14 }}
      key={expression}
    >
      <Image
        source={characterImages[expression]}
        style={[styles.image, { width: size, height: size }]}
      />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
  },
});