import React, { Component } from 'react';
import {StyleSheet, View, FlatList, ToastAndroid} from 'react-native'
import {Provider as PaperProvider, Text, Appbar, List, Button, Card, Title, Paragraph,  IconButton}  from 'react-native-paper';
import { Rating} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class FaveLocations extends Component{

  constructor(props){
      super(props);

      this.state = {
      isLoading: true,
      listData: []
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

      if(session_token == null){
          this.setState({  //Empties the locations if the user is now signed out . Otherwise the contents are still seen for a moment when clicking the locations tab if the user was previously signed in.
            isLoading:false,
            listData: []
          })
          ToastAndroid.show("Please login to view your favourite locations",ToastAndroid.SHORT);

    }else if( session_token != null){
      this.getFaveLocations(); //if they are signed in, they can view their favourited locations otherwise it won't run and they cannot make the get request to get the favourite locations
    }
  };

  getFaveLocations = async () => {
    const session_token = await AsyncStorage.getItem('@session_token'); //dynamic url for specific user
    const userID = await AsyncStorage.getItem('@user_id');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
      headers: {
        'X-Authorization': session_token
      }
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }else if(response.status === 401){
        ToastAndroid.show("Please login to view your favourited locations", ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      }
    })
    .then(async (responseJson) => {
        this.setState({
          isLoading:false,
          listData: responseJson.favourite_locations
        })
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    })
  }

  unfavouriteLocation = async (locationID,locationName) => {
    const session_token = await AsyncStorage.getItem('@session_token');

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/favourite", {
      method: 'delete',
      headers: {
        'X-Authorization': session_token
      }
    })
    .then((response) => {
      if(response.status === 200){
        return response;
      }else if(response.status === 401){
        ToastAndroid.show("Please login to unfavourite location", ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      }
    })
    .then((response) => {
      //here we are updating the page after alerting the user that the location has indeed been unfavourited , this is so we see the new favourite list and changes made without reloading the app
      ToastAndroid.show(locationName + " has been unfavourited ", ToastAndroid.SHORT);
      this.componentDidMount();
    })
   .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }




  render(){

      const navigation = this.props.navigation;


//the way the flatlist works and similar is that it takes the data given that we stored into our state and then iterates through it by the location id in the keyextractor line . This way we get a full list of
//favourited locations displayed


//ratings limited to readonly in the props as this is just for display purposes and not editing

    return(
      <PaperProvider>
        <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Account')} />
         <Appbar.Content titleStyle={styles.appheadertext} title="Favourite Locations" />
        </Appbar.Header>

        <View style={styles.formItem}>

          <FlatList
              data={this.state.listData}
              renderItem={({item}) => (
              <View style={styles.formItem}>
                <Card style={styles.collectionHolder}>
                    <Card.Title titleStyle={styles.appheadertext} title= {item.location_name}/>
                  <Card.Content>
                    <View>
                      <Text style={styles.centerboldtext}> Town: {item.location_town}</Text>
                      <Text style={styles.centerboldtext}> Average Overall Rating </Text>
                      <Rating imageSize={15}  readonly tintColor='#b3ffe6' startingValue={item.avg_overall_rating} />
                      <Text style={styles.centerboldtext}> Average Price Rating </Text>
                      <Rating imageSize={15} readonly tintColor='#b3ffe6'  startingValue={item.avg_price_rating} />
                      <Text style={styles.centerboldtext}> Average Quality Rating </Text>
                      <Rating imageSize={15} readonly tintColor='#b3ffe6'  startingValue={item.avg_quality_rating} />
                      <Text style={styles.centerboldtext}> Average Cleanliness Rating</Text>
                      <Rating imageSize={15} readonly tintColor='#b3ffe6' startingValue={item.avg_clenliness_rating} />
                      <Button icon="heart-off" size={20} color='red' onPress={() => this.unfavouriteLocation(item.location_id, item.location_name)}> Unfavourite </Button>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            )}
            keyExtractor={(item,index) => item.location_id.toString()}
            />
        </View>
      </PaperProvider>
    );
  }
}

export default FaveLocations;
