import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import RNQRGenerator from 'rn-qr-generator';
import { Colors } from '@common';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { IMLocalized } from '../../Core/localization/IMLocalization'

const ProfileQR = (props) => {

  const [qrcode, setQrcode] = useState('');
  const [user, setUser] = useState({
    profilePictureURL: '',
    firstName: '',
    lastName: ''
  });

  function backButtonHandler() {
    props.navigation.goBack();
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);
  
  useEffect(() => {
    (async () => {
    let id = props.navigation.getParam('user1').id;
    let user = props.navigation.getParam('user1');
    setUser(user);
    console.log("userinfo>>", user.profilePictureURL)
    RNQRGenerator.generate({
      //value: JSON.stringify(props.navigation.getParam('user1')), // required
      value: id,
      height: hp(40),
      width: hp(40),
      base64: false,            // default 'false'
      color: '#3494c7',           // default 'black'
    })
      .then(response => {
        const { uri, width, height, base64 } = response;
        console.log("QR>>"+ JSON.stringify(response))
        setQrcode(uri)
      })
      .catch(error => console.log('Cannot create QR code', error));
    })();
  }, []);


  return (
    <View style={{flex: 1}}>
      <View style={styles.Conatainer}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.img}>
         {
            user.profilePictureURL != '' && user.profilePictureURL != null && user.profilePictureURL != undefined ?
              <Image
              source={{ uri: user.profilePictureURL }}
              style={styles.profile}
              />
              :
              <Image
              source={require('../../assets/img/contact.png')}
              style={styles.profile}
              />
          } 
          </TouchableOpacity>
          <Text style={styles.name}>{user.firstName}&nbsp;{user.lastName ? user.lastName : ''}</Text>
          <Image
            source={{ uri: qrcode }}
            style={styles.qrImage}
          />
          <Text style={styles.description}>{IMLocalized('Scan QR to add me as your friend')}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileQR;

const styles = StyleSheet.create({
  Conatainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  qrContainer: {
    //alignItems: 'center',
    //padding: 1,
    borderWidth: 1,
    borderColor: 'gray'
  },
  Conatainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: hp(55),
    width: wp(90),
    alignSelf: 'center',
    alignItems: 'center'
  },
  profile: {
    width: hp(8),
    height: hp(8),
    resizeMode: 'contain',
    //borderRadius: 100,
    overflow: 'hidden',
    borderRadius: hp(100),
  },
  img: {
    borderRadius:  hp(100),
    width: hp(8),
    height: hp(8),
    alignSelf: 'center',
    position: 'absolute',
    marginTop: hp(-5),
    borderWidth: 0.2,
    borderColor: '#c8cbcc',
    backgroundColor: '#c8cbcc'
  },
  name: {
    fontSize: hp(2.2),
    textAlign: 'center',
    marginTop: hp(7),
    //color: '#646769',
    fontWeight: 'bold'
  },
  qrImage: {
    width: hp(40),
    height: hp(40),
  },
  description: {
    fontSize: hp(2),
    textAlign: 'center',
    color: 'gray',
  },
})