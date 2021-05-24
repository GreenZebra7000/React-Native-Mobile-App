import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';
import {StyleSheet, View, ScrollView, FlatList, ToastAndroid, Alert} from 'react-native'
import {Button} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';




class AddPhoto extends Component{



uploadPicture = async(imageData) => {   //Takes the image data passed to it and here we  make a post request to that specific review by using a dynamic fetch and values from our MyReviews page
const locationID = this.props.route.params.locationID;
const reviewID =  this.props.route.params.reviewID;
const session_token = await AsyncStorage.getItem('@session_token'); //Requires user to be signed in so we need to send a valid session token

  return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID + "/photo",
  {
    method: 'post',
    headers: {
      "Content-Type": "image/jpeg",
      "X-Authorization": session_token
    },
    body : imageData
  })
  .then((response) => { //Promise so that if the post request was successful and we get a valid response then let the user know and go back to My Reviews page
    ToastAndroid.show("Photo taken and Uploaded", ToastAndroid.SHORT);
    this.props.navigation.navigate('MyReviews');
  })
  .catch((error) =>{
    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    console.error(error);
    this.props.navigation.navigate('MyReviews');
  });
}


takePicture = async() => { //Called once user has decided to take a picture for a review, this then captures the image data and sends it to the uploadPicture function to post the data using fetch
  if(this.camera){
    const cameraSettings = {quality: 0.5, base64: true};
    const imageData = await this.camera.takePictureAsync(cameraSettings);
    this.uploadPicture(imageData);
  }
}

render() {
   return (

     <View style={{flex:1}}>
        <RNCamera ref={ref => { this.camera = ref; } } //Using the React native camera to render the devices camera and displaying it to screen.
          captureAudio='false'
          style={{ flex: 1, width: '100%'}}>
        </RNCamera>
        <Button icon="plus-circle-outline"  onPress={() => this.takePicture()} />
     </View>
   );
 }



}


export default AddPhoto;
