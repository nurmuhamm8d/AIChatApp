import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, SupportedLanguage } from '../i18n';

type Props = { style?: any };

export default function AuthLanguageToggle({ style }: Props) {
  const { i18n } = useTranslation();
  const cur = (i18n.language as SupportedLanguage) || 'en';
  const set = async (lng: SupportedLanguage) => {
    if (lng !== cur) await changeLanguage(lng);
  };
  return (
    <View style={[styles.wrap, style]}>
      <Pressable onPress={() => set('en')} style={[styles.btn, cur === 'en' && styles.active]}>
        <Text style={styles.txt}>EN</Text>
      </Pressable>
      <Pressable onPress={() => set('ru')} style={[styles.btn, cur === 'ru' && styles.active]}>
        <Text style={styles.txt}>RU</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignSelf: 'center', backgroundColor: '#E9E2F6', borderRadius: 20, overflow: 'hidden' },
  btn: { paddingHorizontal: 18, paddingVertical: 8 },
  active: { backgroundColor: '#D1C4F3' },
  txt: { fontWeight: '600' }
});
