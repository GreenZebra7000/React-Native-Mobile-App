import React, { Component } from 'react';
import {StyleSheet, Alert, View, ScrollView, ToastAndroid, FlatList} from 'react-native';
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button, Card, Title, Paragraph, Avatar, Headline, ActivityIndicator}  from 'react-native-paper';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class AllLocations extends Component{

  constructor(props){
      super(props);

      this.state = {
      isLoading: true, //useful for checking the loading status before rendering all of the display , works if the user is not signed in also as we keep this st as true if there is no token
      listData: [], //this is where we are going to store our locations data if we are successfully authenticated and the get request is a success
      textQuery: '', //able to search by location name using a query
      }
  }


  componentDidMount(){ //Again using a listener component so that when the screen is in focus we run this function which in turn checks if the user is logged in before loading data up etc
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  checkLoggedIn = async () => { // Checking if there is a valid session token for the user, if not then they will only see a loading screen with information that suggests they may need to relog
    const session_token = await AsyncStorage.getItem('@session_token');

      if(session_token == null){
          this.setState({
            listData: [],
            textQuery: '',
          })

        ToastAndroid.show("Please login to view locations",ToastAndroid.SHORT);
    }else if( session_token != null ){  //if authenticated, we can get the location data and display them to the screen once we have it stored and displayed in the flatlist below
      this.getLocations("http://10.0.2.2:3333/api/1.0.0/find"); //base search for getting all locations, can be narrowed down using the search function to add more queries to it
    }
  }

  getLocations = async (url) => { //takes the dynamic url which could be the base search or specific from the search bar on the top of the screen
  const session_token = await AsyncStorage.getItem('@session_token');
  return fetch( url , {
    headers: {
      'X-Authorization': session_token
    }
  })
  .then((response) => {
    if(response.status === 200){ // handling response codes, 200 is what we require for the successful response
      return response.json()
    }else if(response.status === 401){
      ToastAndroid.show("Please login to view locations", ToastAndroid.SHORT);
    }else{
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  })
  .then(async (responseJson) => {
      this.setState({
        isLoading:false,
        listData: responseJson
      })
  })
  .catch((error) => {
    console.log(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

  search = () => { //used to join further queries to the end of the locations search . by default it will show all locations but we can filter it more specifically. this would be even more useful with further expansion of locations into the app
  let url = "http://10.0.2.2:3333/api/1.0.0/find?"
  var symbols = /[@#!%^&*(){}_+-.';~:]+/; //creating a collection of symbols that we want to prohibit from being searched . this prevents some potential issues with communicating to the server and also they are not necessary in the location names

  if(this.state.textQuery != ''){
    url += "q=" + this.state.textQuery + "&";
  }
  if(this.state.overall_rating > 0){ //if the user has decided to use the rating stars it gets converted using the ratedCompleted function and here we check there rating value and add them to the url for filtering the search further
    url += "overall_rating=" + this.state.overall_rating + "&";
  }
  if(this.state.price_rating > 0){
    url += "price_rating=" + this.state.price_rating + "&";
  }
  if(this.state.quality_rating > 0){
    url += "quality_rating=" + this.state.quality_rating + "&";
  }
  if(this.state.clenliness_rating > 0){
    url += "clenliness_rating=" + this.state.clenliness_rating + "&";
  }
  if(symbols.test(this.state.textQuery)){ //here is the check for the symbols
    ToastAndroid.show("You cannot include these symbols, please check and remove any symbols in the search ", ToastAndroid.SHORT);
  }else{
   this.getLocations(url);
 }
}

  ratingCompleted(rating, name) {
  let stateObject = () => {
    let returnObject = {};
    returnObject[name] = rating;
    return returnObject;
  };
  this.setState(stateObject);
} //converting the ratings through the airbnbrating component to integer values in our state that we can use for filtering the search query to get locations

  favouriteLocation = async (locationID,locationName) => {

  const session_token = await AsyncStorage.getItem('@session_token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/favourite", {
    method: 'post',
    headers: {
      'X-Authorization': session_token
    }
  })
  .then((response) => {
    if(response.status === 200){
      return response;
    }else if(response.status === 401){
      ToastAndroid.show("Please login to favourite location", ToastAndroid.SHORT);
    }else{
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  })
  .then((response) => {
    ToastAndroid.show( locationName + " was added to your Favourited Locations section. ", ToastAndroid.SHORT);
    this.componentDidMount();
  })
 .catch((error) => {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
  })
}

  render(){
    const navigation = this.props.navigation;
    const LeftContent = props => <Avatar.Icon {...props} icon="map-marker-radius"  />

    if(this.state.isLoading){
      return( //returns a loading screen if the user is not signed in or the page is not refreshed
        <View style={styles.loadingScreen}>
           <Text> Loading... </Text>
           <ActivityIndicator animating={true} color={'#14F9DD'} />
           <Text> Tip : To view this page, you need to be signed in </Text>
           <Button style={styles.formButton}   onPress={() => this.checkLoggedIn()} > Refresh Page </Button>
        </View>
      );
    }else if(this.state.isLoading==false){
      return(
        <PaperProvider >
          <Appbar.Header style={styles.appheader}>
            <Appbar.Content titleStyle={styles.appheadertext} title="Locations" />
          </Appbar.Header>

              <View style={styles.formItem}>
                <View>
                  <Text style={styles.centerboldtext}> Search </Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter coffee shop name.."
                    value = {this.state.textQuery}
                    onChangeText={(q) => this.setState({textQuery: q})}
                    />
                </View>
                <View style={styles.searchqueriesLeft}>
                  <Text style={styles.centerboldtext}> Overall Rating </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
                    showRating={false}
                  />
                </View>
                <View style={styles.searchqueriesLeft}>
                  <Text style={styles.centerboldtext}> Price Rating </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
                    showRating={false}
                  />
                </View>
                <View style={styles.searchqueriesRight}>
                  <Text style={styles.centerboldtext}> Quality Rating </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
                    showRating={false}
                  />
                </View>
                <View style={styles.searchqueriesRight}>
                  <Text style={styles.centerboldtext}> Cleanliness Rating </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "clenliness_rating")}
                    showRating={false}
                  />
                </View>
                <Button style={styles.formButton}  onPress={() => {this.search()}} > Search </Button>
               <Button style={styles.formButton}   onPress={() => this.checkLoggedIn()} > Reset </Button>
            </View>


          <View style={{flex: 1}}>
            <FlatList //iterating through all of the different locations . If the user clicks on a button to locate to 'About' or 'Reviews' , it will take certain values across to be able to render the required information on those subscreens
                data={this.state.listData}
                renderItem={({item}) => (

                  <View style={styles.formItem}>
                      <Card style={styles.bgcolor}>
                        <Card.Title title={item.location_name}  subtitle={item.location_town} left={LeftContent}/>
                        <Card.Actions>
                            <Button onPress={() => navigation.navigate('OneLocation',{locationItem : item, reviewItem : item.location_reviews } )}>About</Button>
                            <Button onPress={() => navigation.navigate('AllReviews',{ locationID: item.location_id ,locationName: item.location_name, photoURL: item.photo_path, reviewItem : item.location_reviews } )}>Reviews</Button>
                            <Button icon="heart" size={20} color='red' onPress={() => this.favouriteLocation(item.location_id, item.location_name)}> Favourite </Button>
                        </Card.Actions>
                      </Card>
                  </View>
                )}
                keyExtractor={(item,index) => item.location_id.toString()} //uses the location ID from our location data given to recognise where it is and how many to iterate through
                />
          </View>
        </PaperProvider>
      );
    }
  }
}
export default AllLocations;
