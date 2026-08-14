import React from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  type SharedValue,
} from 'react-native-reanimated';
import { Palette } from '@/constants/theme';

type Game = {
  title: string;
  description: string;
  emoji: string;
  color: string;
  accent: string;
};

const GAMES: Game[] = [
  {
    title: 'Fact or Fiction?',
    description: 'Spot misleading claims before they spread.',
    emoji: '🕵️',
    color: Palette.pink,
    accent: Palette.cream,
  },
  {
    title: 'Source Sprint',
    description: 'Choose the most reliable source against the clock.',
    emoji: '⚡',
    color: Palette.periwinkle,
    accent: Palette.lemon,
  },
  {
    title: 'Headline Detective',
    description: 'Find the clues hidden in a dramatic headline.',
    emoji: '🔎',
    color: '#D5A34D',
    accent: Palette.pink,
  },
];

type GameCardProps = {
  game: Game;
  index: number;
  itemWidth: number;
  scrollOffset: SharedValue<number>;
};

function GameCard({ game, index, itemWidth, scrollOffset }: GameCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * itemWidth;
    const inputRange = [position - itemWidth, position, position + itemWidth];

    return {
      opacity: interpolate(scrollOffset.get(), inputRange, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(scrollOffset.get(), inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP) },
        { translateY: interpolate(scrollOffset.get(), inputRange, [18, 0, 18], Extrapolation.CLAMP) },
      ],
    };
  }, [index, itemWidth]);

  return (
    <View style={{ width: itemWidth }}>
      <Animated.View style={[styles.card, { backgroundColor: game.color }, animatedStyle]}>
        <View style={[styles.orb, { backgroundColor: game.accent }]} />
        <Text style={styles.emoji}>{game.emoji}</Text>
        <Text style={styles.cardTitle}>{game.title}</Text>
        <Text style={styles.cardDescription}>{game.description}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Play ${game.title}`}
          onPress={() => Alert.alert(game.title, 'This mini game is coming next!')}
          style={styles.playButton}>
          <Text style={[styles.playText, { color: game.color }]}>Play now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function GamesScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.78, 340);
  const itemWidth = cardWidth + 16;
  const sidePadding = (width - itemWidth) / 2;
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>MINI GAMES</Text>
        <Text style={styles.title}>Play. Learn. Stay sharp.</Text>
        <Text style={styles.subtitle}>Swipe to choose a challenge.</Text>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        contentContainerStyle={[styles.carouselContent, { paddingHorizontal: sidePadding }]}
        decelerationRate="fast"
        disableIntervalMomentum
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={itemWidth}>
        {GAMES.map((game, index) => (
          <GameCard game={game} index={index} itemWidth={itemWidth} key={game.title} scrollOffset={scrollOffset} />
        ))}
      </Animated.ScrollView>

      <View style={styles.hint}>
        <Text style={styles.hintText}>← Swipe through the games →</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Palette.olive, flex: 1, paddingBottom: 96 },
  heading: { paddingHorizontal: 24, paddingTop: 26 },
  eyebrow: { color: Palette.lemon, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: Palette.cream, fontSize: 28, fontWeight: '800', marginTop: 7 },
  subtitle: { color: Palette.creamMuted, fontSize: 15, marginTop: 6 },
  carouselContent: { alignItems: 'center', paddingVertical: 30 },
  card: {
    borderRadius: 28,
    height: 370,
    justifyContent: 'flex-end',
    marginHorizontal: 8,
    overflow: 'hidden',
    padding: 26,
  },
  orb: { borderRadius: 120, height: 240, opacity: 0.35, position: 'absolute', right: -62, top: -72, width: 240 },
  emoji: { fontSize: 66, marginBottom: 24 },
  cardTitle: { color: '#FFFFFF', fontSize: 27, fontWeight: '800' },
  cardDescription: { color: Palette.cream, fontSize: 15, lineHeight: 21, marginTop: 8 },
  playButton: { alignSelf: 'flex-start', backgroundColor: Palette.cream, borderRadius: 20, marginTop: 22, paddingHorizontal: 19, paddingVertical: 10 },
  playText: { fontSize: 14, fontWeight: '800' },
  hint: { alignItems: 'center', marginTop: -5 },
  hintText: { color: Palette.creamMuted, fontSize: 13, fontWeight: '600' },
});
