import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function InterrogationRoomUI() {
  const [step, setStep] = useState<'landing' | 'context' | 'game' | 'verdict'>('landing');
  const [userContext, setUserContext] = useState('');
  const [userQuestion, setUserQuestion] = useState('');

  // Sample data simulating backend AI responses
  const sampleClaim = "Students who use AI coding assistants learn programming 50% faster than those who do not.";
  const sampleRuling = {
    rating: "STRONG QUESTION",
    explanation: "You challenged both the measurement standard ('learn faster') and sample comparability.",
    taughtSkill: "Methodology & Measurement Bias",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => setStep('landing')}>
            <Text style={styles.navBack}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>interrogation-room</Text>
        </View>

        {/* STEP 1: LANDING */}
        {step === 'landing' && (
          <View style={styles.cardContainer}>
            <Text style={styles.headerTitle}>INTERROGATION ROOM</Text>
            <Text style={styles.headerSubtitle}>SOCRATIC CLAIM INVESTIGATOR</Text>

            <View style={styles.creamCard}>
              <Text style={styles.tagText}>► SYSTEM PROMPT</Text>
              <Text style={styles.quoteText}>
                "Before deciding whether a claim is true, ask the question that matters."
              </Text>
            </View>

            <View style={styles.creamCard}>
              <Text style={styles.cardHeading}>QUESTION BEFORE YOU BELIEVE</Text>
              <Text style={styles.cardBody}>
                In Interrogation Room, claims don't get a free pass[span_0](start_span)[span_0](end_span). We present AI-generated assertions targeted at your field or interests[span_1](start_span)[span_1](end_span).
              </Text>
              <Text style={styles.cardBody}>
                Your job is to ask the single most lethal question to expose weak evidence, hidden motives, or missing context[span_2](start_span)[span_2](end_span).
              </Text>
            </View>

            <View style={styles.darkCard}>
              <Text style={styles.darkCardTitle}>[ MISSION GOALS ]</Text>
              <Text style={styles.goalItem}>■ Interrogate source quality & incentives</Text>
              <Text style={styles.goalItem}>■ Expose unstated sample limits & timing</Text>
              <Text style={styles.goalItem}>■ Build Socratic inquiry habits</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep('context')}
            >
              <Text style={styles.primaryButtonText}>ENTER THE ROOM ⚪</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: CONTEXT INPUT */}
        {step === 'context' && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTag}>BEAT A — SET YOUR FIELD</Text>
            <Text style={styles.sectionTitle}>What is your primary field or interest?</Text>
            <Text style={styles.subText}>The AI will generate a claim tailored to your domain[span_3](start_span)[span_3](end_span).</Text>

            <TextInput
              style={styles.textInput}
              value={userContext}
              onChangeText={setUserContext}
              placeholder="e.g., Computer Science, Finance, Sports..."
              placeholderTextColor="#7a8f81"
            />

            <TouchableOpacity
              style={[styles.primaryButton, !userContext.trim() && styles.disabledButton]}
              disabled={!userContext.trim()}
              onPress={() => setStep('game')}
            >
              <Text style={styles.primaryButtonText}>Generate Case Claim →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: GAME / QUESTION */}
        {step === 'game' && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTag}>BEAT B & C — THE CLAIM</Text>
            
            <View style={[styles.creamCard, styles.borderLeft]}>
              <Text style={styles.tagText}>EXAMINE CLAIM</Text>
              <Text style={styles.quoteText}>"{sampleClaim}"</Text>
            </View>

            <Text style={styles.inputLabel}>Ask the one question you need answered before believing this[span_4](start_span)[span_4](end_span):</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={4}
              value={userQuestion}
              onChangeText={setUserQuestion}
              placeholder="e.g., How was 'faster' measured, and who funded the study?"
              placeholderTextColor="#7a8f81"
            />

            <TouchableOpacity
              style={[styles.primaryButton, !userQuestion.trim() && styles.disabledButton]}
              disabled={!userQuestion.trim()}
              onPress={() => setStep('verdict')}
            >
              <Text style={styles.primaryButtonText}>Submit Question For Ruling</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: VERDICT */}
        {step === 'verdict' && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTag}>BEAT D — THE VERDICT</Text>

            <View style={styles.darkCard}>
              <Text style={styles.ratingText}>✓ {sampleRuling.rating}</Text>
              <Text style={styles.userQuestionReview}>"{userQuestion}"</Text>
            </View>

            <View style={styles.creamCard}>
              <Text style={styles.tagText}>AI INTERROGATION ANALYSIS</Text>
              <Text style={styles.cardBody}>{sampleRuling.explanation}</Text>
              <Text style={styles.skillText}>Teaches: {sampleRuling.taughtSkill}</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                setUserQuestion('');
                setStep('landing');
              }}
            >
              <Text style={styles.primaryButtonText}>Next Round ↺</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#132219' },
  scrollContent: { padding: 20 },
  navBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  navBack: { color: '#F0EBE1', fontSize: 24, fontWeight: 'bold' },
  navTitle: { color: '#DDA15E', fontSize: 18, fontWeight: '600' },
  cardContainer: { gap: 16 },
  headerTitle: { color: '#F0EBE1', fontSize: 28, fontWeight: '900' },
  headerSubtitle: { color: '#9AB09E', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  creamCard: { backgroundColor: '#F0EBE1', borderRadius: 16, padding: 18, gap: 8 },
  borderLeft: { borderLeftWidth: 6, borderLeftColor: '#DDA15E' },
  tagText: { color: '#A36B28', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  quoteText: { color: '#1C2E22', fontSize: 17, fontWeight: 'bold', lineHeight: 24 },
  cardHeading: { color: '#1C2E22', fontSize: 15, fontWeight: '900' },
  cardBody: { color: '#2D4233', fontSize: 14, lineHeight: 20 },
  darkCard: { backgroundColor: '#0B150F', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#233D2C', gap: 8 },
  darkCardTitle: { color: '#DDA15E', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  goalItem: { color: '#C2D4C6', fontSize: 13 },
  stepTag: { color: '#DDA15E', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  sectionTitle: { color: '#F0EBE1', fontSize: 22, fontWeight: 'bold' },
  subText: { color: '#9AB09E', fontSize: 14 },
  inputLabel: { color: '#C2D4C6', fontSize: 12, fontWeight: '700' },
  textInput: { backgroundColor: '#1C2E22', color: '#F0EBE1', borderWidth: 1, borderColor: '#2D4233', borderRadius: 12, padding: 14, fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  primaryButton: { backgroundColor: '#DDA15E', borderRadius: 30, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#132219', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  disabledButton: { opacity: 0.4 },
  ratingText: { color: '#DDA15E', fontSize: 14, fontWeight: 'bold' },
  userQuestionReview: { color: '#C2D4C6', fontSize: 14, fontStyle: 'italic' },
  skillText: { color: '#1C2E22', fontSize: 12, fontWeight: 'bold', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#D8D2C2' },
});