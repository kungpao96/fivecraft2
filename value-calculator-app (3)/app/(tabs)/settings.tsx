import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useCalculatorStore } from '@/store/calculator-store';
import SettingsItem from '@/components/SettingsItem';
import BrandHeader from '@/components/BrandHeader';
import { Check, X } from 'lucide-react-native';

export default function SettingsScreen() {
  const { settings, updateSettings } = useCalculatorStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'decimalPlaces' | 'defaultOperation' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const openModal = (type: 'decimalPlaces' | 'defaultOperation') => {
    setModalType(type);
    setTempValue(
      type === 'decimalPlaces' 
        ? settings.decimalPlaces.toString() 
        : settings.defaultOperation
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  const saveModal = () => {
    if (modalType === 'decimalPlaces') {
      const decimalPlaces = parseInt(tempValue, 10);
      if (!isNaN(decimalPlaces) && decimalPlaces >= 0 && decimalPlaces <= 10) {
        updateSettings({ decimalPlaces });
      }
    } else if (modalType === 'defaultOperation') {
      updateSettings({ 
        defaultOperation: tempValue as 'add' | 'subtract' | 'multiply' | 'divide' 
      });
    }
    closeModal();
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'decimalPlaces':
        return 'Decimal Places';
      case 'defaultOperation':
        return 'Default Operation';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BrandHeader />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Settings</Text>
          <View style={styles.card}>
            <SettingsItem
              title="Decimal Places"
              description="Number of decimal places to show"
              type="select"
              value={settings.decimalPlaces}
              onPress={() => openModal('decimalPlaces')}
            />
            <SettingsItem
              title="Default Operation"
              description="Default operation for new ingredients"
              type="select"
              value={settings.defaultOperation.charAt(0).toUpperCase() + settings.defaultOperation.slice(1)}
              onPress={() => openModal('defaultOperation')}
            />
            <SettingsItem
              title="Show Operation Labels"
              description="Display operation names in inputs"
              type="switch"
              value={settings.showOperationLabels}
              onValueChange={(value) => updateSettings({ showOperationLabels: value })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingsItem
              title="Version"
              type="input"
              value="1.0.0"
            />
          </View>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <Pressable style={styles.modalCloseButton} onPress={closeModal}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>
            
            {modalType === 'decimalPlaces' ? (
              <TextInput
                style={styles.modalInput}
                value={tempValue}
                onChangeText={setTempValue}
                keyboardType="numeric"
                autoFocus
              />
            ) : (
              <View style={styles.operationSelector}>
                {['add', 'subtract', 'multiply', 'divide'].map((op) => (
                  <Pressable
                    key={op}
                    style={[
                      styles.operationOption,
                      tempValue === op && styles.selectedOperation
                    ]}
                    onPress={() => setTempValue(op)}
                  >
                    <Text 
                      style={[
                        styles.operationText,
                        tempValue === op && styles.selectedOperationText
                      ]}
                    >
                      {op.charAt(0).toUpperCase() + op.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            
            <Pressable style={styles.modalSaveButton} onPress={saveModal}>
              <Check size={20} color={Colors.light.card} />
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.subtext,
    marginBottom: 8,
    marginLeft: 8,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  operationSelector: {
    marginBottom: 24,
  },
  operationOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.light.background,
  },
  selectedOperation: {
    backgroundColor: Colors.light.primary,
  },
  operationText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedOperationText: {
    color: Colors.light.card,
    fontWeight: 'bold',
  },
  modalSaveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalSaveButtonText: {
    color: Colors.light.card,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});