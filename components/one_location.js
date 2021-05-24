import React, { Component } from 'react';
import {StyleSheet, Alert, View, ScrollView, ToastAndroid, FlatList, Image} from 'react-native'
import {Provider as PaperProvider, Text, TextInput, Appbar, List, Button, Card, Title, Paragraph, Avatar, Headline, Surface}  from 'react-native-paper'
import { Rating} from 'react-native-elements';
import styles from './styles'


class OneLocation extends Component{
  constructor(props){
      super(props);
//constructing new fields in state which gets set once the user is on the screen as there is a listener in componentDidMount
      this.state = {
      isLoading: true,
      displayImage:true,
      listData: [],
      reviewData: []
      }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
    });
    this.setData();
    // setData is ran and sets the state values with values given to it by its parent screen as you can see below. This data can then be used to setup the display of the specific location. Since the user clicks on
    //the location through the flatlist this method works well in finding the exact location which we need.
  }

  componentWillUnmount(){
    this.unsubscribe();
  }


  setData(){
      this.setState({
        isLoading:false,
        listData: this.props.route.params.locationItem,
        reviewData: this.props.route.params.reviewItem
      })
  }

//There is a check here that notices if the url given in the image below does not display the image and instead returns an error 404 . If this is the case, it uses a boolean in state and changes the source to a
//local image that I have added in.
  onErrorLoadingImage = () => {
    this.setState({displayImage:false})
  }


  render(){

      const navigation = this.props.navigation;
    return(
      <PaperProvider>
        <Appbar.Header >
        <Appbar.BackAction onPress={() => navigation.navigate('Locations')} />
         <Appbar.Content titleStyle={styles.appheadertext} title={this.state.listData.location_name} />
        </Appbar.Header>
        <View style={styles.formItem}>
            <Card style={styles.collectionHolder} >
              <Card.Title  titleStyle={styles.appheadertext} subtitleStyle={styles.appheadertext}  title={this.state.listData.location_name} subtitle={this.state.listData.location_town}  />
              <Card.Content >
                <View>
                  <Text style={styles.centerboldtext}> Average Overall Rating </Text>
                  <Rating imageSize={30}  readonly tintColor='#b3ffe6' startingValue={this.state.listData.avg_overall_rating} />
                  <Text style={styles.centerboldtext}> Average Price Rating </Text>
                  <Rating imageSize={30} readonly tintColor='#b3ffe6'  startingValue={this.state.listData.avg_price_rating} />
                  <Text style={styles.centerboldtext}> Average Quality Rating </Text>
                  <Rating imageSize={30} readonly tintColor='#b3ffe6'  startingValue={this.state.listData.avg_quality_rating} />
                  <Text style={styles.centerboldtext}> Average Cleanliness Rating</Text>
                  <Rating imageSize={30} readonly tintColor='#b3ffe6' startingValue={this.state.listData.avg_clenliness_rating} />
                </View>
                <View style={styles.imgPosition}>
                  {this.state.displayImage ? (
                    <Card.Cover
                        source={{uri:  this.state.listData.photo_path}}
                        onError={this.onErrorLoadingImage}
                        />
                                ) : (
                    <Card.Cover   source={require('./noimgavailable.png')} /> )
                  }
                </View>
              </Card.Content>
            </Card>
        </View>

      </PaperProvider>
    );
  }
}

export default OneLocation;
