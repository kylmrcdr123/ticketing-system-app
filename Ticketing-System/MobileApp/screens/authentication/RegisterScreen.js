import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const RegisterStudent = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    studentNumber: '',
    employeeNumber: '',
    birthdate: '',
    userType: 'Student',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(initialWidth);
  const [screenHeight, setScreenHeight] = useState(initialHeight);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      setScreenWidth(width);
      setScreenHeight(height);
    });

    return () => subscription?.remove();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const {
        username,
        password,
        email,
        firstName,
        lastName,
        middleName,
        contactNumber,
        address,
        studentNumber,
        employeeNumber,
        birthdate,
        userType,
      } = formData;

      if (!username || !password || !email || !firstName || !lastName || !(studentNumber || employeeNumber)) {
        setErrorMessage('All required fields must be filled.');
        return;
      }

      if (contactNumber.length > 11) {
        setErrorMessage('Contact number must be at most 11 digits.');
        return;
      }

      const payload = {
        username,
        password,
        [userType === 'Student' ? 'student' : 'employee']: {
          email,
          firstName,
          lastName,
          middleName,
          contactNumber,
          address,
          studentNumber: userType === 'Student' ? studentNumber : undefined,
          employeeNumber: userType === 'Employee' ? employeeNumber : undefined,
          birthdate,
        },
        userType,
      };

      const response = await axios.post('http://10.0.2.2:8080/user/register', payload);
      setSuccessMessage('OTP has been sent to your email.');
      navigation.navigate('OtpScreen', { username });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectUserType = (type) => {
    setFormData({
      ...formData,
      userType: type,
      studentNumber: '',
      employeeNumber: '',
    });
    toggleModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../../assets/login.png')}
        style={[styles.background, { width: screenWidth, height: screenHeight }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <View style={styles.registerBox}>
            <Text style={styles.title}>Register</Text>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <View style={styles.userTypeContainer}>
  <TouchableOpacity style={styles.inputWithIcon} onPress={toggleModal}>
    <Text style={styles.inputText}>{formData.userType}</Text>
    <View style={styles.iconWrapper}>
      <Text style={styles.iconText}>▼</Text>
      {/* Replace this Text with an icon component like FontAwesome if needed */}
    </View>
  </TouchableOpacity>
</View>


            <Modal visible={isModalVisible} transparent={true} animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    <TouchableOpacity onPress={() => selectUserType('Student')} style={styles.modalOption}>
                      <Text style={styles.modalOptionText}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectUserType('Employee')} style={styles.modalOption}>
                      <Text style={styles.modalOptionText}>Employee</Text>
                    </TouchableOpacity>
                  </ScrollView>
                  <TouchableOpacity onPress={toggleModal} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Username"
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Middle Name"
                value={formData.middleName}
                onChangeText={(value) => handleChange('middleName', value)}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChangeText={(value) => handleChange('contactNumber', value)}
              />
              {formData.userType === 'Student' ? (
                <TextInput
                  style={styles.inputColumn}
                  placeholder="Student Number"
                  value={formData.studentNumber}
                  onChangeText={(value) => handleChange('studentNumber', value)}
                />
              ) : (
                <TextInput
                  style={styles.inputColumn}
                  placeholder="Employee Number"
                  value={formData.employeeNumber}
                  onChangeText={(value) => handleChange('employeeNumber', value)}
                />
              )}
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Birthdate (YYYY-MM-DD)"
                value={formData.birthdate}
                onChangeText={(value) => handleChange('birthdate', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Address"
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
              />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Already have an account? Click here</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  background: {
    justifyContent: 'center',
    marginTop: 40,
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '3%',

  },
  registerBox: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: initialWidth > 400 ? 28 : 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
    color: '#333',
  },
 
  inputColumn: {
    fontSize: 14,
    backgroundColor: '#fff',
    width: '47%',
    height: initialHeight * 0.06,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: initialHeight * 0.02,
    paddingHorizontal: initialWidth * 0.02,
  },

  registerButton: {
    width: '70%',
    height: initialHeight * 0.06,
    backgroundColor: '#2996f3',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: initialHeight * 0.02,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: initialHeight * 0.03,
  },
  loginLink: {
    color: '#0C356A',
    marginBottom: initialHeight * 0.02,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: initialHeight * 0.01,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: initialHeight * 0.01,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
  },
  modalCloseText: {
    color: '#007BFF',
    fontSize: 17,
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '45%', // Adjust width as needed
    height: initialHeight * 0.05,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: initialHeight * 0.02,
  },
  inputText: {
    fontSize: 16,
    color: '#3D3635',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#3D3635',
  },
});

export default RegisterStudent;
