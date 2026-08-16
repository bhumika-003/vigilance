import { AppButton } from '@/components/app-button';
import { AppCard } from '@/components/app-card';
import { AppFonts, Palette } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ScanState = 'input' | 'checking' | 'result';

export default function ScanScreen() {
  const [state, setState] = useState<ScanState>('input');
  const [claim, setClaim] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const handlePickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert(
        'We need permission to access your photos to upload a screenshot.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCheck = async () => {
    if (!imageUri) {
      alert('Please upload a screenshot first.');
      return;
    }

    setState('checking');

    try {
      const formData = new FormData();

      formData.append('image', {
        uri: imageUri,
        name: 'screenshot.jpg',
        type: 'image/jpeg',
      } as any);

      if (claim.trim()) {
        formData.append('claim', claim.trim());
      }

      const response = await fetch('http://172.20.10.2:3000/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      console.log('SCAN RESULT:', JSON.stringify(data, null, 2));

      setScanResult(data);
      setState('result');
    } catch (error) {
      console.error('SCAN ERROR:', error);

      setState('input');

      alert(
        error instanceof Error
          ? error.message
          : 'Something went wrong while checking the screenshot.'
      );
    }
  };

  const handleReset = () => {
    setClaim('');
    setImageUri(null);
    setScanResult(null);
    setState('input');
  };

  /*
   * CHECKING SCREEN
   */
  if (state === 'checking') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Palette.indigo} />

        <Text style={styles.checkingTitle}>
          Investigating this claim...
        </Text>

        <Text style={styles.checkingSubtitle}>
          We're checking the claim against available evidence and reliable
          sources.
        </Text>
      </View>
    );
  }

  /*
   * RESULT SCREEN
   */
  if (state === 'result') {
    const firstClaim = scanResult?.scan?.claims?.[0];

    const verdict =
      firstClaim?.verdict?.verdict ||
      scanResult?.verdict ||
      'UNVERIFIED';

    const confidence =
      firstClaim?.verdict?.confidence ??
      scanResult?.confidence ??
      0;

    const explanation =
      firstClaim?.verdict?.reason ||
      scanResult?.summary ||
      'No explanation was returned.';

    const evidence =
      firstClaim?.factChecks?.results ||
      scanResult?.sources ||
      [];

    const tactic = firstClaim?.verdict?.milTactic;

    const verdictUpper = verdict.toUpperCase();

    const verdictEmoji =
      verdictUpper === 'FALSE'
        ? '✕'
        : verdictUpper === 'TRUE'
          ? '✓'
          : '?';

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultHeading}>Your result</Text>

        <Text style={styles.resultSubheading}>
          Here's what VIGILANCE found.
        </Text>

        <AppCard style={styles.resultCard}>

          {/* =========================
              VERDICT
          ========================= */}

          <View style={styles.verdictSection}>
            <View
              style={[
                styles.verdictIcon,
                verdictUpper === 'FALSE'
                  ? styles.falseIcon
                  : verdictUpper === 'TRUE'
                    ? styles.trueIcon
                    : styles.uncertainIcon,
              ]}
            >
              <Text style={styles.verdictIconText}>
                {verdictEmoji}
              </Text>
            </View>

            <View style={styles.verdictContent}>
              <Text style={styles.smallLabel}>VERDICT</Text>

              <Text
                style={[
                  styles.verdictTitle,
                  verdictUpper === 'FALSE'
                    ? styles.falseText
                    : verdictUpper === 'TRUE'
                      ? styles.trueText
                      : styles.uncertainText,
                ]}
              >
                {verdictUpper}
              </Text>

              <Text style={styles.confidenceText}>
                {Math.round(confidence * 100)}% confidence
              </Text>
            </View>
          </View>

          {/* =========================
              CLAIM
          ========================= */}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>THE CLAIM</Text>

          <Text style={styles.claimText}>
            "{firstClaim?.claim || claim || 'No claim extracted'}"
          </Text>

          {/* =========================
              WHAT RELIABLE SOURCES SAY
          ========================= */}

          <Text style={styles.sectionLabel}>
            WHAT RELIABLE SOURCES SAY
          </Text>

          <View style={styles.sourcesSummaryBox}>
            {evidence.length > 0 ? (
              <>
                <Text style={styles.sourcesSummaryText}>
                  VIGILANCE found {evidence.length}{' '}
                  {evidence.length === 1 ? 'source' : 'sources'} relevant
                  to this claim.
                </Text>

                <Text style={styles.sourcesSummarySubtext}>
                  The verdict below is based on the evidence returned by
                  the fact-checking and web search pipeline.
                </Text>
              </>
            ) : (
              <Text style={styles.sourcesSummaryText}>
                No matching fact-check sources were found.
              </Text>
            )}
          </View>

          {/* =========================
              WHY THIS VERDICT?
          ========================= */}

          <Text style={styles.sectionLabel}>
            WHY THIS VERDICT?
          </Text>

          <Text style={styles.explanationText}>
            {explanation}
          </Text>

          {/* =========================
              CHECK IT YOURSELF
          ========================= */}

          {tactic?.steps?.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>
                CHECK IT YOURSELF
              </Text>

              <Text style={styles.sectionIntro}>
                Don't just trust the verdict. Use this method to verify
                the claim yourself.
              </Text>

              <View style={styles.stepsContainer}>
                {tactic.steps.map(
                  (step: string, index: number) => (
                    <View
                      key={index}
                      style={styles.stepRow}
                    >
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>
                          {index + 1}
                        </Text>
                      </View>

                      <View style={styles.stepContent}>
                        <Text style={styles.stepLabel}>
                          STEP {index + 1}
                        </Text>

                        <Text style={styles.stepText}>
                          {step}
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            </>
          )}

          {/* =========================
              WHAT TO LOOK FOR
          ========================= */}

          {tactic?.whatToLookFor && (
            <>
              <Text style={styles.sectionLabel}>
                WHAT TO LOOK FOR
              </Text>

              <View style={styles.lookForBox}>
                <Text style={styles.lookForIcon}>◉</Text>

                <Text style={styles.lookForText}>
                  {tactic.whatToLookFor}
                </Text>
              </View>
            </>
          )}

          {/* =========================
              SOURCES
          ========================= */}

          <Text style={styles.sectionLabel}>
            SOURCES
          </Text>

          <View style={styles.sourcesContainer}>
            {evidence.length > 0 ? (
              evidence.slice(0, 5).map(
                (item: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.sourceCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.url) {
                        Linking.openURL(item.url);
                      }
                    }}
                    disabled={!item.url}
                  >
                    <View style={styles.sourceNumber}>
                      <Text style={styles.sourceNumberText}>
                        {index + 1}
                      </Text>
                    </View>

                    <View style={styles.sourceContent}>
                      <Text style={styles.sourceTitle}>
                        {item.title ||
                          item.publisher ||
                          'Source'}
                      </Text>

                      {item.snippet && (
                        <Text
                          style={styles.sourceSnippet}
                          numberOfLines={4}
                        >
                          {item.snippet}
                        </Text>
                      )}

                      {item.rating && (
                        <Text style={styles.sourceRating}>
                          Fact-check rating: {item.rating}
                        </Text>
                      )}

                      {item.url && (
                        <Text
                          style={styles.sourceUrl}
                          numberOfLines={1}
                        >
                          {item.url}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              )
            ) : (
              <Text style={styles.infoText}>
                No sources were returned.
              </Text>
            )}
          </View>

          {/* =========================
              TACTIC UNLOCKED
          ========================= */}

          {tactic && (
            <View style={styles.tacticUnlocked}>
              <Text style={styles.tacticEyebrow}>
                TACTIC UNLOCKED
              </Text>

              <Text style={styles.tacticName}>
                {tactic.name}
              </Text>

              {tactic.description && (
                <Text style={styles.tacticDescription}>
                  {tactic.description}
                </Text>
              )}
            </View>
          )}

          <AppButton
            title="Check another"
            style={styles.checkAnother}
            onPress={handleReset}
          />
        </AppCard>
      </ScrollView>
    );
  }

  /*
   * INPUT SCREEN
   */
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inputContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>
        Check something
      </Text>

      <Text style={styles.subheading}>
        Paste text, or upload a screenshot you're not sure about.
      </Text>

      <AppCard style={styles.inputCard}>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
          />
        )}

        <TextInput
          placeholder="Paste the message or claim here..."
          placeholderTextColor="#999"
          multiline
          value={claim}
          onChangeText={setClaim}
          style={styles.input}
        />

        <AppButton
          title="Check this"
          style={{ marginTop: 14 }}
          onPress={handleCheck}
        />
      </AppCard>

      <AppButton
        title={
          imageUri
            ? 'Change screenshot'
            : 'Upload a screenshot instead'
        }
        variant="secondary"
        style={{ marginTop: 14 }}
        onPress={handlePickImage}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FC',
  },

  inputContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  resultContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F4FC',
  },

  checkingTitle: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 18,
    color: Palette.indigo,
    marginTop: 16,
  },

  checkingSubtitle: {
    fontFamily: AppFonts.body,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },

  heading: {
    fontFamily: AppFonts.heading,
    fontSize: 24,
    color: Palette.indigo,
  },

  subheading: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    lineHeight: 20,
  },

  inputCard: {
    marginTop: 20,
  },

  input: {
    minHeight: 100,
    fontFamily: AppFonts.body,
    fontSize: 14,
    color: '#222',
    textAlignVertical: 'top',
  },

  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },

  resultHeading: {
    fontFamily: AppFonts.heading,
    fontSize: 24,
    color: Palette.indigo,
  },

  resultSubheading: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    marginBottom: 16,
  },

  resultCard: {
    marginTop: 4,
  },

  /*
   * VERDICT
   */

  verdictSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  verdictIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  falseIcon: {
    backgroundColor: '#FDECEC',
  },

  trueIcon: {
    backgroundColor: '#EAF7EF',
  },

  uncertainIcon: {
    backgroundColor: '#FFF5DC',
  },

  verdictIconText: {
    fontSize: 28,
    fontWeight: '700',
  },

  verdictContent: {
    flex: 1,
  },

  smallLabel: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 10,
    letterSpacing: 1,
    color: '#888',
  },

  verdictTitle: {
    fontFamily: AppFonts.heading,
    fontSize: 24,
    marginTop: 2,
  },

  falseText: {
    color: '#C44747',
  },

  trueText: {
    color: '#3A8D5D',
  },

  uncertainText: {
    color: Palette.gold,
  },

  confidenceText: {
    fontFamily: AppFonts.body,
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E6EF',
    marginVertical: 18,
  },

  /*
   * SECTIONS
   */

  sectionLabel: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: Palette.indigo,
    marginTop: 18,
    marginBottom: 8,
  },

  sectionIntro: {
    fontFamily: AppFonts.body,
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
    marginBottom: 12,
  },

  claimText: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 21,
  },

  /*
   * RELIABLE SOURCES SUMMARY
   */

  sourcesSummaryBox: {
    backgroundColor: '#F5F4FC',
    borderRadius: 12,
    padding: 14,
  },

  sourcesSummaryText: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 13,
    color: '#444',
    lineHeight: 19,
  },

  sourcesSummarySubtext: {
    fontFamily: AppFonts.body,
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
    marginTop: 5,
  },

  /*
   * EXPLANATION
   */

  explanationText: {
    fontFamily: AppFonts.body,
    fontSize: 13,
    color: '#555',
    lineHeight: 21,
  },

  /*
   * CHECK IT YOURSELF
   */

  stepsContainer: {
    marginTop: 4,
  },

  stepRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  stepNumberText: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 12,
    color: '#FFFFFF',
  },

  stepContent: {
    flex: 1,
    paddingTop: 1,
  },

  stepLabel: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 9,
    letterSpacing: 0.7,
    color: '#999',
    marginBottom: 2,
  },

  stepText: {
    fontFamily: AppFonts.body,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },

  /*
   * WHAT TO LOOK FOR
   */

  lookForBox: {
    flexDirection: 'row',
    backgroundColor: '#F8F6FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },

  lookForIcon: {
    fontSize: 16,
    color: Palette.indigo,
    marginRight: 10,
    marginTop: 1,
  },

  lookForText: {
    flex: 1,
    fontFamily: AppFonts.body,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },

  /*
   * SOURCES
   */

  sourcesContainer: {
    marginTop: 2,
  },

  sourceCard: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEAF2',
    paddingVertical: 12,
  },

  sourceNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0EEF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sourceNumberText: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 10,
    color: Palette.indigo,
  },

  sourceContent: {
    flex: 1,
  },

  sourceTitle: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 12,
    color: '#444',
    lineHeight: 17,
  },

  sourceSnippet: {
    fontFamily: AppFonts.body,
    fontSize: 11,
    color: '#777',
    lineHeight: 17,
    marginTop: 4,
  },

  sourceRating: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 10,
    color: Palette.indigo,
    marginTop: 5,
  },

  sourceUrl: {
    fontFamily: AppFonts.body,
    fontSize: 9,
    color: Palette.indigo,
    marginTop: 5,
  },

  infoText: {
    fontFamily: AppFonts.body,
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },

  /*
   * TACTIC UNLOCKED
   */

  tacticUnlocked: {
    marginTop: 22,
    backgroundColor: '#EEEAFB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },

  tacticEyebrow: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 9,
    letterSpacing: 1.2,
    color: Palette.indigo,
  },

  tacticName: {
    fontFamily: AppFonts.heading,
    fontSize: 20,
    color: Palette.indigo,
    marginTop: 4,
    textAlign: 'center',
  },

  tacticDescription: {
    fontFamily: AppFonts.body,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 5,
  },

  checkAnother: {
    marginTop: 18,
  },
});
