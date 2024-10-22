import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const TicketListScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userType = await AsyncStorage.getItem('userType');
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('authToken');

        if (!userId || !userType || !token) {
          setError('User information or token not found. Please log in again.');
          setLoading(false);
          return;
        }

        const url = `http://10.0.2.2:8080/TicketService/tickets/user/${userId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setTickets(response.data);
        } else if (response.status === 204) {
          setError('No tickets found for the given user.');
        } else {
          setError('Failed to fetch tickets. Server error occurred.');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
        setError('Failed to fetch tickets. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.rowText}>{item.issue ? String(item.issue) : 'No Issue'}</Text>
      <Text style={styles.rowText}>{item.status ? String(item.status) : 'No Status'}</Text>
      <Text style={styles.rowText}>
        {item.dateCreated ? new Date(item.dateCreated).toLocaleDateString() : 'No Date'}
      </Text>
      <Text style={styles.rowText}>
        {item.dateFinished ? new Date(item.dateFinished).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={styles.rowText}>
        {item.misStaff && (item.misStaff.firstName || item.misStaff.lastName)
          ? `${String(item.misStaff.firstName || '')} ${String(item.misStaff.lastName || '')}`.trim()
          : 'Unassigned'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../assets/login.png')} // Same background image as in LoginScreen
        style={[styles.background, { width, height }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Ticket List</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Issue</Text>
                <Text style={styles.headerText}>Status</Text>
                <Text style={styles.headerText}>Date Created</Text>
                <Text style={styles.headerText}>Date Finished</Text>
                <Text style={styles.headerText}>MIS Staff Name</Text>
              </View>
              <FlatList
                data={tickets}
                keyExtractor={(item) => item.ticketId.toString()}
                contentContainerStyle={styles.tableBody}
                renderItem={renderItem}
              />
            </>
          )}
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
  container: {
    
    marginLeft: 4,
    flex: 1,
    paddingTop: height * 0.12,
    width: '98%',
    backgroundColor: 'transparent',
    
  },
  title: {
    fontSize: width * 0.07,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
    paddingVertical: 9,
    marginTop: 6,
  },
  headerText: {
    fontSize:  14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 9,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  rowText: {
    fontSize:  13,
    color: '#555',
    textAlign: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.04,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TicketListScreen;
