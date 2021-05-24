import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appbar, Provider as PaperProvider} from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

//Importing my components in so I can setup there navigation in the render() 
import Home from './components/home';
import AllReviews from './components/all_reviews';
import AddReview from './components/add_review';
import MyReviews from './components/my_reviews';
import MyAccount from './components/myaccount';
import EditAccount from './components/edit_account';
import SignIn from './components/signin';
import SignUp from './components/signup';
import AllLocations from './components/all_locations';
import FaveLocations from './components/fave_locations';
import OneLocation from './components/one_location';
import EditReview from './components/edit_review';
import AddPhoto from './components/add_photo';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Tabs(){ //Bottom Tabs for directing the main pages. This is nested with a stack navigator so I can have subpages that are accessed without tabs.
  return(
            <Tab.Navigator barStyle={{ backgroundColor: '#4dffdb' }} activeColor="#003329" inactiveColor="#000000"  >
                <Tab.Screen name="Home" component={Home} options={{tabBarIcon: 'home-variant-outline',}}/>
                <Tab.Screen name="Locations" component={AllLocations} options={{tabBarIcon: 'city-variant-outline',}}/>
                <Tab.Screen name="Account" component={MyAccount} options={{tabBarIcon: 'account-outline',}}/>
            </Tab.Navigator>
        );
}
class App extends Component{//Nesting between two navigators  happens in here with the tabs navigator by using the function that includes the tab navigator
  render(){
    return (
      <PaperProvider  >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
              headerShown: false, //Replacing the default Stack header with my own in the component classes
            }}>

            <Stack.Screen name="MainHome" component={Tabs} />
            <Stack.Screen name="AllReviews" component={AllReviews} />
            <Stack.Screen name="MyReviews" component={MyReviews} />
            <Stack.Screen name="MyAccount" component={MyAccount} />
            <Stack.Screen name="EditAccount" component={EditAccount} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="AddReview" component={AddReview} />
            <Stack.Screen name="AllLocations" component={AllLocations} />
            <Stack.Screen name="FaveLocations" component={FaveLocations} />
            <Stack.Screen name="OneLocation" component={OneLocation} />
            <Stack.Screen name="EditReview" component={EditReview} />
            <Stack.Screen name="AddPhoto" component={AddPhoto} />
          </Stack.Navigator>
        </NavigationContainer>
        </PaperProvider>
      );
  }
}

export default App;
