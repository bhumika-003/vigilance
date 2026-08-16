import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native'
import { useEffect, useRef } from 'react'
import { getScreenDimensions, scaleFontSize, scaleSpacing } from '../utils/responsive'

type InterrogationRoomBackgroundProps = {
  onEvidencePress?: () => void
  onAIPress?: () => void
}

export function InterrogationRoomBackground({
  onEvidencePress,
  onAIPress,
}: InterrogationRoomBackgroundProps) {
  const { width } = getScreenDimensions()
  const isWideScreen = width >= 768

  const lampPulse = useRef(new Animated.Value(0.7)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lampPulse, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(lampPulse, {
          toValue: 0.7,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  return (
    <View pointerEvents="box-none" style={styles.container}>
      
      {/* BACK WALL */}
      <View style={styles.backWall} />

      {/* FLOOR */}
      <View style={styles.floor} />

      {/* ONE-WAY MIRROR */}
      <View style={styles.mirrorFrame}>
        <View style={styles.mirror}>
          <View style={styles.mirrorReflection} />
        </View>
      </View>

      {/* HANGING LAMP */}
      <View style={styles.lampCable} />

      <Animated.View
        style={[
          styles.lightGlow,
          {
            opacity: lampPulse,
          },
        ]}
      />

      <View style={styles.lamp}>
        <View style={styles.lampShade} />
        <View style={styles.lampBulb} />
      </View>

      {/* DETECTIVE */}
      <View
        style={[
          styles.character,
          styles.detective,
          isWideScreen && styles.detectiveWide,
        ]}
      >
        <View style={styles.detectiveHead}>
          <View style={styles.detectiveHair} />
        </View>

        <View style={styles.detectiveBody}>
          <View style={styles.detectiveBadge} />
        </View>

        <View style={styles.leftArm} />
        <View style={styles.rightArm} />

        <View style={styles.characterLegs}>
          <View style={styles.leg} />
          <View style={styles.leg} />
        </View>

        <Text style={styles.characterLabel}>DETECTIVE</Text>
      </View>

      {/* WITNESS */}
      <View
        style={[
          styles.character,
          styles.witness,
          isWideScreen && styles.witnessWide,
        ]}
      >
        <View style={styles.witnessHead}>
          <View style={styles.witnessHair} />
        </View>

        <View style={styles.witnessBody} />

        <View style={styles.witnessLeftArm} />
        <View style={styles.witnessRightArm} />

        <View style={styles.characterLegs}>
          <View style={styles.leg} />
          <View style={styles.leg} />
        </View>

        <Text style={styles.characterLabel}>WITNESS</Text>
      </View>

      {/* DETECTIVE CHAIR */}
      <View
        style={[
          styles.chair,
          styles.detectiveChair,
          isWideScreen && styles.detectiveChairWide,
        ]}
      >
        <View style={styles.chairBack} />
        <View style={styles.chairSeat} />
        <View style={styles.chairLegLeft} />
        <View style={styles.chairLegRight} />
      </View>

      {/* WITNESS CHAIR */}
      <View
        style={[
          styles.chair,
          styles.witnessChair,
          isWideScreen && styles.witnessChairWide,
        ]}
      >
        <View style={styles.chairBack} />
        <View style={styles.chairSeat} />
        <View style={styles.chairLegLeft} />
        <View style={styles.chairLegRight} />
      </View>

      {/* INTERROGATION TABLE */}
      <View
        style={[
          styles.table,
          isWideScreen && styles.tableWide,
        ]}
      >
        <View style={styles.tableTop}>
          <View style={styles.tableReflection} />
        </View>

        <View style={styles.tableLegLeft} />
        <View style={styles.tableLegRight} />
      </View>

      {/* EVIDENCE FOLDER */}
      <Pressable
        onPress={onEvidencePress}
        style={({ pressed }) => [
          styles.evidenceFolder,
          pressed && styles.interactivePressed,
        ]}
      >
        <View style={styles.folderTab} />
        <Text style={styles.folderText}>EVIDENCE</Text>
        <Text style={styles.folderIcon}>▣</Text>
      </Pressable>

      {/* AI TERMINAL */}
      <Pressable
        onPress={onAIPress}
        style={({ pressed }) => [
          styles.aiTerminal,
          pressed && styles.interactivePressed,
        ]}
      >
        <View style={styles.aiScreen}>
          <View style={styles.aiDot} />
          <Text style={styles.aiText}>AI</Text>
          <Text style={styles.aiSubText}>ANALYST</Text>
        </View>

        <View style={styles.aiStand} />
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0b0d12',
    overflow: 'hidden',
  },

  backWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '58%',
    backgroundColor: '#1a1d24',
    borderBottomWidth: 3,
    borderBottomColor: '#090a0d',
  },

  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: '#111318',
  },

  mirrorFrame: {
    position: 'absolute',
    top: '10%',
    left: '34%',
    width: '32%',
    height: '22%',
    backgroundColor: '#090a0d',
    borderWidth: 4,
    borderColor: '#3b3f48',
    padding: 4,
  },

  mirror: {
    flex: 1,
    backgroundColor: '#131b25',
    overflow: 'hidden',
  },

  mirrorReflection: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '15%',
    height: '120%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: [{ rotate: '25deg' }],
  },

  lampCable: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 3,
    height: '18%',
    backgroundColor: '#08090b',
  },

  lightGlow: {
    position: 'absolute',
    top: '15%',
    left: '30%',
    width: '40%',
    height: '40%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 215, 120, 0.08)',
  },

  lamp: {
    position: 'absolute',
    top: '17%',
    left: '45%',
    width: 70,
    height: 50,
    alignItems: 'center',
    zIndex: 3,
  },

  lampShade: {
    width: 70,
    height: 28,
    backgroundColor: '#2c2c2c',
    borderWidth: 2,
    borderColor: '#555',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  lampBulb: {
    width: 38,
    height: 12,
    backgroundColor: '#f2c96d',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#f2c96d',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },

  character: {
    position: 'absolute',
    width: 75,
    height: 150,
    alignItems: 'center',
    zIndex: 5,
  },

  detective: {
    bottom: '25%',
    left: '10%',
  },

  detectiveWide: {
    left: '20%',
  },

  witness: {
    bottom: '25%',
    right: '10%',
  },

  witnessWide: {
    right: '20%',
  },

  detectiveHead: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#b88362',
    borderWidth: 2,
    borderColor: '#0d0e12',
    zIndex: 3,
  },

  detectiveHair: {
    width: 42,
    height: 15,
    backgroundColor: '#1b1b1b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  detectiveBody: {
    width: 55,
    height: 60,
    marginTop: -3,
    backgroundColor: '#2c3d52',
    borderWidth: 2,
    borderColor: '#101216',
    alignItems: 'center',
  },

  detectiveBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 12,
    backgroundColor: '#d9b44a',
  },

  witnessHead: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#9d6f55',
    borderWidth: 2,
    borderColor: '#0d0e12',
    zIndex: 3,
  },

  witnessHair: {
    width: 44,
    height: 20,
    backgroundColor: '#3b2b26',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  witnessBody: {
    width: 55,
    height: 60,
    marginTop: -3,
    backgroundColor: '#5a3538',
    borderWidth: 2,
    borderColor: '#101216',
  },

  leftArm: {
    position: 'absolute',
    top: 48,
    left: 0,
    width: 12,
    height: 55,
    backgroundColor: '#2c3d52',
    transform: [{ rotate: '10deg' }],
  },

  rightArm: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 12,
    height: 55,
    backgroundColor: '#2c3d52',
    transform: [{ rotate: '-10deg' }],
  },

  witnessLeftArm: {
    position: 'absolute',
    top: 48,
    left: 0,
    width: 12,
    height: 55,
    backgroundColor: '#5a3538',
    transform: [{ rotate: '10deg' }],
  },

  witnessRightArm: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 12,
    height: 55,
    backgroundColor: '#5a3538',
    transform: [{ rotate: '-10deg' }],
  },

  characterLegs: {
    flexDirection: 'row',
    gap: 10,
  },

  leg: {
    width: 15,
    height: 40,
    backgroundColor: '#17191f',
    borderWidth: 1,
    borderColor: '#08090b',
  },

  characterLabel: {
    position: 'absolute',
    bottom: -18,
    fontSize: scaleFontSize(8),
    fontWeight: 'bold',
    color: '#a8abb2',
    letterSpacing: 1,
  },

  chair: {
    position: 'absolute',
    width: 80,
    height: 90,
    zIndex: 2,
  },

  detectiveChair: {
    left: '5%',
    bottom: '16%',
  },

  detectiveChairWide: {
    left: '15%',
  },

  witnessChair: {
    right: '5%',
    bottom: '16%',
  },

  witnessChairWide: {
    right: '15%',
  },

  chairBack: {
    width: '100%',
    height: '55%',
    backgroundColor: '#363a42',
    borderWidth: 2,
    borderColor: '#16181d',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  chairSeat: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    height: 25,
    backgroundColor: '#2a2e35',
    borderWidth: 2,
    borderColor: '#16181d',
  },

  chairLegLeft: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    width: 7,
    height: 25,
    backgroundColor: '#17191f',
  },

  chairLegRight: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    width: 7,
    height: 25,
    backgroundColor: '#17191f',
  },

  table: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    width: '50%',
    maxWidth: 340,
    height: 120,
    transform: [{ translateX: -170 }],
    zIndex: 7,
  },

  tableWide: {
    bottom: '12%',
  },

  tableTop: {
    height: 45,
    backgroundColor: '#4a2f20',
    borderWidth: 3,
    borderColor: '#1a0f0b',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },

  tableReflection: {
    position: 'absolute',
    top: 6,
    left: '15%',
    width: '30%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  tableLegLeft: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: 20,
    height: 75,
    backgroundColor: '#28160e',
  },

  tableLegRight: {
    position: 'absolute',
    top: 45,
    right: 20,
    width: 20,
    height: 75,
    backgroundColor: '#28160e',
  },

  evidenceFolder: {
    position: 'absolute',
    left: scaleSpacing(16),
    bottom: scaleSpacing(20),
    width: 78,
    height: 55,
    backgroundColor: '#a47d2e',
    borderWidth: 3,
    borderColor: '#37280c',
    paddingTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  folderTab: {
    position: 'absolute',
    top: -8,
    left: 6,
    width: 30,
    height: 10,
    backgroundColor: '#a47d2e',
    borderWidth: 2,
    borderColor: '#37280c',
  },

  folderText: {
    fontSize: scaleFontSize(8),
    fontWeight: 'bold',
    color: '#20180a',
  },

  folderIcon: {
    fontSize: scaleFontSize(14),
    color: '#20180a',
  },

  aiTerminal: {
    position: 'absolute',
    right: scaleSpacing(16),
    bottom: scaleSpacing(20),
    width: 90,
    height: 75,
    alignItems: 'center',
    zIndex: 20,
  },

  aiScreen: {
    width: 90,
    height: 55,
    backgroundColor: '#10252a',
    borderWidth: 3,
    borderColor: '#4db8a8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4db8a8',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  aiDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#70f0c5',
  },

  aiText: {
    fontSize: scaleFontSize(14),
    fontWeight: 'bold',
    color: '#70f0c5',
  },

  aiSubText: {
    fontSize: scaleFontSize(7),
    fontWeight: 'bold',
    color: '#70f0c5',
    letterSpacing: 1,
  },

  aiStand: {
    width: 35,
    height: 15,
    backgroundColor: '#28343a',
    borderWidth: 2,
    borderColor: '#101418',
  },

  interactivePressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
})