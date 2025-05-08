import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import LoginScreen from './components/Login';

function App() {
  return (
    <SafeAreaView style={Styles.formContainer}>
      <LoginScreen/>
    </SafeAreaView>
  );
}
const Styles = StyleSheet.create({

  formContainer:{
    flex:1,
    justifyContent:'center',
    left:30,
  },
});

export default App;
