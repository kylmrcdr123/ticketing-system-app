import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ImageBackground, SafeAreaView, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const CreateTicketScreen = () => {
  const [description, setDescription] = useState('');
  const [dateCreated, setDateCreated] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('To Do');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [reporter, setReporter] = useState('');

  useEffect(() => {
    const retrieveTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserType = await AsyncStorage.getItem('userType');

        if (!storedToken || !storedUserId || !storedUserType) {
          Alert.alert('Error', 'No authentication token, user ID, or user type found. Please log in again.');
          return;
        }

        setToken(storedToken);
        setUserId(storedUserId);
        setUserType(storedUserType);

        if (storedUserType === 'student') {
          setReporter('Student');
        } else if (storedUserType === 'employee') {
          setReporter('Employee');
        } else {
          setReporter('Unknown');
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
        Alert.alert('Error', 'Failed to retrieve authentication data.');
      }
    };

    retrieveTokenAndUserId();
  }, []);

  const handleCreateTicket = async () => {
    if (!description.trim()) {
      Alert.alert('The description field must contain an issue.');
      return;
    }

    if (!token || !userId || !userType) {
      Alert.alert('Error', 'You need to log in to submit a ticket.', [{ text: 'OK' }]);
      return;
    }

    const ticketData = {
      issue: description,
      dateCreated,
      status,
      student: userType === 'student' ? { studentNumber: userId } : null,
      employee: userType === 'employee' ? { employeeNumber: userId } : null,
    };

    try {
      const response = await fetch('http://10.0.2.2:8080/TicketService/ticket/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      const responseBody = await response.text();
      if (response.ok) {
        Alert.alert('Success', 'Ticket submitted successfully!', [{ text: 'OK' }]);
        setDescription('');
        setDateCreated(new Date().toISOString().split('T')[0]);
        setStatus('To Do');
      } else {
        Alert.alert('Error', responseBody, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Failed to submit ticket: ' + error.message, [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../assets/login.png')}
        style={[styles.background, { width, height }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.outerContainer}>
          <Text style={styles.title}>Create a Ticket</Text>
          <View style={styles.innerContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter ticket description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Text style={styles.label}>Date Created</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={dateCreated}
              onChangeText={setDateCreated}
            />
            <Text style={styles.label}>Status</Text>
            <TextInput
              style={styles.input}
              value={status}
              editable={false} // Disable the status field
            />
            <Text style={styles.label}>Reporter</Text>
            <TextInput
              style={styles.input}
              value={reporter}
              editable={false}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateTicket}>
              <Text style={styles.buttonText}>Submit Ticket</Text>
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
    marginTop: 90,
  },
  topBox: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: height * 0.07,
    backgroundColor: '#0C356A',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  logo: {
    width: width * 0.5,
    height: '100%',
    marginRight: 170,
    resizeMode: 'contain',
  },
  outerContainer: {
    flex: 1,
    paddingTop: height * 0.09,
    width: '90%',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    width: '95%',
    paddingHorizontal: '7%',
    paddingVertical: height * 0.04,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
  },
  title: {
    fontSize: width * 0.07,
    marginBottom: height * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: '500',
    color: '#000',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: height * 0.05,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: height * 0.02,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  descriptionInput: {
    height: height * 0.13,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.040,
    fontWeight: '600',
  },
});

export default CreateTicketScreen;
