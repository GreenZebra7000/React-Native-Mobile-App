import {StyleSheet} from 'react-native';








export default StyleSheet.create({


  bgcolor:{
    backgroundColor: '#4dffdb'
  },
  subpageBGcolor:{
    backgroundColor: '#b3ffe6'
  },
  searchbox:{
    backgroundColor: '#4dffdb'
  },
  centerboldtext:{
    textAlign: 'center',
    fontWeight: 'bold'
  },
  leftboldtext:{
    padding: 10,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  appheader:{
    backgroundColor: '#14F9DD',
    alignItems:'center'
  },
  appheadertext:{
    textAlign: 'center',
  },
  title: {
    color:'blueviolet',
    backgroundColor: '#b3ffe6',
    padding:10,
    fontSize:14,
    textAlign: 'center'
  },
  formItem: {
    flex:1,
    padding:10,
    backgroundColor: '#ccffee',
  },
  collectionHolder: {
    padding:10,
    backgroundColor: '#b3ffe6',
    height:'95%'
  },
  formInput:{
    borderWidth:1,
    borderColor: '#ccffee',
  },
  formTouchText:{
    fontSize:20,
    fontWeight:'bold',
    color:'steelblue'
  },
  formButton:{
    fontSize:20,
    fontWeight:'bold',
    justifyContent: 'center',
  },
  flexgrow:{
    flexGrow:1
  },
  surface:{
    padding: 8,
    backgroundColor : '#14F9DD',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    elevation: 10,
  },
  surfacePos: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  imgPosition: {
    padding:30,
    flex:2,
    justifyContent: 'flex-start'
  },
  imageset:{
    width:200,
    height:150,
    alignSelf: 'center'
  },
  loadingScreen: {
    flex:2,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3ffe6'
  },
})
