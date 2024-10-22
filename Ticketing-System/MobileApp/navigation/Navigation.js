import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import OtpScreen from '../screens/OtpScreen';
import LoginScreen from '../screens/authentication/LoginScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';
import RegisterDetailsScreen from '../screens/RegisterDetailsScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import TicketListScreen from '../screens/TicketListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyForgotPasswordScreen from '../screens/VerifyForgotPasswordScreen';


const { height, width } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RegisterStack = createNativeStackNavigator();

const RegisterNavigator = () => (
  <RegisterStack.Navigator initialRouteName="RegisterScreen">
    <RegisterStack.Screen 
      name="RegisterScreen" 
      component={RegisterScreen} 
      options={{ headerShown: false }} 
    />
    <RegisterStack.Screen 
      name="RegisterDetails" 
      component={RegisterDetailsScreen} 
      options={{ headerShown: false }} 
    />
  </RegisterStack.Navigator>
);

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === 'TicketList') {
            iconName = 'list';
          } else if (route.name === 'CreateTicket') {
            iconName = 'add-circle';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Logout') {
            iconName = 'log-out';
          }
          return <Icon name={iconName} size={width * 0.06} color={focused ? 'red' : 'blue'} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: height * 0.018 },
      })}
    >
      <Tab.Screen name="TicketList" component={TicketListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="CreateTicket" component={CreateTicketScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Logout"
        component={LoginScreen} // Navigate to LoginScreen when logging out
        options={{
          tabBarButton: (props) => (
            <LogoutButton {...props} navigation={navigation} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RegisterFlow" 
          component={RegisterNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
       <Stack.Screen 
          name="OtpScreen" 
          component={OtpScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="ForgotPassword"
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="VerifyForgotPassword"
        component={VerifyForgotPasswordScreen} 
        options={{ headerShown: false }} 
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const LogoutButton = ({ navigation }) => (
  <View style={{ alignItems: 'center', padding: 5, marginRight: 10 }}>
    <Icon
      name="log-out"
      size={width * 0.07}
      color="blue"
      onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }}
    />
    <Text style={{ fontSize: height * 0.018, color: 'gray' }}>Logout</Text>
  </View>
);

export default Navigation;
