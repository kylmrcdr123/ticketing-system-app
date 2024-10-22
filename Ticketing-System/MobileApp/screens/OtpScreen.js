import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ImageBackground } from 'react-native';
import axios from 'axios';

const OtpScreen = ({ route, navigation }) => {
  const { username } = route.params; // Get the username passed from the previous screen
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage('Please enter the OTP');
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = { otp, username }; // Include username in the payload

      const response = await axios.post('http://10.0.2.2:8080/user/verify-otp', payload); // Update with your backend URL

      if (response.status === 200) {
        setMessage('OTP verified successfully!');
        setTimeout(() => {
          navigation.navigate('Login'); // Navigate to the login screen after successful verification
        }, 2000);
      } else {
        setMessage('Invalid OTP.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while verifying OTP.');
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/login.png')} // Add your background image here
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        {/* TopBox integrated */}
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>OTP Verification</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          {/* Button container for aligning buttons */}
          <View style={styles.buttonContainer}>
          
            {/* Go Back button */}
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
              <Text style={styles.goBackButtonText}>Back</Text>
            </TouchableOpacity>
             {/* Verify OTP button */}
             <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp} disabled={isSubmitting}>
              <Text style={styles.verifyButtonText}>{isSubmitting ? 'Verifying...' : 'Verify OTP'}</Text>
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
  container: {
    padding: 10, // Smaller padding for a compact layout
    width: '90%', // Smaller width for a compact container
    alignItems: 'center',
   backgroundColor: '#ffffff', // Add a white background for better contrast
    borderRadius: 10, // Rounded corners for the container
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add shadow/elevation for the container to make it stand out
  },
  title: {
    fontSize: 20, // Smaller font size for the title
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Adjust color for better readability
  },
  input: {
    width: '80%',
    height: 40, // Smaller height for input field
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15, // Adjust margins for compact layout
    fontSize: 16, // Smaller font size for input text
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between',
    width: '80%', // Container width to fit both buttons
  },
  verifyButton: {
    width: '45%', // Each button takes 45% of the width
    height: 40, // Smaller button height
    backgroundColor: '#2996f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10, // Smaller margin for compact layout
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16, // Smaller font size for button text
    fontWeight: 'bold',
  },
  goBackButton: {
    width: '45%', // Each button takes 45% of the width
    height: 40, // Smaller button height
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16, // Smaller font size for button text
    fontWeight: 'bold',
  },
  message: {
    color: 'red',
    marginBottom: 10, // Smaller margin for compact layout
    textAlign: 'center',
  },
});

export default OtpScreen;
