// Pick up to 5 profile photos. The first one is the main photo.

import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, space } from '../theme';

export const MAX_PHOTOS = 5;

export default function PhotoPicker({ photos, onChange }) {
  const canAdd = photos.length < MAX_PHOTOS;

  const add = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.8,
    });
    if (result.canceled) return;
    const picked = result.assets.map((a) => a.uri);
    onChange([...photos, ...picked].slice(0, MAX_PHOTOS));
  };

  const remove = (uri) => onChange(photos.filter((p) => p !== uri));

  // Tap a photo (not the main one) to make it the main photo.
  const makeMain = (uri) => onChange([uri, ...photos.filter((p) => p !== uri)]);

  return (
    <View style={styles.grid}>
      {photos.map((uri, i) => (
        <Pressable
          key={uri}
          onPress={() => makeMain(uri)}
          accessibilityRole="button"
          accessibilityLabel={i === 0 ? 'Main photo' : `Photo ${i + 1}, tap to make main photo`}
          style={styles.tile}
        >
          <Image source={{ uri }} style={styles.image} />
          {i === 0 ? <Text style={styles.main}>Main</Text> : null}
          <Pressable
            onPress={() => remove(uri)}
            accessibilityRole="button"
            accessibilityLabel={`Remove photo ${i + 1}`}
            hitSlop={8}
            style={styles.remove}
          >
            <Text style={styles.removeText}>×</Text>
          </Pressable>
        </Pressable>
      ))}
      {canAdd ? (
        <Pressable
          onPress={add}
          accessibilityRole="button"
          accessibilityLabel="Add photos"
          style={[styles.tile, styles.addTile]}
        >
          <Text style={styles.plus}>+</Text>
          <Text style={styles.addText}>Add photo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: {
    width: '31%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.soft,
  },
  image: { width: '100%', height: '100%' },
  main: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.blue,
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: colors.white, fontSize: 18, lineHeight: 20, fontWeight: '700' },
  addTile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.blue,
    backgroundColor: colors.blueSoft,
  },
  plus: { fontSize: 30, color: colors.blue, lineHeight: 34 },
  addText: { fontFamily: fonts.display, fontSize: 12, fontWeight: '700', color: colors.blue },
});
