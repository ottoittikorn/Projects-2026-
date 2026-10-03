// Small building blocks reused on every screen.

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, space } from '../theme';

// A screen with the app background, safe-area padding, scrolling content
// and an optional footer (usually the main button) pinned to the bottom.
export function Screen({ children, footer, scroll = true, edges = ['top', 'bottom'] }) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.screen} edges={edges}>
      <Body
        style={styles.body}
        contentContainerStyle={scroll ? styles.content : undefined}
        keyboardShouldPersistTaps="handled"
      >
        {scroll ? children : <View style={[styles.content, styles.fill]}>{children}</View>}
      </Body>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function Button({ title, onPress, variant = 'primary', disabled = false }) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        secondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{title}</Text>
    </Pressable>
  );
}

// A rounded tag. Tappable when `onPress` is given.
export function Chip({ label, selected = false, highlight = false, onPress }) {
  const content = (
    <Text
      style={[
        styles.chip,
        selected && styles.chipSelected,
        highlight && styles.chipHighlight,
      ]}
    >
      {label}
    </Text>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={4}
    >
      {content}
    </Pressable>
  );
}

export function ChipRow({ children }) {
  return <View style={styles.chipRow}>{children}</View>;
}

// "Step 1 of 3" progress bar and title for the sign-up screens.
export function StepHeader({ step, total, title, subtitle }) {
  return (
    <View style={styles.stepHeader}>
      <View style={styles.progress}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.progressBar, i < step && styles.progressOn]} />
        ))}
      </View>
      <Text style={styles.small}>
        Step {step} of {total}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.bodyText}>{subtitle}</Text> : null}
    </View>
  );
}

// A white card with a heading.
export function Section({ title, right, children }) {
  return (
    <View style={styles.section}>
      {title ? (
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {right ? <Text style={styles.sectionRight}>{right}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

// Pick one option from a row, like "Only mine / Some overlap / Anything".
export function Segmented({ options, value, onChange, small = false }) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={[styles.segment, on && styles.segmentOn]}
          >
            <Text
              style={[styles.segmentText, small && styles.segmentTextSmall, on && styles.segmentTextOn]}
              numberOfLines={1}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// A coloured circle with someone's first letter, standing in for a photo.
const avatarColors = ['#0f6e66', '#b4400b', '#5b4b8a', '#2f5d8a', '#8a5a2f', '#3f6b3a'];

export function Avatar({ name, size = 48 }) {
  const color = avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>{name.charAt(0)}</Text>
    </View>
  );
}

export const text = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.ink },
  body: { fontSize: 15, lineHeight: 22, color: colors.body },
  small: { fontSize: 13, color: colors.muted },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  error: { fontSize: 13, color: colors.warm, fontWeight: '600' },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  content: { padding: space.xl - 4, gap: space.lg, paddingBottom: space.xl * 2 },
  fill: { flex: 1 },
  footer: {
    paddingHorizontal: space.xl - 4,
    paddingTop: space.md,
    paddingBottom: space.md,
    gap: space.sm,
    backgroundColor: colors.background,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  buttonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonDisabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
  buttonText: { color: colors.white, fontSize: 17, fontWeight: '700' },
  buttonTextSecondary: { color: colors.ink },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    color: colors.ink,
    fontSize: 14,
    overflow: 'hidden',
  },
  chipSelected: { backgroundColor: colors.ink, borderColor: colors.ink, color: colors.white },
  chipHighlight: { backgroundColor: colors.warm, borderColor: colors.warm, color: colors.white },
  stepHeader: { gap: space.sm },
  progress: { flexDirection: 'row', gap: 6 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  progressOn: { backgroundColor: colors.accent },
  small: { fontSize: 13, color: colors.muted },
  title: { fontSize: 30, fontWeight: '800', color: colors.ink, lineHeight: 34 },
  bodyText: { fontSize: 15, lineHeight: 22, color: colors.body },
  section: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
  },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  sectionRight: { fontSize: 14, fontWeight: '700', color: colors.accent },
  segmented: {
    flexDirection: 'row',
    gap: space.xs,
    padding: space.xs,
    backgroundColor: colors.soft,
    borderRadius: radius.pill,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 2,
  },
  segmentOn: { backgroundColor: colors.card },
  segmentText: { fontSize: 14, color: colors.body },
  segmentTextSmall: { fontSize: 11 },
  segmentTextOn: { fontWeight: '700', color: colors.ink },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '800' },
});
