import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Logo from './Logo';


function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateAndSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email || !emailRegex.test(email)) {
      Alert.alert('invalid password','Please enter a valid email id');
      return;
    }
    if(!password || password.length < 6){
      Alert.alert('invalid Password', 'Please must be at least 6 character');
      return;
    }

    Alert.alert('success', 'Login successful');
  };

  return (
    <View>
      <View style={Styles.formContainer}>
        <Text style={Styles.text1}>Authentication</Text>
        <Logo />
        <Animated.Image
        source={require('../assets/app_logo.png')}
        style={Styles.logo1}/>
        <Text style={Styles.label}>Login</Text>
        <TextInput
          placeholder="Enter your email id"
          value={email}
          onChangeText={setEmail}
          style={Styles.input}
          keyboardType="email-address"
          placeholderTextColor="black"
        />

        <Text style={Styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={Styles.input}
          placeholderTextColor="black"
        />
        <TouchableOpacity onPress={validateAndSubmit}>
        <LinearGradient colors={['#000', '#dddddd', '#000']} style={Styles.linearGradient}>
          <Text style={Styles.signInbutton}>
            Sign in
          </Text>
        </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={Styles.forgotPassword}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#dddddd',
};

const Styles = StyleSheet.create({

  logoPlaceholder: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  logo1:{
    width: 140,
    height: 140,
    top:160,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },

  formContainer: {
    width: '85%',
    backgroundColor: '#ddd',
    borderRadius: 15,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  signInbutton: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  text1: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  forgotPassword: {
    textDecorationLine: 'underline',
    color: Colors.black,
    textAlign: 'center',
    fontSize: 14,
  },


});

export default LoginScreen;
