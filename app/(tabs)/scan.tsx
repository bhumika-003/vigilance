import { AppButton } from '@/components/app-button';
import { AppCard } from '@/components/app-card';
import { AppFonts, Palette } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ScanState = 'input' | 'checking' | 'result';

export default function ScanScreen() {
  const [state, setState] = useState<ScanState>('input');
  const [claim, setClaim] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  const handleCheck = () => {
    setState('checking');

    // Temporary demo behaviour.
    // The real backend will replace this later.
    setTimeout(() => {
      setState('result');
    }, 2000);
  };

  const handleReset = () => {
    setClaim('');
    setImageUri(null);
    setState('input');
  };

  // CHECKING SCREEN
  if (state === 'checking') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Palette.indigo} />

        <Text style={styles.checkingTitle}>
          Checking your claim...
        </Text>

        <Text style={styles.checkingSubtitle}>
          We're looking for information that can help you understand it.
        </Text>
      </View>
    );
  }

  // RESULT SCREEN
  if (state === 'result') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.resultContent}
      >
        <Text style={styles.resultHeading}>Your result</Text>

        <Text style={styles.resultSubheading}>
          Here's what VIGILANCE found.
        </Text>

        <AppCard style={styles.resultCard}>
          {/* Verdict */}
          <View style={styles.verdictBox}>
            <Text style={styles.verdictEmoji}>⚠️</Text>

            <View style={styles.verdictContent}>
              <Text style={styles.verdictLabel}>Verdict</Text>

              <Text style={styles.verdictTitle}>
                Needs Context
              </Text>
            </View>
          </View>

          {/* Image */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.resultImage}
            />
          )}

          {/* Claim */}
          <Text style={styles.sectionLabel}>Your claim</Text>

          <Text style={styles.claimText}>
            "{claim || 'Your submitted screenshot'}"
          </Text>

          {/* Explanation */}
          <Text style={styles.sectionLabel}>Why?</Text>

          <Text style={styles.explanationText}>
            This is a demonstration result. The actual explanation,
            evidence and verdict will come from the VIGILANCE backend
            once the Scan API is connected.
          </Text>

          {/* Evidence placeholder */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔎 Evidence</Text>

            <Text style={styles.infoText}>
              Evidence and supporting sources will appear here after
              the backend connection is completed.
            </Text>
          </View>

          {/* Demo notice */}
          <Text style={styles.demoText}>
            Demo result • Backend not connected yet
          </Text>

          <AppButton
            title="Check another"
            style={styles.checkAnother}
            onPress={handleReset}
          />
        </AppCard>
      </ScrollView>
    );
  }

  // INPUT SCREEN
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inputContent}
    >
      <Text style={styles.heading}>Check something</Text>

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

  verdictBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  verdictEmoji: {
    fontSize: 28,
    marginRight: 12,
  },

  verdictContent: {
    flex: 1,
  },

  verdictLabel: {
    fontFamily: AppFonts.body,
    fontSize: 11,
    color: '#888',
  },

  verdictTitle: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 18,
    color: Palette.gold,
    marginTop: 2,
  },

  resultImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 18,
  },

  sectionLabel: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 14,
    color: Palette.indigo,
    marginBottom: 7,
  },

  claimText: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 20,
    marginBottom: 18,
  },

  explanationText: {
    fontFamily: AppFonts.body,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },

  infoBox: {
    backgroundColor: '#F5F4FC',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },

  infoTitle: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 14,
    color: Palette.indigo,
    marginBottom: 6,
  },

  infoText: {
    fontFamily: AppFonts.body,
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },

  demoText: {
    fontFamily: AppFonts.body,
    fontSize: 10,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 14,
  },

  checkAnother: {
    marginTop: 16,
  },
});
     