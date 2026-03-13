// frontend/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Input from '../components/input';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { apiRequest } from '../utils/api';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
  const authToken = route.params?.token || null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!authToken) {
      Alert.alert('Error', 'Not authenticated.');
      navigation.goBack();
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await apiRequest('/api/users/profile', 'GET', authToken);
      if (ok) {
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      } else {
        Alert.alert('Error', data?.msg || 'Failed to load profile.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Name and Phone are required.');
      return;
    }
    setSaving(true);
    try {
      const { ok, data } = await apiRequest('/api/users/profile', 'PUT', authToken, { name, phone });
      if (ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', data?.msg || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.backgroundGradient}>
        <GlassCard style={styles.card}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.appName}>🛡️ Raksha</Text>
          <Text style={styles.title}>My Profile</Text>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="Email address"
            value={email}
            editable={false}
            style={styles.disabledInput}
          />
          <Text style={styles.emailNote}>Email cannot be changed.</Text>
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#555' },
  card: { width: width * 0.9, maxWidth: 450, padding: 30, alignItems: 'center' },
  backButton: { alignSelf: 'flex-start', marginBottom: 10 },
  backButtonText: { color: '#FF6347', fontSize: 16, fontWeight: '600' },
  appName: { fontSize: 28, fontWeight: '800', color: '#FF6347', marginBottom: 4, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#333', marginBottom: 25, textAlign: 'center' },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#999' },
  emailNote: { fontSize: 12, color: '#999', alignSelf: 'flex-start', marginTop: -14, marginBottom: 10 },
});

export default ProfileScreen;
