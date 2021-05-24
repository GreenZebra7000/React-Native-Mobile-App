import React, { Component } from 'react';
import {StyleSheet, Alert, ScrollView, View, ToastAndroid} from 'react-native'
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button}  from 'react-native-paper'
import styles from './styles'

class SignUp extends Component{

  constructor(props){
      super(props);
// we need this state constructed before the user enters this information in the text inputs when they visit the page
      this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: ""
      }
  }

  signup(){

    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
      //the state data that was changed by text input fields, is then converted and put in the body of the post request to sign up
    })
    .then((response) => {
      if(response.status === 201){
        return response.json()
      }else if(response.status === 400){
        throw 'Failed Validation';
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => { //if the request was 201 status and a success, then the user is prompted with a message saying account created and navigated to sign in where they can now sign in with their new account
      console.log("User created with ID: ", responseJson);
      ToastAndroid.show('Account Created', ToastAndroid.SHORT);
      this.props.navigation.navigate('SignIn');
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }


  render(){
//Data entry that allows the user to input information to setup a new account. The styling , much like the other components, uses the styles stylesheet in order to collect and save different styling options for reuse
//around the app

      const navigation = this.props.navigation;
    return(
      <PaperProvider>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content titleStyle={styles.appheadertext} title="Register Account" />
        </Appbar.Header>

        <View style={styles.formItem}>
          <ScrollView contentContainerStyle={styles.flexgrow}>
            <List.Subheader style={styles.title}> Enter your Email Address and Password to Sign Up </List.Subheader>

              <View style={styles.formItem}>
                <Text style={styles.centerboldtext}> First Name </Text>
                <TextInput
                        placeholder="First Name..."
                        onChangeText={(first_name) => this.setState({first_name})}
                        value={this.state.first_name}
                        style={styles.formInput}
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.centerboldtext}> Last Name </Text>
                <TextInput
                        placeholder="Last name..."
                        onChangeText={(last_name) => this.setState({last_name})}
                        value={this.state.last_name}
                        style={styles.formInput}
                 />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.centerboldtext}> Email Address </Text>
                <TextInput
                        placeholder="email..."
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
              </View>
              <View style={styles.formItem}>
                <Button
                    style={styles.formButton}
                    mode="contained"
                    onPress={() => this.signup() }>
                    <Text> Create Account </Text>
                </Button>
              </View>
        </ScrollView>
        </View>
      </PaperProvider>
    );

  }
}



export default SignUp;
