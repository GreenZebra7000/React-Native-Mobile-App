import React, { Component } from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native'
import {Provider as PaperProvider, Text, Appbar, List, Switch}  from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class MyAccount extends Component{


  signout = async () => {
    //function for signing out by a post request , no body needed just the session token which we stored during signin
    const session_token = await AsyncStorage.getItem('@session_token');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method: 'post',
      headers: {
          'X-Authorization': session_token
      }
    })
    .then((response) => {
      if(response.status === 200){
//if the request was good from the server then we can run this seperate function which then removes the user id and token from the local storage which then limits their access and allows them to log in again later
        return this.truesignout();
      }else if(response.status === 401){
        throw 'Failed Validation';
      }else{
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }


  truesignout = async() => {
    const session_token = await AsyncStorage.getItem('@session_token');

    try {
          await AsyncStorage.removeItem('@session_token');
          await AsyncStorage.removeItem('@user_id');
          console.log('Token Removed')
        }
    catch(exception) {
          console.log(exception)
        }
    ToastAndroid.show('Signed Out', ToastAndroid.SHORT);
    this.props.navigation.navigate('Home');
//once the data is removed from async, the user is then redirect to the Homepage
  }




  render(){
      const navigation = this.props.navigation;
//there is a varierty of list items here which display an icon that is somewhat identifiable and understandable to the function beside it. when these list items are pressed the user is redirected to the relevant component
//as with the other subpages in this app the user has an option to go backwards by pressing the arrow on the header as well.
    return(
      <PaperProvider>
      <Appbar.Header style={styles.appheader} >
        <Appbar.Content titleStyle={styles.appheadertext} title="Account" />
      </Appbar.Header>
          <View style={styles.collectionHolder}>
            <List.Item title="Log In "  left={props => <List.Icon {...props} icon="login" />}  onPress={() => navigation.navigate('SignIn')}/>
            <List.Item title="Register "  left={props => <List.Icon {...props} icon="pencil-box" />}  onPress={() => navigation.navigate('SignUp')}/>
            <List.Item title="Logout "  left={props => <List.Icon {...props} icon="logout" />}  onPress={() => this.signout()}/>
            <List.Item title="Account Settings"  left={props => <List.Icon {...props} icon="account-edit" />}  onPress={() => navigation.navigate('EditAccount')}/>
            <List.Item title= "My Reviews"  left={props => <List.Icon {...props} icon="message-bulleted" />}  onPress={() => navigation.navigate('MyReviews')}/>
            <List.Item title= "My Favourite Locations"  left={props => <List.Icon {...props} icon="playlist-star" />}  onPress={() => navigation.navigate('FaveLocations')}/>
           </View>
      </PaperProvider>
    );
  }
}

export default MyAccount;
