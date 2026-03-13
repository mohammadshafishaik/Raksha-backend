// frontend/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions, TouchableOpacity } from 'react-native';
import Input from '../components/input';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { apiRequest } from '../utils/api';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await apiRequest('/api/users/register', 'POST', null, {
        name, email, password, phone,
      });

      if (ok) {
        Alert.alert('Success', 'Registration successful! You can now log in.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', data?.msg || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Could not connect to the server. Please ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.backgroundGradient}>
        <GlassCard style={styles.card}>
          <Text style={styles.appName}>🛡️ Raksha</Text>
          <Text style={styles.title}>Create Account</Text>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title={loading ? 'Registering...' : 'Register'}
            onPress={handleRegister}
            disabled={loading}
          />

          <View style={styles.loginTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Login here</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    paddingVertical: 40,
  },
  card: {
    width: width * 0.9,
    maxWidth: 450,
    padding: 30,
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6347',
    marginBottom: 5,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  loginTextContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  loginText: {
    fontSize: 15,
    color: '#555',
  },
  loginLink: {
    fontSize: 15,
    color: '#FF6347',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
