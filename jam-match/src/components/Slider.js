// Tinder-style sliders: a label and value on top, a thin track with a round thumb below.
// `Slider` picks one value; `RangeSlider` picks a low and a high value with two thumbs.
// Built with React Native's PanResponder, so they work in Expo Go with no extra packages.

import { useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

const THUMB = 28;

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

// Turns a finger position (px along the track) into a value that snaps to `step`.
function toValue(px, width, min, max, step) {
  if (width <= 0) return min;
  const ratio = clamp(px / width, 0, 1);
  return clamp(min + Math.round((ratio * (max - min)) / step) * step, min, max);
}

function toPx(value, width, min, max) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * width;
}

// Shared drag handling. `onDrag(px, isStart)` receives the finger position along the track.
function useTrackGesture(onDrag) {
  const [width, setWidth] = useState(0);
  const latest = useRef({ onDrag, width });
  latest.current = { onDrag, width };
  const startX = useRef(0);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Don't let the page's vertical scroll steal the drag.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        // Thumb and fill ignore touches, so locationX is measured from the track's left edge.
        startX.current = e.nativeEvent.locationX - THUMB / 2;
        latest.current.onDrag(startX.current, true);
      },
      onPanResponderMove: (_, g) => latest.current.onDrag(startX.current + g.dx, false),
    }),
  ).current;

  const onLayout = (e) => setWidth(e.nativeEvent.layout.width - THUMB);
  return { width, responder, onLayout };
}

function Header({ label, valueText }) {
  return (
    <View style={styles.header}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{valueText}</Text>
    </View>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, format = String }) {
  const { width, responder, onLayout } = useTrackGesture((px) => {
    const v = toValue(px, width, min, max, step);
    if (v !== value) onChange(v);
  });
  const x = toPx(value, width, min, max);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: format(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) =>
        onChange(clamp(value + (e.nativeEvent.actionName === 'increment' ? step : -step), min, max))
      }
    >
      <Header label={label} valueText={format(value)} />
      <View style={styles.track} onLayout={onLayout} {...responder.panHandlers}>
        <View pointerEvents="none" style={styles.line} />
        <View pointerEvents="none" style={[styles.fill, { left: THUMB / 2, width: x }]} />
        <View pointerEvents="none" style={[styles.thumb, { left: x }]} />
      </View>
    </View>
  );
}

export function RangeSlider({
  label,
  low,
  high,
  min,
  max,
  step = 1,
  onChange,
  format = String,
  formatRange,
}) {
  const active = useRef('low');
  const { width, responder, onLayout } = useTrackGesture((px, isStart) => {
    const v = toValue(px, width, min, max, step);
    if (isStart) {
      // Move whichever thumb is closer to where the finger landed.
      const dLow = Math.abs(px - toPx(low, width, min, max));
      const dHigh = Math.abs(px - toPx(high, width, min, max));
      active.current = dLow < dHigh || (dLow === dHigh && v < low) ? 'low' : 'high';
    }
    if (active.current === 'low') {
      const next = Math.min(v, high);
      if (next !== low) onChange(next, high);
    } else {
      const next = Math.max(v, low);
      if (next !== high) onChange(low, next);
    }
  });
  const xLow = toPx(low, width, min, max);
  const xHigh = toPx(high, width, min, max);
  const valueText = formatRange ? formatRange(low, high) : `${format(low)} – ${format(high)}`;

  return (
    <View accessible accessibilityLabel={`${label}: ${valueText}`}>
      <Header label={label} valueText={valueText} />
      <View style={styles.track} onLayout={onLayout} {...responder.panHandlers}>
        <View pointerEvents="none" style={styles.line} />
        <View
          pointerEvents="none"
          style={[styles.fill, { left: xLow + THUMB / 2, width: xHigh - xLow }]}
        />
        <View pointerEvents="none" style={[styles.thumb, { left: xLow }]} />
        <View pointerEvents="none" style={[styles.thumb, { left: xHigh }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 15, fontWeight: '600', color: colors.body },
  value: { fontSize: 15, fontWeight: '700', color: colors.ink },
  // Tall touch area (44px) around a thin visible line.
  track: { height: 44, justifyContent: 'center' },
  line: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  fill: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: colors.warm },
  thumb: {
    position: 'absolute',
    top: (44 - THUMB) / 2,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.warm,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
});
