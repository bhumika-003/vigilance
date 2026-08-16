import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Animated, Dimensions } from 'react-native'
import { useEffect, useRef } from 'react'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getLineHeight, getScreenDimensions } from '../utils/responsive'

type QuestionOption = {
  text: string
  targetsWeakLink: boolean
  rulingText: string
}

type QuestionSelectOverlayProps = {
  isOpen: boolean
  options: QuestionOption[]
  onClose: () => void
  onSelect: (option: QuestionOption) => void
}

const { height: screenHeight } = getScreenDimensions()

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: getResponsiveBorderRadius() + 8,
    borderTopRightRadius: getResponsiveBorderRadius() + 8,
    paddingTop: scaleSpacing(20),
    maxHeight: screenHeight * 0.8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSpacing(20),
    paddingBottom: scaleSpacing(16),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  label: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    paddingVertical: scaleSpacing(8),
    paddingHorizontal: scaleSpacing(16),
    backgroundColor: '#444',
    borderRadius: getResponsiveBorderRadius(),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: scaleFontSize(14),
    fontWeight: '500',
  },
  cardList: {
    paddingHorizontal: scaleSpacing(20),
    paddingVertical: scaleSpacing(16),
  },
  card: {
    backgroundColor: '#3a3a3a',
    borderRadius: getResponsiveBorderRadius(),
    padding: scaleSpacing(16),
    marginBottom: scaleSpacing(12),
    borderLeftWidth: 4,
    borderLeftColor: '#74c6a0',
  },
  cardIndex: {
    fontSize: scaleFontSize(12),
    color: '#74c6a0',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: scaleSpacing(8),
  },
  cardText: {
    fontSize: scaleFontSize(16),
    color: '#e0e0e0',
    lineHeight: getLineHeight(scaleFontSize(16)),
  },
})

export function QuestionSelectOverlay({
  isOpen,
  options,
  onClose,
  onSelect,
}: QuestionSelectOverlayProps) {
  const { height } = getScreenDimensions()
  const translateYAnim = useRef(new Animated.Value(height)).current

  useEffect(() => {
    if (isOpen) {
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        stiffness: 220,
        damping: 22,
      }).start()
    } else {
      Animated.timing(translateYAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.label}>Choose the question</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.cardList}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option, index) => (
              <Pressable
                key={option.text}
                onPress={() => onSelect(option)}
                style={({ pressed }) => ({
                  ...styles.card,
                  opacity: pressed ? 0.8 : 1,
                  transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                })}
              >
                <Text style={styles.cardIndex}>Q{index + 1}</Text>
                <Text style={styles.cardText}>{option.text}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
