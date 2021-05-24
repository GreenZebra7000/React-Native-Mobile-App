import React, { Component } from 'react';
import {StyleSheet, Alert, View, ScrollView, ToastAndroid} from 'react-native'
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button }  from 'react-native-paper'
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class AddReview extends Component{


  constructor(props){
  super(props);
 //this state is going to be used as the body for when we send a patch request using updateReview for making changes to the review
  this.state = {
    overall_rating: 0,
    price_rating: 0,
    quality_rating: 0,
    clenliness_rating: 0,
    review_body: ""
  }
}

//This page does not require a checkLogged component as it is a subscreen from My Reviews which only displays information if the user is logged in

ratingCompleted(rating, name) {
    let stateObject = () => {
      let returnObject = {};
      returnObject[name] = rating;
      return returnObject;
    };
    this.setState(stateObject)
}


updateReview = async() => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const locationID = this.props.route.params.locationID;
    const reviewID = this.props.route.params.reviewItem.review_id;
//locationID and reviewID used to make a dynamic url so we are changing the correct review in our application

  return fetch("http:/10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID,{
    method: 'patch',
    headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token
    },
    body: JSON.stringify(this.state)
  })
  .then((response) => {
    if(response.status === 200){
      ToastAndroid.show('Review Updated', ToastAndroid.SHORT);
      this.props.navigation.goBack();
    }else if(response.status === 400){
      ToastAndroid.show('Something went wrong updating the review', ToastAndroid.SHORT);
    }else if(response.status === 401){
      ToastAndroid.show('You must be signed in to make this change', ToastAndroid.SHORT);
    }else{
      ToastAndroid.show('Something went wrong updating', ToastAndroid.SHORT);
    }
  })
  .catch((error) => {
    console.log(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}


//Similar to adding a review, the editing a review functionality works using the airbnbrating component for the user to set ratings and then a description through a text input. Once the button at the bottom is called , updateReview runs and attempts to patch
  render(){
      const navigation = this.props.navigation;

    return(
      <PaperProvider>
        <Appbar.Header style={{ backgroundColor: '#14F9DD'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
         <Appbar.Content titleStyle={{textAlign: 'center'}} title="Add a Review" />
        </Appbar.Header>

        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <List.Subheader style={styles.title}> Updated your existing review </List.Subheader>

            <View style={styles.formItem}>
            <Text> Overall Rating </Text>
              <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
              />
              <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
              />
              <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
              />
              <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "clenliness_rating")}
              />
              <TextInput  value={this.state.review_body}   onChangeText={(review_body) => this.setState({review_body: review_body})}/>

              <Button
                  style={styles.formButton}
                  mode="contained"
                  onPress={() => this.updateReview() }>
                  <Text> Update Review </Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </PaperProvider>
    );
  }
}

export default AddReview;
