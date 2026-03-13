// frontend/screens/ReportIncidentScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Dimensions, TouchableOpacity
} from 'react-native';
import Input from '../components/input';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { apiRequest } from '../utils/api';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const INCIDENT_TYPES = ['Harassment', 'Theft', 'Assault', 'Suspicious Activity', 'Road Accident', 'Fire', 'Medical Emergency', 'Other'];

const ReportIncidentScreen = ({ navigation, route }) => {
  const authToken = route.params?.token || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);

  const handleDetectLocation = async () => {
    setFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setDetectedLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      Alert.alert('Location Detected', `Lat: ${loc.coords.latitude.toFixed(5)}, Lng: ${loc.coords.longitude.toFixed(5)}`);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Could not get your location.');
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !selectedType) {
      Alert.alert('Error', 'Please fill in all required fields and select an incident type.');
      return;
    }
    if (!authToken) {
      Alert.alert('Error', 'You must be logged in to report an incident.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        incidentType: selectedType,
        location: detectedLocation,
      };

      const { ok, data } = await apiRequest('/api/incidents', 'POST', authToken, payload);
      if (ok) {
        Alert.alert('Report Submitted', 'Thank you for reporting. Stay safe!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', data?.msg || 'Failed to submit report.');
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.backgroundGradient}>
        <GlassCard style={styles.card}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.appName}>🛡️ Raksha</Text>
          <Text style={styles.title}>Report an Incident</Text>
          <Text style={styles.subtitle}>Help keep your community safe by reporting incidents.</Text>

          <Input
            label="Title *"
            placeholder="Brief title of the incident"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Incident Type *</Text>
          <View style={styles.typeGrid}>
            {INCIDENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, selectedType === type && styles.typeChipSelected]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.typeChipText, selectedType === type && styles.typeChipTextSelected]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Description *"
            placeholder="Describe what happened..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
          />

          <Button
            title={fetchingLocation ? 'Detecting...' : detectedLocation ? '✅ Location Detected' : 'Detect My Location'}
            onPress={handleDetectLocation}
            disabled={fetchingLocation}
            style={detectedLocation ? styles.locationDetectedButton : styles.locationButton}
          />

          <Button
            title={loading ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
        </GlassCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundGradient: {
    flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f0f2f5', paddingVertical: 40,
  },
  card: { width: width * 0.9, maxWidth: 480, padding: 30, alignItems: 'center' },
  backButton: { alignSelf: 'flex-start', marginBottom: 10 },
  backButtonText: { color: '#FF6347', fontSize: 16, fontWeight: '600' },
  appName: { fontSize: 28, fontWeight: '800', color: '#FF6347', marginBottom: 4, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#333', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, color: '#333', marginBottom: 10, fontWeight: '600', alignSelf: 'flex-start' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20, width: '100%' },
  typeChip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9', marginBottom: 4,
  },
  typeChipSelected: { backgroundColor: '#FF6347', borderColor: '#FF6347' },
  typeChipText: { fontSize: 13, color: '#555' },
  typeChipTextSelected: { color: '#fff', fontWeight: 'bold' },
  descriptionInput: { height: 100, textAlignVertical: 'top' },
  locationButton: { backgroundColor: '#4682B4', shadowColor: '#4682B4', marginTop: 5 },
  locationDetectedButton: { backgroundColor: '#32CD32', shadowColor: '#32CD32', marginTop: 5 },
  submitButton: { marginTop: 10 },
});

export default ReportIncidentScreen;
