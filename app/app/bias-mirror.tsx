import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

type GameStage = 'LANDING' | 'SET_LENS' | 'SEE_MIRROR' | 'SPOT_ENGINEERING' | 'REVEAL_BIAS';

interface LensOption {
  id: string;
  category: string;
  label: string;
  icon: string;
}

const LENS_OPTIONS: LensOption[] = [
  { id: '1', category: 'TECH', label: 'AI & Automation', icon: '🤖' },
  { id: '2', category: 'HEALTH', label: 'Wellness & Diets', icon: '🥗' },
  { id: '3', category: 'CLIMATE', label: 'Clean Energy', icon: '⚡' },
  { id: '4', category: 'WORK', label: 'Remote Work', icon: '💻' },
  { id: '5', category: 'FINANCE', label: 'Crypto & Markets', icon: '📈' },
  { id: '6', category: 'MEDIA', label: 'Social Networks', icon: '📱' },
];

export default function BiasMirrorScreen() {
  const [stage, setStage] = useState<GameStage>('LANDING');
  const [selectedLenses, setSelectedLenses] = useState<string[]>([]);

  const toggleLens = (id: string) => {
    if (selectedLenses.includes(id)) {
      setSelectedLenses((prev) => prev.filter((item) => item !== id));
    } else {
      if (selectedLenses.length < 3) {
        setSelectedLenses((prev) => [...prev, id]);
      }
    }
  };

  // -------------------------------------------------------------
  // STAGE 0: LANDING
  // -------------------------------------------------------------
  if (stage === 'LANDING') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Top Bar Navigation */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.topBtn}>
              <Text style={styles.topBtnText}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>MODULE 04</Text>
            </View>
          </View>

          {/* Title Banner */}
          <View style={styles.titleBanner}>
            <Text style={styles.titleText}>BIAS MIRROR</Text>
            <Text style={styles.subtitleText}>CONFIRMATION BIAS DETECTOR</Text>
          </View>

          {/* System Prompt Card */}
          <View style={styles.creamCard}>
            <Text style={styles.cardHeaderLabel}>► SYSTEM PROMPT</Text>
            <Text style={styles.quoteText}>
              "That headline feels right… doesn’t it?"
            </Text>
          </View>

          {/* Warning / Explanation Card */}
          <View style={styles.creamCard}>
            <Text style={styles.bodyHighlight}>
              BUT WHAT IF IT WAS DESIGNED TO FEEL THAT WAY?
            </Text>
            <Text style={styles.bodyText}>
              In <Text style={styles.inlineAccent}>BIAS MIRROR</Text>, your beliefs become the battlefield. We present headlines crafted to flatter your existing opinions.
            </Text>
            <Text style={styles.bodyText}>
              Your job is to spot emotional traps, tap hidden manipulation, and catch your own bias before it catches you.
            </Text>
          </View>

          {/* Mission Goals Card */}
          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>[ MISSION GOALS ]</Text>
            <Text style={styles.missionItem}>■ Investigate deceptive wording</Text>
            <Text style={styles.missionItem}>■ Uncover missing counter-facts</Text>
            <Text style={styles.missionItem}>■ Upgrade your mind's defense</Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setStage('SET_LENS')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>ENTER THE MIRROR 🪞</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // STAGE 1: SET YOUR LENS
  // -------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setStage('LANDING')} style={styles.topBtn}>
            <Text style={styles.topBtnText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SELECT LENS</Text>
          </View>
        </View>

        {/* Title Banner */}
        <View style={styles.titleBanner}>
          <Text style={styles.titleText}>SET YOUR LENS</Text>
          <Text style={styles.subtitleText}>CHOOSE YOUR TARGET TOPICS</Text>
        </View>

        {/* System Box */}
        <View style={styles.creamCard}>
          <Text style={styles.bodyText}>
            Select topics that match your current mindset matrix.
          </Text>
          <Text style={styles.systemHint}>CHOOSE 2-3 SLOTS ({selectedLenses.length}/3 READY):</Text>
        </View>

        {/* Grid Selection */}
        <View style={styles.lensGrid}>
          {LENS_OPTIONS.map((lens) => {
            const isSelected = selectedLenses.includes(lens.id);
            return (
              <TouchableOpacity
                key={lens.id}
                style={[
                  styles.lensCard,
                  isSelected && styles.lensCardSelected,
                ]}
                onPress={() => toggleLens(lens.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.lensIcon}>{lens.icon}</Text>
                <Text style={[styles.lensCategory, isSelected && styles.lensCategorySelected]}>
                  {lens.category}
                </Text>
                <Text style={[styles.lensLabel, isSelected && styles.lensLabelSelected]}>
                  {lens.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            selectedLenses.length < 2 && styles.btnDisabled,
          ]}
          disabled={selectedLenses.length < 2}
          onPress={() => setStage('SEE_MIRROR')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>
            {selectedLenses.length >= 2 ? 'CALIBRATE MIRROR 🪞' : 'SELECT 2+ TOPICS'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B3022', // Olive Dark Green
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topBtn: {
    backgroundColor: '#122217',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2D4B37',
    borderRadius: 20, // Soft rounded pill
  },
  topBtnText: {
    color: '#EFE3C3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: '#D0A361',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // Soft rounded pill
  },
  badgeText: {
    color: '#1B3022',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titleBanner: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#EFE3C3',
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A9E90',
    letterSpacing: 1,
    marginTop: 2,
  },

  /* --- SMOOTH ROUNDED CARDS --- */
  creamCard: {
    backgroundColor: '#F3EDDA', // Light Beige/Cream
    padding: 20,
    marginBottom: 16,
    borderRadius: 20, // Soft rounded ends
  },
  cardHeaderLabel: {
    color: '#8B5B28',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  quoteText: {
    color: '#1B3022',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  bodyHighlight: {
    color: '#1B3022',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 22,
    marginBottom: 10,
  },
  bodyText: {
    color: '#3C4E42',
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10,
  },
  inlineAccent: {
    color: '#8B5B28',
    fontWeight: '900',
  },
  missionCard: {
    backgroundColor: '#122217',
    borderWidth: 1.5,
    borderColor: '#2D4B37',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20, // Soft rounded ends
  },
  missionTitle: {
    color: '#D0A361',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  missionItem: {
    color: '#8A9E90',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 22,
  },
  systemHint: {
    color: '#8B5B28',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },

  /* --- LENS SELECTION GRID --- */
  lensGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lensCard: {
    width: '48%',
    backgroundColor: '#F3EDDA',
    padding: 16,
    marginBottom: 14,
    borderRadius: 18, // Soft rounded corners
    alignItems: 'center',
  },
  lensCardSelected: {
    backgroundColor: '#D0A361',
  },
  lensIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  lensCategory: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8B5B28',
    letterSpacing: 1,
    marginBottom: 2,
  },
  lensCategorySelected: {
    color: '#1B3022',
  },
  lensLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B3022',
    textAlign: 'center',
  },
  lensLabelSelected: {
    color: '#1B3022',
  },

  /* --- PRIMARY BUTTON WITH SOFT ENDS --- */
  primaryBtn: {
    backgroundColor: '#D0A361',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28, // Smooth pill button
    marginTop: 4,
  },
  btnDisabled: {
    backgroundColor: '#3C4E42',
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#1B3022',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});