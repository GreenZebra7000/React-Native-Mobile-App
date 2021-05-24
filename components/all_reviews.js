import React, { Component } from 'react';
import {StyleSheet, View,  FlatList, Image, ToastAndroid} from 'react-native'
import {Provider as PaperProvider, Text, TextInput, Appbar, Button, Card, Title, Paragraph, Avatar,  Surface, IconButton }  from 'react-native-paper';
import { Rating} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'

class AllReviews extends Component{

  constructor(props){
      super(props);

      this.state = {
      isLoading: true,
      displayImage: true,
      reviewData: [],
      locationID: "",
      locationName: "",
      photoURL: ""
      }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
    });
    this.setData(); //The user would have to be signed in already in order to get to this page so no need for checkedLoggedIn function
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  setData(){
      this.setState({
        isLoading:false,
        reviewData: this.props.route.params.reviewItem, //taking data that we require from the previous screen which will be used for our request to the server and for iterating through a flatlist to view the relevant reviews
        locationID: this.props.route.params.locationID,
        locationName: this.props.route.params.locationName,
        photoURL:  this.props.route.params.photoURL //Locations can include a photograph if it is saved to the database
      })
  }



likeReview = async (reviewID,locationID,locationName) => {
  const session_token = await AsyncStorage.getItem('@session_token');

  return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID + "/like" , {
    method: 'post',
    headers: {
      'X-Authorization': session_token
    }
  })
  .then((response) => {
    if(response.status === 200){
      return response;
    }else if(response.status === 401){
      ToastAndroid.show("Please login to like a review", ToastAndroid.SHORT);
    }else{
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  })
  .then((response) => {
    ToastAndroid.show( "You liked " + locationName + "'s Review " , ToastAndroid.SHORT);
    this.componentDidMount();
  })
 .catch((error) => {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
  })
}

removeLikeReview = async (reviewID,locationID,locationName) => {
  const session_token = await AsyncStorage.getItem('@session_token');

  return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID + "/like" , {
    method: 'delete',
    headers: {
      'X-Authorization': session_token
    }
  })
  .then((response) => {
    if(response.status === 200){
      return response;
    }else if(response.status === 401){
      ToastAndroid.show("Please login to remove your like of this review", ToastAndroid.SHORT);
    }else{
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }
  })
  .then((response) => {
    ToastAndroid.show( "You removed your like of  " + locationName + "'s Review " , ToastAndroid.SHORT);
    this.componentDidMount();
  })
 .catch((error) => {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
  })
}

  render(){
    const navigation = this.props.navigation;
    const LeftContent = props => <Avatar.Icon {...props} icon="map-marker-radius" />

    if(this.state.isLoading){
      return(
        <View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
          <Text> Loading..</Text>
        </View>
      );
    }else{
      return(
        <PaperProvider>
          <Appbar.Header >
            <Appbar.BackAction onPress={() => navigation.navigate('Locations')} />
            <Appbar.Content titleStyle={styles.appheadertext} title="Recent Reviews" />
          </Appbar.Header>
          <View style={styles.formItem}>
           <FlatList
              data={this.state.reviewData}
              renderItem={({item}) => (
                <View style={styles.formItem}>
                    <Card style={styles.subpageBGcolor}>
                      <Card.Content>
                        <View>
                          <Text style={styles.centerboldtext}> Overall Rating </Text>
                          <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review_overallrating} />
                          <Text style={styles.centerboldtext}> Price Rating </Text>
                          <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review_pricerating} />
                          <Text style={styles.centerboldtext}> Quality Rating </Text>
                          <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review_qualityrating} />
                          <Text style={styles.centerboldtext}> Cleanliness Rating </Text>
                          <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={item.review_clenlinessrating} />
                          <Text style={styles.leftboldtext}> Description: {item.review_body} </Text>
                          <Text style={styles.leftboldtext}> Likes: {item.likes} </Text>
                        </View>
                          <Image
                              style={{width: 200, height:150}}
                              source={{uri: "http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationID + "/review/" + item.review_id + "/photo?timestamp=" + Date.now()}}
                           />
                          <View>
                            <Button icon="thumb-up-outline" size={20}  onPress={() => this.likeReview(item.review_id,this.state.locationID,this.state.locationName)}> Like </Button>
                            <Button icon="thumb-down-outline" size={20}  onPress={() => this.removeLikeReview(item.review_id,this.state.locationID,this.state.locationName)}> Remove Like </Button>
                          </View>
                       </Card.Content>
                    </Card>
                </View>
              )}
              keyExtractor={(item,index) => item.review_id.toString()}
              />
                <IconButton icon="plus-circle" size={60} onPress={() => navigation.navigate('AddReview',{ locationID : this.state.locationID })}/>
            </View>
        </PaperProvider>
      );
    }
  }
}


export default AllReviews;
