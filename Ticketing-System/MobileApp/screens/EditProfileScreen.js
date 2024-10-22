import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height: initialHeight, width: initialWidth } = Dimensions.get('window');

const EditProfileModal = ({ visible, onClose, profileData, onSave }) => {
  const [profile, setProfile] = useState(profileData);

  const updateProfile = async () => {
    try {
      onSave(profile);
      Alert.alert('Success', 'Profile updated successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={profile.firstName}
            onChangeText={(text) => setProfile({ ...profile, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Middle Name"
            value={profile.middleName}
            onChangeText={(text) => setProfile({ ...profile, middleName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={profile.lastName}
            onChangeText={(text) => setProfile({ ...profile, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={profile.contactNumber}
            onChangeText={(text) => setProfile({ ...profile, contactNumber: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Birthdate (YYYY-MM-DD)"
            value={profile.birthdate}
            onChangeText={(text) => setProfile({ ...profile, birthdate: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={profile.address}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
          />

          {/* Reporter Type - Display only */}
          <View style={styles.reporterContainer}>
            <Text style={styles.label}>Reporter Type</Text>
            <Text style={styles.reporterText}>{profile.reporterType || 'N/A'}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={updateProfile} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    birthdate: '',
    reporterType: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Use the navigation hook
  const route = useRoute();

  const getTokenWithRetry = async () => {
    let token = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      token = await AsyncStorage.getItem('authToken');
      if (token && token !== 'null' && token !== '') break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return token;
  };

  const fetchProfileData = async () => {
    const token = await getTokenWithRetry();
    const userId = route?.params?.userId || await AsyncStorage.getItem('userId');
    const userType = route?.params?.userType || await AsyncStorage.getItem('userType');

    if (!userId || !userType || !token) {
      setError('User information or token not found. Please log in again.');
      setLoading(false);
      Alert.alert('Session Expired', 'User information or token not found. Please log in again.');
      return;
    }

    const endpoint =
      userType === 'employee'
        ? `http://10.0.2.2:8080/EmployeeService/employee/${userId}`
        : `http://10.0.2.2:8080/StudentService/student/${userId}`;

    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set profile data including reporterType (based on userType)
      setProfile({
        ...response.data,
        reporterType: userType, // Set reporterType based on logged-in user type
      });
    } catch (error) {
      setError('An error occurred while fetching profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async (updatedProfile) => {
    setProfile(updatedProfile);
    const token = await getTokenWithRetry();
    const userId = await AsyncStorage.getItem('userId');
    const userType = await AsyncStorage.getItem('userType');
    const endpoint =
      userType === 'employee'
        ? `http://10.0.2.2:8080/EmployeeService/employee/update/${userId}`
        : `http://10.0.2.2:8080/StudentService/student/update/${userId}`;

    try {
      await axios.put(endpoint, updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../assets/login.png')}
        style={[styles.background, { width: initialWidth, height: initialHeight }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileOuterContainer}>
            <View style={styles.profileInnerContainer}>
              <View style={styles.row}>
                <View style={styles.inputColumnThree}>
                  <Text style={styles.label}>First Name</Text>
                  <Text style={styles.value}>{profile.firstName || 'N/A'}</Text>
                </View>
                <View style={styles.inputColumnThree}>
                  <Text style={styles.label}>Middle Name</Text>
                  <Text style={styles.value}>{profile.middleName || 'N/A'}</Text>
                </View>
                <View style={styles.inputColumnThree}>
                  <Text style={styles.label}>Last Name</Text>
                  <Text style={styles.value}>{profile.lastName || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputColumn}>
                  <Text style={styles.label}>Contact Number</Text>
                  <Text style={styles.value}>{profile.contactNumber || 'N/A'}</Text>
                </View>
                {route?.params?.userType === 'student' && (
                  <View style={styles.inputColumn}>
                    <Text style={styles.label}>Student Number</Text>
                    <Text style={styles.value}>{profile.studentNumber || 'N/A'}</Text>
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.inputColumn}>
                  <Text style={styles.label}>Birthdate</Text>
                  <Text style={styles.value}>{profile.birthdate || 'N/A'}</Text>
                </View>
                <View style={styles.inputColumn}>
                  <Text style={styles.label}>Reporter</Text>
                  <Text style={styles.value}>{profile.reporterType || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.rowSingle}>
                <View style={styles.inputColumnLong}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{profile.email || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.rowSingle}>
                <View style={styles.inputColumnLong}>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.value}>{profile.address || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <EditProfileModal
            visible={modalVisible}
            profileData={profile}
            onClose={() => setModalVisible(false)}
            onSave={saveProfileData}
          />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileInnerContainer: {
    width: '85%',
    padding: '6%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
