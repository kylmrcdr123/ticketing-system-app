import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, Image, Dimensions, ImageBackground } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!email || !username) {
      Alert.alert('Error', 'Please enter both your username and email');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { username, email };  // Sending both username and email
      const response = await axios.post('http://10.0.2.2:8080/user/forgot-password', payload);

      if (response.status === 200) {
        Alert.alert('OTP Sent', 'An OTP has been sent to your email');
              navigation.navigate('VerifyForgotPassword', { email, username });navigation.navigate('VerifyForgotPassword', { email, username });
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/login.png')} // Background image
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        {/* TopBox integrated */}
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        {/* Forgot Password Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password</Text>

          {/* Username Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Button Container for aligning buttons */}
          <View style={styles.buttonContainer}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Send OTP Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSendOtp} disabled={isSubmitting}>
              <Text style={styles.submitButtonText}>{isSubmitting ? 'Sending...' : 'Send OTP'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    marginTop: 20, // Resize the background image to cover the entire screen
  },
  safeArea: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  topBox: {
    position: 'absolute', // Make TopBox fixed at the top
    top: 1, // Align at the top of the screen
    left: 0,
    right: 0,
    height: '8%',
    marginTop: -1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#0C356A',
    zIndex: 1000, // Ensure it stays above other content
  },
  logo: {
    width: '50%', // Smaller width for smaller screen
    height: '100%',
    marginRight: 170,
    resizeMode: 'contain',
  },
  formContainer: {
    padding: 20, 
    width: '90%', 
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Add shadow/elevation for better visual appearance
    paddingVertical: 30, // Adjust padding inside the form
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  input: { 
    width: '80%', 
    height: 50, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: 15, 
    marginBottom: 20 
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%',
  },
  submitButton: { 
    width: '48%', // Adjust width for each button
    height: 50, 
    backgroundColor: '#007bff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5 
  },
  submitButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  backButton: { 
    width: '48%', // Adjust width for each button
    height: 50,
    backgroundColor: '#ddd', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5 
  },
  backButtonText: { 
    fontSize: 16, 
    color: '#333' 
  },
});

export default ForgotPasswordScreen;
