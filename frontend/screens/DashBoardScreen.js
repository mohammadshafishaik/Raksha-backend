// frontend/screens/DashBoardScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity,
  ActivityIndicator, ScrollView, Linking, Modal, TextInput, Platform
} from 'react-native';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import MapView, { Marker, UrlTile, Polygon } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fetchNearbyPlaces } from '../utils/osmPlaces';
import { apiRequest, BACKEND_BASE_URL } from '../utils/api';
import * as Notifications from 'expo-notifications';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LOCATION_TRACKING_TASK = 'location-tracking-task';

TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const latestLocation = locations[0];
    console.log('Background location update:', latestLocation);
  }
});

const DashboardScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [isContactsLoading, setIsContactsLoading] = useState(false);

  const [authToken, setAuthToken] = useState(route.params?.token || null);

  const [policeStations, setPoliceStations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [fireStations, setFireStations] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [dangerZones, setDangerZones] = useState([]);
  const [isInDangerZone, setIsInDangerZone] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);

  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactFormLoading, setContactFormLoading] = useState(false);

  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    if (route.params?.token && route.params.token !== authToken) {
      setAuthToken(route.params.token);
    }
  }, [route.params?.token]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Location Permission Required', 'Please grant location access to use safety features.');
        return;
      }

      let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        Alert.alert('Background Location', 'Background location is recommended for continuous tracking.');
      }

      startForegroundLocationUpdates();
    })();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchTrustedContacts();
    }

    const loadNearbyData = async () => {
      if (location && authToken) {
        setIsPlacesLoading(true);
        try {
          const lat = location.coords.latitude;
          const lng = location.coords.longitude;

          const [police, hospital, fire, pharmacy] = await Promise.all([
            fetchNearbyPlaces(lat, lng, 'police'),
            fetchNearbyPlaces(lat, lng, 'hospital'),
            fetchNearbyPlaces(lat, lng, 'fire_station'),
            fetchNearbyPlaces(lat, lng, 'pharmacy'),
          ]);

          setPoliceStations(police);
          setHospitals(hospital);
          setFireStations(fire);
          setPharmacies(pharmacy);

          const { ok, data } = await apiRequest('/api/dangerzones', 'GET', authToken);
          if (ok) {
            setDangerZones(data);
          }
        } catch (error) {
          console.error('Error loading nearby data:', error);
        } finally {
          setIsPlacesLoading(false);
        }
      }
    };

    loadNearbyData();
  }, [location, authToken]);

  useEffect(() => {
    if (location && dangerZones.length > 0) {
      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;
      let userInDanger = false;
      for (const zone of dangerZones) {
        if (isPointInPolygon([userLat, userLng], zone.coordinates)) {
          userInDanger = true;
          break;
        }
      }
      setIsInDangerZone(userInDanger);
      if (userInDanger) {
        Alert.alert('WARNING!', 'You are currently in a potentially unsafe area. Please be vigilant.', [{ text: 'OK' }]);
      }
    }
  }, [location, dangerZones]);

  const isPointInPolygon = (point, polygon) => {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const startForegroundLocationUpdates = async () => {
    try {
      locationSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (newLocation) => {
          setLocation(newLocation);
          sendLocationToBackend(newLocation.coords.latitude, newLocation.coords.longitude);
        }
      );
      setIsTracking(true);
    } catch (error) {
      console.error('Error starting location updates:', error);
      setErrorMsg('Could not start location tracking.');
    }
  };

  const stopForegroundLocationUpdates = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      setIsTracking(false);
    }
  };

  const sendLocationToBackend = async (latitude, longitude) => {
    if (!authToken) return;
    try {
      await apiRequest('/api/safety/location', 'PUT', authToken, { latitude, longitude });
    } catch (error) {
      console.error('Error sending location to backend:', error);
    }
  };

  const handleSOS = async () => {
    setSosLoading(true);
    if (!authToken) {
      Alert.alert('Error', 'You must be logged in to send an SOS alert.');
      setSosLoading(false);
      return;
    }
    await fetchTrustedContacts();
    try {
      const { ok, data } = await apiRequest('/api/safety/sos', 'POST', authToken);
      if (ok) {
        Alert.alert('SOS Sent!', 'Your trusted contacts have been notified.');
      } else {
        Alert.alert('SOS Failed', data?.msg || 'Could not send SOS alert.');
      }
    } catch (error) {
      console.error('SOS error:', error);
      Alert.alert('Error', 'Could not connect to the server for SOS. Please try again later.');
    } finally {
      setSosLoading(false);
    }
  };

  const fetchTrustedContacts = async () => {
    if (!authToken) return;
    setIsContactsLoading(true);
    try {
      const { ok, data } = await apiRequest('/api/safety/trusted-contacts', 'GET', authToken);
      if (ok) setTrustedContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsContactsLoading(false);
    }
  };

  const openAddContactModal = () => {
    setCurrentContact(null);
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setIsContactModalVisible(true);
  };

  const openEditContactModal = (contact) => {
    setCurrentContact(contact);
    setContactName(contact.name);
    setContactPhone(contact.phone || '');
    setContactEmail(contact.email || '');
    setIsContactModalVisible(true);
  };

  const handleSaveContact = async () => {
    if (!contactName || (!contactPhone && !contactEmail)) {
      Alert.alert('Error', 'Name and at least one of Phone or Email are required.');
      return;
    }
    setContactFormLoading(true);
    try {
      const contactData = { name: contactName, phone: contactPhone, email: contactEmail };
      const path = currentContact
        ? `/api/safety/trusted-contacts/${currentContact._id}`
        : '/api/safety/trusted-contacts';
      const method = currentContact ? 'PUT' : 'POST';

      const { ok, data } = await apiRequest(path, method, authToken, contactData);
      if (ok) {
        Alert.alert('Success', `Contact ${currentContact ? 'updated' : 'added'}!`);
        setIsContactModalVisible(false);
        fetchTrustedContacts();
      } else {
        Alert.alert('Error', data?.msg || `Failed to ${currentContact ? 'update' : 'add'} contact.`);
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Could not connect to server to save contact.');
    } finally {
      setContactFormLoading(false);
    }
  };

  const handleDeleteContact = (contactId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!authToken) return;
          try {
            const { ok, data } = await apiRequest(
              `/api/safety/trusted-contacts/${contactId}`, 'DELETE', authToken
            );
            if (ok) {
              Alert.alert('Success', 'Contact deleted!');
              fetchTrustedContacts();
            } else {
              Alert.alert('Error', data?.msg || 'Failed to delete contact.');
            }
          } catch (error) {
            console.error('Error deleting contact:', error);
          }
        },
      },
    ]);
  };

  const handlePoliceCall = () => {
    const phoneNumber = 'tel:100';
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'Phone call not supported on this device or emulator.');
        } else {
          Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const registerForPushNotificationsAsync = async (token) => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Push Notifications', 'Failed to get push token. Please enable notifications in settings.');
      return;
    }
    const pushToken = (await Notifications.getExpoPushTokenAsync()).data;

    if (pushToken && token) {
      try {
        await apiRequest('/api/notifications/token', 'POST', token, { token: pushToken });
        console.log('Push token registered successfully.');
      } catch (error) {
        console.error('Error sending push token to backend:', error);
      }
    }
  };

  useEffect(() => {
    if (authToken) {
      registerForPushNotificationsAsync(authToken);

      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        Alert.alert(
          notification.request.content.title,
          notification.request.content.body,
          [{ text: 'OK' }]
        );
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }
  }, [authToken]);

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Lat: ${location.coords.latitude.toFixed(5)}, Lng: ${location.coords.longitude.toFixed(5)}`;
  }

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.backgroundGradient}>
          <GlassCard style={styles.card}>
            <Text style={styles.priorityQuote}>Your Safety, Our Priority.</Text>
            <Text style={styles.realTimeProtection}>Real-Time Protection.</Text>
            <Text style={styles.title}>Safety Dashboard</Text>

            {isInDangerZone && (
              <View style={styles.dangerAlertContainer}>
                <MaterialIcons name="warning" size={24} color="white" />
                <Text style={styles.dangerAlertText}>WARNING: You are in a danger zone!</Text>
              </View>
            )}

            <Text style={styles.locationText}>{text}</Text>

            {isPlacesLoading && <ActivityIndicator size="large" color="#FF6347" style={{ marginBottom: 10 }} />}

            {location && (
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
              >
                <UrlTile
                  urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
                <Marker
                  coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                  title="Your Location"
                  description="This is your current position"
                  pinColor="blue"
                />
                {policeStations.map((place) => (
                  <Marker key={place.place_id}
                    coordinate={{ latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }}
                    title={place.name} description={place.vicinity} pinColor="#007bff"
                  />
                ))}
                {hospitals.map((place) => (
                  <Marker key={place.place_id}
                    coordinate={{ latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }}
                    title={place.name} description={place.vicinity} pinColor="#dc3545"
                  />
                ))}
                {fireStations.map((place) => (
                  <Marker key={place.place_id}
                    coordinate={{ latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }}
                    title={place.name} description={place.vicinity} pinColor="#FFA500"
                  />
                ))}
                {pharmacies.map((place) => (
                  <Marker key={place.place_id}
                    coordinate={{ latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }}
                    title={place.name} description={place.vicinity} pinColor="#32CD32"
                  />
                ))}
                {dangerZones.map((zone) => (
                  <Polygon
                    key={zone._id}
                    coordinates={zone.coordinates.map(coord => ({ latitude: coord[0], longitude: coord[1] }))}
                    strokeColor={zone.severity === 'high' ? '#FF0000' : zone.severity === 'medium' ? '#FFA500' : '#FFFF00'}
                    fillColor={zone.severity === 'high' ? 'rgba(255,0,0,0.3)' : zone.severity === 'medium' ? 'rgba(255,165,0,0.3)' : 'rgba(255,255,0,0.3)'}
                    strokeWidth={2}
                  />
                ))}
              </MapView>
            )}

            {/* Action Buttons */}
            <Button title="Quick Police Call" onPress={handlePoliceCall}
              style={styles.policeCallButton} textStyle={styles.policeCallButtonText} />

            <Button
              title={sosLoading ? 'Sending SOS...' : '🚨 SOS Panic Button'}
              onPress={handleSOS} disabled={sosLoading}
              style={styles.sosButton} textStyle={styles.sosButtonText}
            />

            {/* New Features Navigation */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>More Features</Text>
              <View style={styles.featuresRow}>
                <TouchableOpacity
                  style={styles.featureButton}
                  onPress={() => navigation.navigate('ReportIncident', { token: authToken })}
                >
                  <MaterialIcons name="report-problem" size={28} color="#FF6347" />
                  <Text style={styles.featureButtonText}>Report Incident</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.featureButton}
                  onPress={() => navigation.navigate('Profile', { token: authToken })}
                >
                  <MaterialIcons name="person" size={28} color="#4682B4" />
                  <Text style={styles.featureButtonText}>My Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Trusted Contacts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trusted Contacts</Text>
              <Button title="Add New Contact" onPress={openAddContactModal} style={styles.addContactButton} />
              {isContactsLoading ? (
                <ActivityIndicator size="small" color="#FF6347" />
              ) : trustedContacts.length > 0 ? (
                <View style={styles.contactList}>
                  {trustedContacts.map((contact) => (
                    <View key={contact._id} style={styles.contactItem}>
                      <View>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        {contact.phone && <Text style={styles.contactDetail}>📞 {contact.phone}</Text>}
                        {contact.email && <Text style={styles.contactDetail}>✉️ {contact.email}</Text>}
                      </View>
                      <View style={styles.contactActions}>
                        <TouchableOpacity onPress={() => openEditContactModal(contact)} style={styles.actionButton}>
                          <MaterialIcons name="edit" size={20} color="#4682B4" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteContact(contact._id)} style={styles.actionButton}>
                          <MaterialIcons name="delete" size={20} color="#DC143C" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noContactsText}>No trusted contacts added yet.</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => { navigation.navigate('Login'); }}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </ScrollView>

      {/* Contact Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isContactModalVisible}
        onRequestClose={() => setIsContactModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <GlassCard style={styles.modalView}>
            <Text style={styles.modalTitle}>{currentContact ? 'Edit Contact' : 'Add New Contact'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contact Name"
              value={contactName}
              onChangeText={setContactName}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone Number (Optional)"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Email (Optional)"
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
            <Button
              title={contactFormLoading ? 'Saving...' : 'Save Contact'}
              onPress={handleSaveContact}
              disabled={contactFormLoading}
              style={styles.modalSaveButton}
            />
            <Button
              title="Cancel"
              onPress={() => setIsContactModalVisible(false)}
              style={styles.modalCancelButton}
              textStyle={styles.modalCancelButtonText}
            />
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContentContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  backgroundGradient: { width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  card: { width: width * 0.9, maxWidth: 500, padding: 30, alignItems: 'center' },
  priorityQuote: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 4, textAlign: 'center' },
  realTimeProtection: { fontSize: 18, fontWeight: '600', color: '#FF6347', marginBottom: 18, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 20, textAlign: 'center' },
  locationText: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 12 },
  map: { width: '100%', height: 220, borderRadius: 10, marginBottom: 20, overflow: 'hidden' },
  sosButton: { backgroundColor: '#DC143C', shadowColor: '#DC143C', marginTop: 16, marginBottom: 10 },
  sosButtonText: { fontSize: 18 },
  policeCallButton: { backgroundColor: '#4682B4', shadowColor: '#4682B4', marginTop: 10 },
  policeCallButtonText: { fontSize: 16 },
  section: { width: '100%', marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 15, textAlign: 'center' },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  featureButton: {
    alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1, borderColor: '#e0e0e0', width: '44%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  featureButtonText: { fontSize: 13, color: '#333', marginTop: 6, fontWeight: '600', textAlign: 'center' },
  addContactButton: { backgroundColor: '#1E90FF', shadowColor: '#1E90FF', marginBottom: 15 },
  contactList: { width: '100%' },
  contactItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 10, borderRadius: 8, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  contactDetail: { fontSize: 14, color: '#666' },
  contactActions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { marginLeft: 10, padding: 5 },
  noContactsText: { fontSize: 15, color: '#777', textAlign: 'center', marginTop: 10 },
  logoutButton: {
    marginTop: 30, paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 20, borderWidth: 1, borderColor: '#FF6347', backgroundColor: 'transparent',
  },
  logoutButtonText: { color: '#FF6347', fontSize: 16, fontWeight: '600' },
  dangerAlertContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#DC143C', padding: 10,
    borderRadius: 8, marginBottom: 15, width: '100%', justifyContent: 'center',
  },
  dangerAlertText: { color: 'white', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    margin: 20, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 30,
    alignItems: 'center', width: '90%', maxWidth: 400,
  },
  modalTitle: { marginBottom: 18, textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: '#333' },
  modalInput: {
    height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, marginBottom: 12,
    paddingHorizontal: 15, width: '100%', fontSize: 16, backgroundColor: '#f9f9f9', color: '#333',
  },
  modalSaveButton: { backgroundColor: '#32CD32', shadowColor: '#32CD32', marginTop: 8 },
  modalCancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FF6347', marginTop: 8 },
  modalCancelButtonText: { color: '#FF6347' },
});

export default DashboardScreen;
