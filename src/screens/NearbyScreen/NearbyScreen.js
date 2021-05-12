

import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform, View,  Text, SafeAreaView, StyleSheet, Image, FlatList, ScrollView, BackHandler, Modal, ToastAndroid, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { Scales } from '@common';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Card from '../../components/ui/Card';
import TNActivityIndicator from '../../Core/truly-native/TNActivityIndicator';
import { geoFirestore } from '../../Core/firebase';
import { firebase } from '../../Core/firebase/config';
import Geolocation from '@react-native-community/geolocation';

export default class NearbyScreen extends Component {

  static navigationOptions = ({ screenProps, navigation }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle: IMLocalized('Nearby Friends'),
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium
      },
      headerLeft: Platform.OS === 'android' && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      loading: true
    }
    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    });
  }

  componentDidMount() {
      Geolocation.getCurrentPosition(
        (position) => {
          this.getNearByFriends(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          this.getNearByFriends(16.8569837,96.1919091);
        },
      );

    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    })
  }

  getNearByFriends = (latitude, longitude) => {
    geoFirestore.getNearbyFriends(latitude, longitude, 16.09344).then((response) => {
      if(response == null || response.length == 0){
          this.setState({ loading: false });
          alert(IMLocalized("There is no nearby friends"));
        }
        else{
          const nearUsers = response.filter(
            (data) => data.id != this.props.navigation.getParam('userID')
          );
          const uploadPromises = [];

            nearUsers.forEach((location) => {
              
              uploadPromises.push(
                new Promise((resolve, reject) => {

                  const usersRef = firebase.firestore().collection('users');
                    usersRef
                    .where('id', '==', location.id)
                    .onSnapshot((querySnapshot) => {
                      const docs = querySnapshot.docs;
                      if (docs.length > 0) {
                          //let arr = this.state.nearbyFriends;
                          let data = { ...docs[0].data(), distance: Number((location.distance).toFixed(2)) }
                          //arr.push(data);
                         // this.setState({ nearbyFriends: arr })
                          resolve(data);
                      }
                      else{
                        resolve();
                      }
                    });
                }),
              );
            })
              
            Promise.all(uploadPromises).then(async (results) => {
              //console.log("Res>>"+ JSON.stringify(results))
              newArr = results.filter(
                (result) => result != null
              );
              newArr.sort(function (a, b) {
                  return a.distance - b.distance;
              });
              this.setState({ friends: newArr, loading: false });
            });
        }
    }); 
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onFriendItemPress = (item) => {
      this.props.navigation.push('Profile', {
        user: item,
        stackKeyTitle: 'Profile',
      });
  };
  
  render(){
    return(
        <ScrollView>
          <View style={styles.container}>
              {this.state.friends.length > 0 &&
              this.state.friends.map((item) => (
              <Card style={styles.card1}>
                <TouchableOpacity style={styles.block} onPress={() => this.onFriendItemPress(item)}>
                  <Image source={{uri: item.profilePictureURL}} style={styles.img} />
                  <View style={styles.rightView}>
                    <Text style={styles.name}>{item.firstName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <IconMaterialIcons name='location-on' size={22} color='#d44537' style={{ marginLeft: -5 }} />
                      <Text style={styles.distance}>{item.distance} km</Text>
                    </View>

                  </View>
                  <IconMaterialIcons name='chevron-right' size={27} color='gray' style={styles.right}  />
                </TouchableOpacity>
              </Card>
              ))}
          </View>

          {
            this.state.loading && (
              <View style={styles.loadingContainer}>
                <TNActivityIndicator appStyles={AppStyles} />
              </View>
            )
          }   
                    
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    height: 500
  },
  block: {
    flexDirection: 'row',
    padding: 8,
    width: Scales.deviceWidth * 0.8
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 20
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 6
  },
  distance: {
    fontSize: 16,
    color: '#544e4e'
  },
  // right: {
  //   alignSelf: 'flex-end',
  //   paddingRight: 15
  // },
  rightView: {
    justifyContent: 'center'
  },
  right: {
    right: 0,
    position: 'absolute',
    alignSelf: 'center'
  },
  card1: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    //alignItems: 'center',
    //justifyContent: 'center',
    marginTop: '5%',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 8,
    //marginHorizontal: 20,
    marginTop: 10
  },
})