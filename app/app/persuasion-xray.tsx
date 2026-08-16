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

export default function PersuasionXRayUI() {
  const [step, setStep] = useState<'landing' | 'input' | 'scan' | 'verdict'>('landing');
  const [userMessage, setUserMessage] = useState('');
  const [selectedMatches, setSelectedMatches] = useState<{ [key: string]: string }>({});

  // Sample dynamic data for persuasion scan round[span_1](start_span)[span_1](end_span)
  const sampleMessage = "Only 3 spots left! 9 out of 10 students are already using this. Trusted by leading experts.";
  const highlights = [
    { text: "Only 3 spots left!", type: "Scarcity" },
    { text: "9 out of 10 students", type: "Social Proof" },
    { text: "Trusted by leading experts", type: "Authority" },
  ];
  const techniqueOptions = ["Scarcity", "Social Proof", "Authority", "Emotional Appeal"];

  const handleSelectTechnique = (phrase: string, technique: string) => {
    setSelectedMatches((prev) => ({ ...prev, [phrase]: technique }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => setStep('landing')}>
            <Text style={styles.navBack}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>persuasion-xray</Text>
        </View>

        {/* STEP 1: LANDING */}
        {step === 'landing' && (
          <View style={styles.cardContainer}>
            <Text style={styles.headerTitle}>PERSUASION X-RAY</Text>
            <Text style={styles.headerSubtitle}>PERSUASIVE TECHNIQUE SCANNER</Text>

            <View style={styles.creamCard}>
              <Text style={styles.tagText}>► SYSTEM PROMPT</Text>
              <Text style={styles.quoteText}>
                "Don't just ask whether a message is true. Ask what it is trying to make you feel or do."
              </Text>
            </View>

            <View style={styles.creamCard}>
              <Text style={styles.cardHeading}>SEE HOW YOU ARE BEING PERSUADED</Text>
              <Text style={styles.cardBody}>
                In Persuasion X-Ray, you scan ads, social posts, or forwarded messages to reveal hidden manipulation tactics[span_2](start_span)[span_2](end_span).
              </Text>
              <Text style={styles.cardBody}>
                Your job is to identify emotional and social pressure techniques before accepting the message[span_3](start_span)[span_3](end_span).
              </Text>
            </View>

            <View style={styles.darkCard}>
              <Text style={styles.darkCardTitle}>[ MISSION GOALS ]</Text>
              <Text style={styles.goalItem}>■ Recognize persuasion techniques in real content</Text>
              <Text style={styles.goalItem}>■ Separate rhetorical tactics from underlying truth</Text>
              <Text style={styles.goalItem}>■ Upgrade defense against emotional manipulation</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep('input')}
            >
              <Text style={styles.primaryButtonText}>START SCANNING ⚪</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: BRING YOUR OWN MESSAGE */}
        {step === 'input' && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTag}>BEAT A — BRING YOUR OWN MESSAGE</Text>
            <Text style={styles.sectionTitle}>Paste an ad or message to scan</Text>
            <Text style={styles.subText}>
              Paste real text, or leave empty to let the AI generate a sample[span_4](start_span)[span_4](end_span).
            </Text>

            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={4}
              value={userMessage}
              onChangeText={setUserMessage}
              placeholder="Paste message, ad text, or headline here..."
              placeholderTextColor="#7a8f81"
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (!userMessage.trim()) {
                  setUserMessage(sampleMessage);
                }
                setStep('scan');
              }}
            >
              <Text style={styles.primaryButtonText}>
                {userMessage.trim() ? "Scan My Message →" : "Use Demo Message →"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: MATCH THE TECHNIQUE */}
        {step === 'scan' && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTag}>BEAT B & C — SCAN & MATCH</Text>

            <View style={[styles.creamCard, styles.borderLeft]}>
              <Text style={styles.tagText}>SCANNED MESSAGE</Text>
              <Text style={styles.quoteText}>"{userMessage || sampleMessage}"</Text>
            </View>

            <Text style={styles.inputLabel}>Match highlighted phrases to their persuasion technique:</Text>

            {highlights.map((item, index) => (
              <View key={index} style={styles.darkCard}>
                <Text style={styles.highlightPhrase}>"{item.text}"</Text>
                <View style={styles.chipContainer}>
                  {techniqueOptions.map((tech) => {
                    const isSelected = selectedMatches[item.text] === tech;
                    return (
                      <TouchableOpacity
                        key={tech}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => handleSelectTechnique(item.text, tech)}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {tech}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                Object.keys(selectedMatches).length < highlights.length && styles.disabledButton,
              ]}
              disabled={Object.keys(selectedMatches).length < highlights.length}
              onPress={() => setStep('verdict')}
            >
              <Text style={styles.primaryButtonText}>Reveal X-Ray Breakdown</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: REVEAL THE X-RAY */}
        {step === 'verdict' && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTag}>BEAT D — REVEAL THE X-RAY</Text>

            <View style={styles.darkCard}>
              <Text style={styles.ratingText}>✓ X-RAY BREAKDOWN COMPLETE</Text>
              <Text style={styles.userQuestionReview}>
                All persuasive triggers parsed and analyzed.
              </Text>
            </View>

            {highlights.map((item, index) => (
              <View key={index} style={styles.creamCard}>
                <Text style={styles.tagText}>{item.type.toUpperCase()} DETECTED</Text>
                <Text style={styles.cardHeading}>"{item.text}"</Text>
                <Text style={styles.cardBody}>
                  {item.type === 'Scarcity' && "Triggers urgency by claiming limited availability."}
                  {item.type === 'Social Proof' && "Uses perceived popularity to make you follow the crowd."}
                  {item.type === 'Authority' && "Borrows credibility from vague or unnamed expert claims."}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                setUserMessage('');
                setSelectedMatches({});
                setStep('landing');
              }}
            >
              <Text style={styles.primaryButtonText}>Scan Another Message ↺</Text>
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
  quoteText: { color: '#1C2E22', fontSize: 16, fontWeight: 'bold', lineHeight: 22 },
  cardHeading: { color: '#1C2E22', fontSize: 15, fontWeight: '900' },
  cardBody: { color: '#2D4233', fontSize: 14, lineHeight: 20 },
  darkCard: { backgroundColor: '#0B150F', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#233D2C', gap: 10 },
  darkCardTitle: { color: '#DDA15E', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  goalItem: { color: '#C2D4C6', fontSize: 13 },
  stepTag: { color: '#DDA15E', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  sectionTitle: { color: '#F0EBE1', fontSize: 22, fontWeight: 'bold' },
  subText: { color: '#9AB09E', fontSize: 14 },
  inputLabel: { color: '#C2D4C6', fontSize: 13, fontWeight: '700' },
  textInput: { backgroundColor: '#1C2E22', color: '#F0EBE1', borderWidth: 1, borderColor: '#2D4233', borderRadius: 12, padding: 14, fontSize: 15 },
  textArea: { height: 110, textAlignVertical: 'top' },
  highlightPhrase: { color: '#DDA15E', fontSize: 15, fontWeight: 'bold' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { backgroundColor: '#1C2E22', borderWidth: 1, borderColor: '#2D4233', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  chipSelected: { backgroundColor: '#DDA15E', borderColor: '#DDA15E' },
  chipText: { color: '#C2D4C6', fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: '#132219', fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#DDA15E', borderRadius: 30, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#132219', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  disabledButton: { opacity: 0.4 },
  ratingText: { color: '#DDA15E', fontSize: 14, fontWeight: 'bold' },
  userQuestionReview: { color: '#C2D4C6', fontSize: 13, fontStyle: 'italic' },
});