import { View, StyleSheet } from 'react-native'
import { getScreenDimensions, scaleFontSize, scaleSpacing } from '../utils/responsive'

/**
 * 2D stylized interrogation room background
 * Creates a scene with desk, chair, lamp using geometric shapes
 */
export function InterrogationRoomBackground() {
  const { width, height } = getScreenDimensions()
  const isWideScreen = width >= 768

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0a0a',
      overflow: 'hidden',
    },
    // Back wall
    backWall: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: isWideScreen ? '50%' : '35%',
      backgroundColor: '#1a1a1a',
      borderBottomWidth: 3,
      borderBottomColor: '#2a2a2a',
    },
    // Floor
    floor: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: isWideScreen ? '50%' : '65%',
      backgroundColor: '#0f0f0f',
      borderTopWidth: 2,
      borderTopColor: '#1a1a1a',
    },
    // Desk
    deskContainer: {
      position: 'absolute',
      bottom: isWideScreen ? '15%' : '10%',
      left: '50%',
      transform: [{ translateX: -120 }],
      width: 240,
      height: 120,
      zIndex: 2,
    },
    deskTop: {
      width: '100%',
      height: '40%',
      backgroundColor: '#3d2817',
      borderBottomWidth: 2,
      borderBottomColor: '#2a1a0f',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 10,
    },
    deskLeftLeg: {
      position: 'absolute',
      bottom: 0,
      left: '10%',
      width: '12%',
      height: '60%',
      backgroundColor: '#2a1a0f',
    },
    deskRightLeg: {
      position: 'absolute',
      bottom: 0,
      right: '10%',
      width: '12%',
      height: '60%',
      backgroundColor: '#2a1a0f',
    },
    // Chair
    chairContainer: {
      position: 'absolute',
      bottom: isWideScreen ? '20%' : '15%',
      left: isWideScreen ? '10%' : '15%',
      width: 100,
      height: 130,
      zIndex: 1,
    },
    chairBack: {
      width: '100%',
      height: '65%',
      backgroundColor: '#4a4a4a',
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#666',
    },
    chairSeat: {
      position: 'absolute',
      bottom: '10%',
      left: 0,
      width: '100%',
      height: '35%',
      backgroundColor: '#555',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 5,
    },
    // Lamp
    lampContainer: {
      position: 'absolute',
      top: isWideScreen ? '15%' : '20%',
      right: isWideScreen ? '20%' : '12%',
      width: 50,
      height: 120,
      zIndex: 1,
    },
    lampStand: {
      position: 'absolute',
      bottom: '30%',
      left: '45%',
      width: '10%',
      height: '70%',
      backgroundColor: '#1a1a1a',
    },
    lampHead: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: [{ translateX: -25 }],
      width: 50,
      height: 40,
      backgroundColor: '#ffd700',
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#ffed4e',
      shadowColor: '#ffd700',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 12,
      elevation: 8,
    },
    // Glow effect from lamp
    lampGlow: {
      position: 'absolute',
      top: isWideScreen ? '15%' : '20%',
      right: isWideScreen ? '20%' : '12%',
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: 'rgba(255, 215, 0, 0.08)',
    },
  })

  return (
    <View style={styles.container}>
      {/* Wall */}
      <View style={styles.backWall} />
      
      {/* Floor */}
      <View style={styles.floor} />

      {/* Lamp glow */}
      <View style={styles.lampGlow} />

      {/* Lamp */}
      <View style={styles.lampContainer}>
        <View style={styles.lampStand} />
        <View style={styles.lampHead} />
      </View>

      {/* Chair */}
      <View style={styles.chairContainer}>
        <View style={styles.chairBack} />
        <View style={styles.chairSeat} />
      </View>

      {/* Desk */}
      <View style={styles.deskContainer}>
        <View style={styles.deskTop} />
        <View style={styles.deskLeftLeg} />
        <View style={styles.deskRightLeg} />
      </View>
    </View>
  )
}
