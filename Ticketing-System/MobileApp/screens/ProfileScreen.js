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

  const handleSave = () => {
    onSave(profile);
    onClose(); // Close modal after saving
  };

  const formatBirthdateForEdit = (birthdate) => {
    if (!birthdate) return ''; // Handle empty or undefined cases
    const date = new Date(birthdate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
            placeholder="Birthdate"
            value={formatBirthdateForEdit(profile.birthdate)} // Format the birthdate
            onChangeText={(text) => setProfile({ ...profile, birthdate: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            value={profile.address}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
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
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const navigation = useNavigation();
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

    setUserId(userId);
    setUserType(userType);

    const endpoint =
      userType === 'employee'
        ? `http://10.0.2.2:8080/EmployeeService/employee/${userId}`
        : `http://10.0.2.2:8080/StudentService/student/${userId}`;

    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      setError('An error occurred while fetching profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async (updatedProfile) => {
    setProfile(updatedProfile); // Update the profile in state
    const token = await getTokenWithRetry();
    const userId = route?.params?.userId || await AsyncStorage.getItem('userId');
    const userType = route?.params?.userType || await AsyncStorage.getItem('userType');
    const endpoint =
      userType === 'employee'
        ? `http://10.0.2.2:8080/EmployeeService/employee/update/${userId}`
        : `http://10.0.2.2:8080/StudentService/student/update/${userId}`;

    try {
      await axios.put(endpoint, updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const formatBirthdate = (birthdate) => {
    if (!birthdate) return 'N/A'; // Handle null or undefined cases
  
    // Create a new Date object from the ISO string
    const date = new Date(birthdate);
  
    // Extract the year, month, and day from the date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
  
    // Return the formatted string in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  };
  
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
          {/* Add Profile Title */}
          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileOuterContainer}>
            <View style={styles.profileInnerContainer}>
              {/* Row 1: First Name, Middle Name, Last Name in 3 columns */}
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

              {/* Row 2: Contact Number and Student/Employee Number */}
              <View style={styles.row}>
                <View style={styles.inputColumn}>
                  <Text style={styles.label}>Contact Number</Text>
                  <Text style={styles.value}>{profile.contactNumber || 'N/A'}</Text>
                </View>
                {userType === 'student' && (
                  <View style={styles.inputColumn}>
                    <Text style={styles.label}>Student Number</Text>
                    <Text style={styles.value}>{profile.studentNumber || 'N/A'}</Text>
                  </View>
                )}
              </View>

              {/* Row 3: Birthdate and Reporter */}
              <View style={styles.row}>
  <View style={styles.inputColumn}>
    <Text style={styles.label}>Birthdate</Text>
    <Text style={styles.value}>{formatBirthdate(profile.birthdate)}</Text>
  </View>
  <View style={styles.inputColumn}>
    <Text style={styles.label}>Reporter</Text>
    <Text style={styles.value}>{userType}</Text>
  </View>
</View>


              {/* Row 4: Email (longer input box for solo line) */}
              <View style={styles.rowSingle}>
                <View style={styles.inputColumnLong}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{profile.email || 'N/A'}</Text>
                </View>
              </View>

              {/* Row 5: Address */}
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

          {/* Edit Profile Modal */}
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
    paddingBottom: 40, // Add padding to ensure button is visible
    alignItems: 'center',
  },
  background: {
    justifyContent: 'center',
    marginTop: 90,
  },
  topBox: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: initialHeight * 0.07,
    backgroundColor: '#0C356A',
    zIndex: 1000,
  },
  logo: {
    width: initialWidth * 0.5,
    height: '100%',
    marginLeft: 10,
    resizeMode: 'contain',
  },
  profileOuterContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  profileInnerContainer: {
    width: '90%',
    padding: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 60,
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '107%',
    height: 55,
    marginBottom: initialHeight * 0.01,
  },
  rowSingle: {
    width: '107%',
    marginBottom: initialHeight * 0.01,
  },
  inputColumn: {
    width: '47%',
  },
  inputColumnThree: {
    width: '30%',
  },
  inputColumnLong: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 13,
    color: '#555',
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  editProfileButton: {
    width: '50%',
    padding: 5,
    backgroundColor: '#0000FF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: initialHeight * 0.03,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark transparent background
  },
  // Modal Content Box
  modalContent: {
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',               // White background for modal
    padding: 10,                           // Padding inside the modal
    borderRadius: 5,                      // Rounded corners
    shadowColor: '#000',                   // Shadow settings for depth

  },
  // Modal Title Text Styling
  modalTitle: {
    fontSize: 20,                          // Larger text for the title
    fontWeight: 'bold',                    // Bold font
    marginBottom: 10,                      // Margin below title
    textAlign: 'center',                   // Center the title
    color: '#333',                         // Darker text color
  },
  // Input Field Styling
  input: {
    width: '100%',                         // Full width input
    borderColor: '#ccc',                   // Light border
    borderWidth: 1,                        // Border width
    borderRadius: 5,                       // Rounded corners for input fields
    padding: 5,                           // Padding inside input fields
    backgroundColor: '#f9f9f9',            // Light background for inputs
    marginVertical: 5,                    // Vertical margin between inputs
  },
  // Button Container for Save/Cancel
  buttonContainer: {
    flexDirection: 'row',                  // Align buttons side-by-side
    justifyContent: 'space-between',       // Spread buttons apart
    marginTop: 20,                         // Space above the buttons
  },
  // Save Button Styling
  saveButton: {
    backgroundColor: '#0476D0',            // Green background
    padding: 15,                           // Padding inside the button
    borderRadius: 5,                       // Rounded corners for the button
    width: '45%',                          // Half-width of the modal
    alignItems: 'center',                  // Center text inside the button
  },
  // Text inside Save Button
  saveButtonText: {
    color: '#fff',                         // White text
    fontSize: 15,                          // Medium-sized text
  },
  // Cancel Button Styling
  cancelButton: {
    backgroundColor: '#d9534f',            // Red background for cancel button
    padding: 15,                           // Padding inside the button
    borderRadius: 5,                       // Rounded corners
    width: '45%',                          // Half-width of the modal
    alignItems: 'center',                  // Center text inside the button
  },
  // Text inside Cancel Button
  cancelButtonText: {
    color: '#fff',                         // White text for the button
    fontSize: 15,                          // Medium-sized text
  },
});

export default ProfileScreen;
