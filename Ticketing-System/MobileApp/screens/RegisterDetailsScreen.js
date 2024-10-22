import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import axios from 'axios';
import TopBox from '../components/TopBox';

const { width, height } = Dimensions.get('window');

const RegisterDetailsScreen = ({ route, navigation }) => {
  const { username, email, password } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [studentOrEmployeeNumber, setStudentOrEmployeeNumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFinalRegister = async () => {
    if (!firstName || !lastName || !contactNumber || !address || !studentOrEmployeeNumber || !birthdate) {
      setErrorMessage('Please fill out all fields');
      return;
    }
  
    const registrationData = {
      username,
      email,
      password,
      misStaff: {
        firstName,
        lastName,
        middleName,
        contactNumber,
        address,
        misStaffNumber: studentOrEmployeeNumber,
        birthdate,
      },
    };
  
    try {
      console.log('Sending registration data:', registrationData);
      const response = await axios.post('http://10.0.2.2:8081/user/register', registrationData);
      console.log('User registered successfully:', response.data);
      setSuccessMessage('Registration successful! OTP has been sent to your email.');
      navigation.navigate('OtpScreen', { username }); // Pass the username to OTP screen
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error);
      setErrorMessage(error.response?.data?.message || 'Registration failed.');
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../assets/login.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <TopBox />
          <View style={styles.registerBox}>
            <Text style={styles.title}>Additional Information</Text>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              value={middleName}
              onChangeText={setMiddleName}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Student/Employee Number"
              value={studentOrEmployeeNumber}
              onChangeText={setStudentOrEmployeeNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Birthdate (YYYY-MM-DD)"
              value={birthdate}
              onChangeText={setBirthdate}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleFinalRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: StatusBar.currentHeight || 0,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    marginTop: width * 0.4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  registerBox: {
    width: '85%',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: height * 0.03,
    marginBottom: height * 0.02,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
  },
  button: {
    width: '48%',
    height: height * 0.05,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6666',
  },
  registerButton: {
    backgroundColor: '#2996f3',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: height * 0.02,
    fontWeight: 'bold',
  },
});

export default RegisterDetailsScreen;
