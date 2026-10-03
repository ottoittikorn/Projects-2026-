// A card you can swipe like Tinder: right = "Yeah!" (let's jam), left = "Nah" (pass).
// The buttons below the card call `swipe('right' | 'left')` to fly it off the same way.

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, PanResponder, Platform, StyleSheet, useWindowDimensions } from 'react-native';

import { colors, radius } from '../theme';

const SWIPE_THRESHOLD = 110;
const useNativeDriver = Platform.OS !== 'web';

const SwipeCard = forwardRef(function SwipeCard({ children, onSwipe }, ref) {
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(0)).current;
  const done = useRef(false);
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;

  const flyOff = (direction) => {
    if (done.current) return;
    done.current = true;
    Animated.timing(x, {
      toValue: (direction === 'right' ? 1 : -1) * width * 1.5,
      duration: 220,
      useNativeDriver,
    }).start(() => onSwipeRef.current(direction));
  };

  useImperativeHandle(ref, () => ({ swipe: flyOff }));

  const responder = useRef(
    PanResponder.create({
      // Only take over for sideways drags, so the card's details can still scroll up and down.
      onMoveShouldSetPanResponderCapture: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => x.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) flyOff('right');
        else if (g.dx < -SWIPE_THRESHOLD) flyOff('left');
        else Animated.spring(x, { toValue: 0, friction: 6, useNativeDriver }).start();
      },
    }),
  ).current;

  const rotate = x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-12deg', '0deg', '12deg'],
  });
  const jamOpacity = x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const passOpacity = x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Animated.View
      style={[styles.card, { transform: [{ translateX: x }, { rotate }] }]}
      {...responder.panHandlers}
    >
      {children}
      <Animated.Text style={[styles.stamp, styles.jam, { opacity: jamOpacity }]}>Yeah!</Animated.Text>
      <Animated.Text style={[styles.stamp, styles.pass, { opacity: passOpacity }]}>Nah</Animated.Text>
    </Animated.View>
  );
});

export default SwipeCard;

const styles = StyleSheet.create({
  card: { flex: 1 },
  stamp: {
    position: 'absolute',
    top: 28,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 4,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  jam: {
    left: 24,
    color: colors.accent,
    borderColor: colors.accent,
    transform: [{ rotate: '-14deg' }],
  },
  pass: {
    right: 24,
    color: colors.warm,
    borderColor: colors.warm,
    transform: [{ rotate: '14deg' }],
  },
});

