import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native'
import {Provider as PaperProvider, Appbar, Button ,Surface,Title, Text}  from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'



class HomeScreen extends Component{


  constructor(props){
  super(props);

  this.state = {
    loggedIn: false
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

  checkLoggedIn = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
//this state value allows us to determine what message we want at the front of the app, so here we are giving a welcoming page and a short guide on how to use the app which changes slightly if the user is signed in
    if(session_token == null){
      this.setState({loggedIn: true})
    }else {
      this.setState({loggedIn: false})
    }

  };



  render(){
    const navigation = this.props.navigation;
//if statement determining what is being displayed visually by the state change given in checkLoggedIn
    if(this.state.loggedIn){
      return(
        <PaperProvider>
          <Appbar.Header style={styles.appheader}>
            <Appbar.Content  titleStyle={styles.appheadertext} title="Home" />
          </Appbar.Header>
          <Surface style={styles.surface}>
            <View style={styles.formItem}>
                <Title style={styles.centerboldtext}>Welcome to CoffiDA!</Title>
                <Text style={styles.centerboldtext}>
                    This  platform  allows  you  to  view  the  best  local  Café ’s  around !
                </Text>
                <Text style={styles.centerboldtext}>
                What's  even  better ?
                You  can  publish  reviews  of  your  coffee  experiences  at  locations  by  Signing  up  or  Logging  in
                </Text>
            </View>
            <View style={styles.formItem}>
                <Title>How Do I Check Locations and Reviews?</Title>
                <Text style={styles.centerboldtext}>
                    Once  signed  in , simply  click the Locations  tab  at  the bottom  of  the  screen  . Here  you  can
                    Search or View all  Locations . To  learn  more  about  the  location  ,  click 'About' on the locations.
                </Text>
                <Text style={styles.centerboldtext}>
                To add a Review click on the  Location 's reviews section and then use the Plus symbol to add !
                </Text>
                <Text style={styles.centerboldtext}>
                  Another tip ? - You can even add Photos to your reviews .. Here's how : 1 . Post your review  2.  Head to 'My Reviews' in your Account Page , and click 'Add Photo' !
                </Text>
            </View>
          </Surface>
        </PaperProvider>
      );
    }else{
      return(
        <PaperProvider>
          <Appbar.Header style={styles.appheader}>
            <Appbar.Content titleStyle={styles.appheadertext} title="Home" />
          </Appbar.Header>
          <Surface style={styles.surface}>
            <View style={styles.formItem}>
                <Title style={styles.centerboldtext}>  Welcome Back ! </Title>
                <Text style={styles.centerboldtext}>
                    Now you are signed in, you can check current coffee spots , read other people's reviews and also write about your own coffee shop experiences.
                </Text>
                <Text style={styles.centerboldtext}>
                    Click the Locations Tab below to get started
                </Text>
            </View>
            <View style={styles.formItem}>
                <Title>How Do I Check Locations and Reviews?</Title>
                <Text style={styles.centerboldtext}>
                    Once  signed  in , simply  click the Locations  tab  at  the bottom  of  the  screen  . Here  you  can
                    Search or View all  Locations . To  learn  more  about  the  location  ,  click 'About' on the locations.
                </Text>
                <Text style={styles.centerboldtext}>
                To add a Review click on the  Location 's reviews section and then use the Plus symbol to add !
                </Text>
                <Text style={styles.centerboldtext}>
                  Another tip ? - You can even add Photos to your reviews .. Here's how : 1 . Post your review  2.  Head to 'My Reviews' in your Account Page , and click 'Add Photo' !
                </Text>
            </View>
          </Surface>
        </PaperProvider>
      );
    }
  }
}

export default HomeScreen;
