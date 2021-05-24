import React, { Component } from 'react';
import {StyleSheet, Alert, View, ToastAndroid, FlatList, ScrollView} from 'react-native'
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button}  from 'react-native-paper'
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class AddReview extends Component{


  constructor(props){
  super(props);

//Creating a new state object with required parameters  that will be used to post a new review
  this.state = {
    overall_rating: 0,
    price_rating: 0,
    quality_rating: 0,
    clenliness_rating: 0,
    review_body: ""
  }
}


ratingCompleted(rating, name) { //This is so we can convert our star ratings into integers for when we post the data across to the server. we call this for every rating until our state is full ready to post
    let stateObject = () => {
      let returnObject = {};
      returnObject[name] = rating; // Taking our given name passed through as a parameter which matches the state's parameters and assigning the new value to it
      return returnObject;
    };
    this.setState(stateObject) // Setting the new value to the relevant value in state
}

postReview = async() => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const locationID = this.props.route.params.locationID;

  return fetch("http:/10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review",{
    method: 'post',
    headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token
    },
    body: JSON.stringify(this.state)
  })
  .then((response) => {
    if(response.status === 201){
      console.log("User posted review");
      ToastAndroid.show('Review Uploaded', ToastAndroid.SHORT);
      this.props.navigation.navigate('Locations');
    }else if(response.status === 400){
      throw 'Bad Request';
    }else if(response.status === 401){
      throw 'Failed Validation';
    }else{
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
  })
}

  render(){
      const navigation = this.props.navigation;
    return(
      <PaperProvider >
        <Appbar.Header >
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content titleStyle={styles.appheadertext} title="Add a Review" />
        </Appbar.Header>

        <View style={styles.formItem}>
          <ScrollView contentContainerStyle={styles.flexgrow}>
            <List.Subheader style={styles.title}> Post about your Coffee Spot Experience! </List.Subheader>

              <View style={styles.formItem}>
                <Text style={styles.centerboldtext}> Overall Rating </Text>
                <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
                />
                <Text style={styles.centerboldtext}> Price Rating </Text>
                <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
                />
                <Text style={styles.centerboldtext}> Quality Rating </Text>
                <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
                />
                <Text style={styles.centerboldtext}> Cleanliness Rating </Text>
                <AirbnbRating
                    size={15}
                    defaultRating={0}
                    onFinishRating={(rating) => this.ratingCompleted(rating, "clenliness_rating")}
                />
                <Text style={styles.centerboldtext}> Enter Description </Text>
                <TextInput  value={this.state.review_body}   onChangeText={(review_body) => this.setState({review_body: review_body})}/>
                <View style={styles.formItem}>
                  <Button style={styles.formButton}  mode="contained" onPress={() => this.postReview() }>  Post Review    </Button>
                </View>
            </View>
          </ScrollView>
        </View>
      </PaperProvider>
    );
  }
}

export default AddReview;
