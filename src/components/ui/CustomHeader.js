import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { Scales, Colors } from '@common';
import IconFeather from 'react-native-vector-icons/Feather';
import AppStyles from '../../AppStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const CustomHeader = (props) => {

  return (
    <View style={styles.HeaderBody}>
        <TouchableOpacity onPress={props.onNotiPress} style={styles.noti}>
        {
          props.notiCount > 0 ?
          <TouchableOpacity style={styles.notiCount}
          onPress={props.onNotiPress}
          >
            <Text style={{ color: 'white', fontSize: hp(1.4) }}>
              {props.notiCount}
            </Text>
          </TouchableOpacity>
          :
          null
          } 
          <IconFeather name='bell' size={33} color='white' />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image source={require('../../assets/img/ninepay_white.png')} style={styles.imgView} /> 
          <Text style={styles.title}>Nine Pay</Text>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontFamily: AppStyles.customFonts.klavikaMedium,
    color: 'white',
    fontSize: 25,
  },
  noti: {
    alignSelf: 'flex-start',
    position: 'absolute',
    right: hp(2),
    top: hp(1.8)
  },
  HeaderBody: {
    width: Scales.deviceWidth,
    height: Scales.deviceHeight * 0.15,
    paddingTop: 10,
    backgroundColor: '#3494c7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bell: {
    height: 30,
    width: 30, 
    resizeMode: 'contain', 
    marginTop: 250, 
  },
  HeaderSection: {
    borderBottomWidth: 0,
    flexDirection: 'row',
    //alignItems: 'center',
    borderRadius: 75,
  },
  userButton: {
    alignItems: 'center',
    //justifyContent: 'center',
    borderRadius: 75,
    overflow: 'hidden',
    marginLeft: 0,
    height: Scales.moderateScale(40),
    width: Scales.moderateScale(40),
    //marginTop: -80
  },

  searchContainer: {
    width: Scales.deviceWidth * 0.65,
    height: 35,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.WHITE,
    borderWidth: 0.5,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
  },

  searchInputContainer: {
    width: Scales.deviceWidth * 0.55,
    height: '100%',
    justifyContent: 'center',
  },
  notiCount: {
    width: hp(3.5),
    height: hp(2.7),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#216a91',
    position: 'absolute',
    zIndex: 2,
    marginLeft: hp(1.6),
    marginTop: hp(-0.7)
  },

  searchInputText: {
    fontSize: Scales.moderateScale(16),
    color: Colors.BLACK,
    paddingLeft: 10,
    width: '100%',
    height: '100%',
    marginBottom: -2,
  },

  HeaderButton: {
    alignItems: 'center',
   // justifyContent: 'center',
    borderRadius: 75,
    marginTop: -80,
    overflow: 'hidden',
    padding: 5,
    marginRight: 10,
    //margin: 10,
    //height: 25,
    //width: 25,
  },
  imgView: {
    height: Scales.deviceHeight * 0.08, 
    resizeMode: 'contain',
  },
  QRButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
    overflow: 'hidden',
    padding: 5,
    // marginRight: 10,
    //margin: 10,
    //height: 25,
    //width: 25,
  },

  cityText: {
    fontSize: Scales.moderateScale(18),
    color: Colors.BLACK,
    paddingLeft: 5,
    //textShadowColor: 'black',
    //textShadowRadius: 10,
  },
  icon: {
    textShadowColor: 'black',
    textShadowRadius: 10,
    //padding: 10,
  },
});

export default CustomHeader;
