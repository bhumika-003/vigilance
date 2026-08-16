import { Dimensions, Platform } from 'react-native'

const BREAKPOINTS = {
  SMALL_PHONE: 375,
  TABLET: 768,
  DESKTOP: 1024,
}

/**
 * Get current screen dimensions
 */
export function getScreenDimensions() {
  return Dimensions.get('window')
}

/**
 * Determine device type based on screen width
 */
export function getDeviceType() {
  const { width } = getScreenDimensions()
  if (width >= BREAKPOINTS.DESKTOP) return 'desktop'
  if (width >= BREAKPOINTS.TABLET) return 'tablet'
  return 'phone'
}

/**
 * Scale font sizes responsively
 * Base size for phone (375px), scales up for larger screens
 */
export function scaleFontSize(baseSize: number) {
  const { width } = getScreenDimensions()
  const baseWidth = BREAKPOINTS.SMALL_PHONE
  
  // Scale proportionally based on width
  const scale = width / baseWidth
  return Math.round(baseSize * Math.min(scale, 1.4)) // Cap scaling at 1.4x
}

/**
 * Scale spacing/padding responsively
 */
export function scaleSpacing(baseSpacing: number) {
  const { width } = getScreenDimensions()
  const baseWidth = BREAKPOINTS.SMALL_PHONE
  
  const scale = width / baseWidth
  return Math.round(baseSpacing * Math.min(scale, 1.5)) // Cap at 1.5x
}

/**
 * Get responsive padding for containers
 */
export function getContainerPadding() {
  const { width } = getScreenDimensions()
  
  if (width >= BREAKPOINTS.DESKTOP) return { h: 32, v: 24 }
  if (width >= BREAKPOINTS.TABLET) return { h: 24, v: 20 }
  return { h: 16, v: 16 }
}

/**
 * Get responsive margin
 */
export function getResponsiveMargin() {
  const { width } = getScreenDimensions()
  
  if (width >= BREAKPOINTS.DESKTOP) return 32
  if (width >= BREAKPOINTS.TABLET) return 24
  return 16
}

/**
 * Get responsive border radius
 */
export function getResponsiveBorderRadius() {
  const { width } = getScreenDimensions()
  
  if (width >= BREAKPOINTS.DESKTOP) return 16
  if (width >= BREAKPOINTS.TABLET) return 12
  return 8
}

/**
 * Get responsive avatar size
 */
export function getAvatarSize() {
  const { width } = getScreenDimensions()
  
  if (width >= BREAKPOINTS.DESKTOP) return 120
  if (width >= BREAKPOINTS.TABLET) return 100
  return 80
}

/**
 * Get max width for content (prevents over-stretching on desktop)
 */
export function getMaxContentWidth() {
  const { width } = getScreenDimensions()
  
  if (width >= BREAKPOINTS.DESKTOP) return Math.min(width - 64, 900)
  return width - 32
}

/**
 * Get line height scale based on font size
 */
export function getLineHeight(fontSize: number) {
  if (fontSize >= 24) return fontSize * 1.3
  if (fontSize >= 16) return fontSize * 1.5
  return fontSize * 1.6
}

/**
 * Determine if running on web or native
 */
export const isWeb = Platform.OS === 'web'
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android'
