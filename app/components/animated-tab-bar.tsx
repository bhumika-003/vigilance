import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Palette } from '@/constants/theme';

const BAR_HEIGHT = 64;
const ICONS: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  home: 'home',
  scan: 'qr-code-scanner',
  games: 'sports-esports',
  profile: 'person',
};

/** Floating tab bar with an animated indicator for Expo Router's JavaScript tabs. */
export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalMargin = width * 0.075;
  const barWidth = width - horizontalMargin * 2;
  const itemWidth = barWidth / state.routes.length;

  const indicatorStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: withTiming(state.index * itemWidth, { duration: 260 }) }],
      width: itemWidth,
    }),
    [itemWidth, state.index],
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { paddingBottom: bottom + 12 }]}>
      <View style={[styles.bar, { width: barWidth }]}>
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View style={styles.indicatorFill} />
        </Animated.View>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? { selected: true } : {}}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              onPress={onPress}
              style={styles.tab}>
              <MaterialIcons
                color={isFocused ? Palette.oliveDeep : '#8C9060'}
                name={ICONS[route.name] ?? 'circle'}
                size={25}
              />
              <Animated.Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                {typeof label === 'string' ? label : route.name}
              </Animated.Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { bottom: 0, left: 0, position: 'absolute', right: 0 },
  bar: {
    alignSelf: 'center',
    backgroundColor: Palette.cream,
    borderColor: '#D5CA8A',
    borderRadius: 32,
    borderWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    height: BAR_HEIGHT,
    overflow: 'hidden',
    shadowColor: '#1F2400',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  indicator: { alignItems: 'center', height: BAR_HEIGHT, justifyContent: 'center', left: 0, position: 'absolute' },
  indicatorFill: { backgroundColor: Palette.lemon, borderRadius: 24, height: 48, width: '82%' },
  label: { color: '#8C9060', fontSize: 10, fontWeight: '700', marginTop: 2 },
  labelActive: { color: Palette.oliveDeep },
  tab: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});
