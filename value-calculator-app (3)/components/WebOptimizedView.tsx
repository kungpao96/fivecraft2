import React from 'react';
import { View, Platform, ViewProps } from 'react-native';

/**
 * A component that applies web-specific optimizations to its children
 * This helps with rendering performance on web platforms
 */
export default function WebOptimizedView({ 
  children, 
  style, 
  ...props 
}: ViewProps) {
  // Web-specific styles that improve rendering performance
  const webStyles = Platform.OS === 'web' ? {
    // These properties help with browser rendering performance
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  } : {};

  return (
    <View 
      style={[style, webStyles]} 
      {...props}
    >
      {children}
    </View>
  );
}