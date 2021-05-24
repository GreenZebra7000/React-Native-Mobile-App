import React, { Component } from 'react';
import {StyleSheet, Alert, View, ScrollView, ToastAndroid} from 'react-native';
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button  }  from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class SignIn extends Component{

  constructor(props){
  super(props);

//this state information is the required body to post in order to login
  this.state = {
    email: "",
    password: "",
  }
}

login = async () => {
  return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state)
  })
  .then((response) => {
    if(response.status === 200){
      return response.json()
    }else if(response.status === 400){
      throw 'Invalid email or password';
    }else{
      throw 'Something went wrong';
    }
  })
  .then(async (responseJson) => {
    //We set the returned session token and user id which will be important for how the user can access and function around the application. for example to view locations the token must be present.
    await AsyncStorage.setItem('@session_token', responseJson.token);
    await AsyncStorage.setItem('@user_id', JSON.stringify(responseJson.id));
    this.props.navigation.navigate('Home');
  })
  .catch((error) => {
    console.log(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}


  render(){

      const navigation = this.props.navigation;
// A simple data entry which the user can use that sets the state which in turns gets sent in the post request above. The password uses secureTestEntry prop to hide the text after a certain time
//The button at the bottom runs the login function to make the post request
    return(
      <PaperProvider>
        <Appbar.Header >
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content titleStyle={styles.appheadertext} title="Log In" />
        </Appbar.Header>

        <View style={styles.formItem}>
          <ScrollView contentContainerStyle={styles.flexgrow}>
            <List.Subheader style={styles.title}> Enter your Email Address and Password to Sign in </List.Subheader>


            <View style={styles.formItem}>
              <Text style={styles.centerboldtext}> Email </Text>
              <TextInput
                      placeholder="Email..."
                      onChangeText={(email) => this.setState({email})}
                      value={this.state.email}
                      style={styles.formInput}
               />
            </View>
            <View style={styles.formItem}>
              <Text style={styles.centerboldtext}> Password </Text>
              <TextInput
                      placeholder="Password..."
                      onChangeText={(password) => this.setState({password})}
                      value={this.state.password}
                      style={styles.formInput}
                      secureTextEntry={true}
              />
              <View style={styles.formItem}>
                <Button
                    style={styles.formButton}
                    mode="contained"
                    onPress={() => this.login()}>
                    <Text> Sign In </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </PaperProvider>
    );
  }
}




export default SignIn;
