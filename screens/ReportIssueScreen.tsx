import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';

const deviceTypes = ['Coffee Machine', 'Coffee Grinder', 'Other Equipment'];

const issueTypes = {
  'Coffee Machine': ['Not Working', 'Leaking Water', 'Other'],
  'Coffee Grinder': ['Not Grinding', 'Inconsistent Grind', 'Other'],
  'Other Equipment': ['Not Working', 'Damaged', 'Other'],
};

export default function ReportIssueScreen() {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');

  const submitIssue = () => {
    console.log('Submitting issue:', { selectedDevice, selectedIssue, description });
    // Here you would implement the logic to send the issue report to your backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>
      
      <Text style={styles.sectionTitle}>Select Device Type:</Text>
      {deviceTypes.map((device) => (
        <TouchableOpacity
          key={device}
          style={[
            styles.optionButton,
            selectedDevice === device && styles.selectedOption
          ]}
          onPress={() => {
            setSelectedDevice(device);
            setSelectedIssue('');
          }}
        >
          <Text style={styles.optionText}>{device}</Text>
        </TouchableOpacity>
      ))}

      {selectedDevice && (
        <>
          <Text style={styles.sectionTitle}>Select Issue Type:</Text>
          {issueTypes[selectedDevice].map((issue) => (
            <TouchableOpacity
              key={issue}
              style={[
                styles.optionButton,
                selectedIssue === issue && styles.selectedOption
              ]}
              onPress={() => setSelectedIssue(issue)}
            >
              <Text style={styles.optionText}>{issue}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Describe the Issue:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
        value={description}
        placeholder="Please provide more details about the issue..."
        accessibilityLabel="Issue description input"
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedDevice || !selectedIssue || !description) && styles.disabledButton
        ]}
        onPress={submitIssue}
        disabled={!selectedDevice || !selectedIssue || !description}
      >
        <Text style={styles.submitButtonText}>Submit Issue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});