import React, { Component } from 'react';
import {StyleSheet, View, ScrollView, FlatList, ToastAndroid, Image} from 'react-native'
import {Provider as PaperProvider, Text, TextInput, Appbar,  Button, Card, Title, Paragraph, Avatar, IconButton, ActivityIndicator}  from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-elements';
import styles from './styles'

class MyReviews extends Component{

  constructor(props){
      super(props);

      this.state = {
      isLoading: true,
      listData: []
      }
  }


  componentDidMount(){ //listener again to check if the page is being currently visited , if it is then checkLoggedIn , which will determine what happens next if user is logged in
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
          ToastAndroid.show("Please login to view your reviews",ToastAndroid.SHORT);
    }else if( session_token != null){
      this.getMyReviews();
    }
  };

  getMyReviews = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@user_id');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
      'headers': {
        'X-Authorization': session_token
      }
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }else if(response.status === 401){
        ToastAndroid.show("Please login to view your reviews", ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      }
    })
    .then(async (responseJson) => { //stores the current users reviews into the state which we can then iterate through creating a list of the users reviews  , it needs to be converted before set in state
        this.setState({
          isLoading:false,
          listData: responseJson.reviews
        });
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  deleteReview = async (reviewID,locationID,locationName) => {
    const session_token = await AsyncStorage.getItem('@session_token');

    //takes the parameters above to put into the url dynamically depending on if they press the button to delete the review.

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID, {
      method: 'delete',
      headers: {
        'X-Authorization': session_token
      }
    })
    .then((response) => {
      if(response.status === 200){
        return response;
      }else if(response.status === 401){
        ToastAndroid.show("Please login to delete review", ToastAndroid.SHORT);
      }else{
          ToastAndroid.show("Something went wrong deleting the review", ToastAndroid.SHORT);
      }
    })
    .then((response) => {
      ToastAndroid.show("Review for " + locationName + " has been deleted ", ToastAndroid.SHORT);
      this.componentDidMount(); //refreshing the page if the delete was successful to show the change made
    })
   .catch((error) => {
      console.log(error);
      ToastAndroid.show("There was an error deleting this review", ToastAndroid.SHORT);
    })
  }

  deletePhoto = async (reviewID,locationID,locationName) => {
    const session_token = await AsyncStorage.getItem('@session_token');
    //running a delete request for the review photo if the user wishes to. the button is pressed which runs this function and passes parameters needed for the url
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID + "/photo", {
      method: 'delete',
      headers: {
        'X-Authorization': session_token
      }
    })
    .then((response) => {
      if(response.status === 200){
        return response;
      }else if(response.status === 401){
        ToastAndroid.show("Please login to delete photo", ToastAndroid.SHORT);
      }else{
        ToastAndroid.show("Something went wrong deleting the review's photo", ToastAndroid.SHORT);
      }
    })
    .then((response) => {
      ToastAndroid.show("Photo for " + locationName + " has been deleted ", ToastAndroid.SHORT);
      this.componentDidMount();
    })
   .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }



  render(){

      const navigation = this.props.navigation;
      //renders the page depending on if it is loading or signed in, if it is not signed in it displays our loading screen which looks the same as the other loading screens
      //The image that gets displayed is through the uri prop which we can include to get the photo for that review , it also contains date now which adds a timestamp which means that should we update the image it will change due to the url being slightly different
      if(this.state.isLoading){
        return(
          <View style={styles.loadingScreen}>
             <Text> Loading... </Text>
             <ActivityIndicator animating={true} color={'#14F9DD'} />
             <Text> Tip : To view this page, you need to be signed in </Text>
             <Button style={styles.formButton}   onPress={() => this.checkLoggedIn()} > Refresh Page </Button>
          </View>
              );
          }else{
            return(
              <PaperProvider>
                <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.navigate('Account')} />
                 <Appbar.Content  titleStyle={styles.appheadertext} title="My Reviews" />
                </Appbar.Header>
                <View style={styles.formItem}>
                  <FlatList
                      data={this.state.listData}
                      renderItem={({item}) => (
                      <View style={styles.formItem}>
                        <Card style={styles.subpageBGcolor}>
                              <Card.Title titleStyle={styles.appheadertext} title= {item.location.location_name}    />
                          <Card.Content>
                            <View>
                              <Text style={styles.centerboldtext}> Overall Rating </Text>
                              <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review.overall_rating} />
                              <Text style={styles.centerboldtext}> Price Rating </Text>
                              <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review.price_rating} />
                              <Text style={styles.centerboldtext}> Quality Rating </Text>
                              <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review.quality_rating} />
                              <Text style={styles.centerboldtext}> Cleanliness Rating </Text>
                              <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review.clenliness_rating} />
                              <Text style={styles.leftboldtext}> Description: {item.review.review_body} </Text>
                              <Text style={styles.leftboldtext}> Likes: {item.review.likes} </Text>
                              <Image
                                style={styles.imageset}
                                source={{uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + item.location.location_id + '/review/' + item.review.review_id + '/photo?timestamp=' + Date.now()}}
                               />
                              <Button icon="delete-circle" size={20}  onPress={() => this.deleteReview(item.review.review_id,item.location.location_id, item.location.location_name)}> Delete Review </Button>
                              <Button icon="square-edit-outline" size={20}  onPress={() => navigation.navigate('EditReview',{  reviewItem : item.review, locationID : item.location.location_id } )}> Edit Review </Button>
                              <Button icon="camera" size={20}  onPress={() => navigation.navigate('AddPhoto',{  reviewID : item.review.review_id, locationID : item.location.location_id } )}> Attach Photo </Button>
                              <Button icon="delete-circle" size={20}  onPress={() => this.deletePhoto(item.review.review_id,item.location.location_id, item.location.location_name)}> Delete Photo </Button>
                            </View>
                          </Card.Content>
                      </Card>
                    </View>
                    )}
                    keyExtractor={(item,index) => item.review.review_id.toString()}
                    />
                </View>
              </PaperProvider>
    );
   }
 }
}

export default MyReviews;
