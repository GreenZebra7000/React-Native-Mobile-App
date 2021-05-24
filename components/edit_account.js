import React, { Component } from 'react';
import {StyleSheet, Alert, View, ScrollView, ToastAndroid} from 'react-native';
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button}  from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class EditAccount extends Component{


  constructor(props){
      super(props);

      this.state = { //state thats going to be used as a way to pass the body of data to update the users account
      first_name: "",
      second_name: "",
      email: "",
      password:""
      }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  checkLoggedIn = async () => {  //If the user is not logged in then they shall not be able
    const session_token = await AsyncStorage.getItem('@session_token');
      if(session_token == null){
          ToastAndroid.show("Please login to edit your account",ToastAndroid.SHORT);
    }
  };




  updateAccount = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@user_id');
//using the user ID that we have saved beforehand to create a dynamic fetch url that is specific to the user which is signed in
//using the session token as authorization for the user so that they can successfully send the request
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token
      },
      body: JSON.stringify(this.state)
    })//stringify the body of information before we send it as it needs to be in this json format
    .then((response) => {
      if(response.status === 200){
        return response;
      }else if(response.status === 401){
      ToastAndroid.show("You need to be signed in to edit an account", ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      }
    })
    .then((response) => { //If the patch request was a success then the user is alerted and they can go around the application once again
      ToastAndroid.show("Account Updated", ToastAndroid.SHORT);
      this.props.navigation.navigate('MyAccount');
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

//Here we have a page that allows the user to input new details for different aspects of their account. This then gets sent by a patch request using the updateAccount function. Its in a scrollview so that as the
//keyboard is displayed, the user can scroll down the page and continue entering their new information . Once the information they wish to update is entered, they push a button which runs that updateAccount function to make the patch request
// The text inputs are all changing the state which is the body of data we send across

  render(){
      const navigation = this.props.navigation;

    return(
      <PaperProvider >
        <Appbar.Header >
          <Appbar.BackAction onPress={() => navigation.navigate('Account')} />
          <Appbar.Content titleStyle={styles.appheadertext} title="Edit Account" />
        </Appbar.Header>

        <View style={styles.formItem}>
          <ScrollView contentContainerStyle={styles.flexgrow}>
            <List.Subheader style={styles.title}> Update your information here </List.Subheader>


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
                        placeholder="Last Name..."
                        onChangeText={(last_name) => this.setState({last_name})}
                        value={this.state.last_name}
                        style={styles.formInput}
                />
              </View>
              <View style={styles.formItem}>
                <Button
                    style={styles.formButton}
                    mode="contained"
                    onPress={() => this.updateAccount()}>
                    <Text> Update Account </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>

      </PaperProvider>
    );
  }
}

export default EditAccount;
