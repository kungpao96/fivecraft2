import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import Colors from '@/constants/colors';

interface SettingsItemProps {
  title: string;
  description?: string;
  type: 'switch' | 'select' | 'input';
  value: any;
  onPress?: () => void;
  onValueChange?: (value: any) => void;
}

export default function SettingsItem({
  title,
  description,
  type,
  value,
  onPress,
  onValueChange,
}: SettingsItemProps) {
  const renderControl = () => {
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
            thumbColor={value ? Colors.light.card : Colors.light.card}
          />
        );
      case 'select':
      case 'input':
        return (
          <Text style={styles.valueText}>{value}</Text>
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      disabled={type === 'switch' || !onPress}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={styles.control}>
        {renderControl()}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  control: {
    marginLeft: 16,
  },
  valueText: {
    fontSize: 16,
    color: Colors.light.primary,
  },
});