import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {Scales, Colors} from '@common';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import AppStyles from '../../AppStyles';

const ServiceTile = (props) => {
  if(props.index == 0 || props.index == 1 || props.index == 2 || props.index == 3 || props.index == 4 || props.index == 5)
    return (
      <View style={styles.tile2}>
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={0.6}
          onPress={props.onItemPress}>
        {/*  <View style={styles.view}> */}
            <Image source={props.avtar} style={styles.image} />
            <Text style={styles.nameText}>{IMLocalized(props.label)}</Text>
          {/* </View> */}
        </TouchableOpacity>
      </View>
    );
  else
  return (
    <View style={styles.tile}>
      <TouchableOpacity
        style={styles.imageContainer}
        activeOpacity={0.6}
        onPress={props.onItemPress}>
      {/*  <View style={styles.view}> */}
          <Image source={props.avtar} style={styles.image} />
          <Text style={styles.nameText}>{IMLocalized(props.label)}</Text>
        {/* </View> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tile2: {
    width: Scales.deviceWidth * 0.33,
    height: Scales.deviceHeight * 0.14,
    //height: Scales.deviceHeight * 0.17,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tile: {
    width: Scales.deviceWidth * 0.33,
    height: Scales.deviceHeight * 0.14,
    //height: Scales.deviceHeight * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: hp(-0.5)
  },
  imageContainer: {
    width: Scales.deviceWidth * 0.24,
    height: Scales.deviceHeight * 0.13,
   // height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 15,
   // borderWidth: 0.1,
    shadowOffset:{  width: 0,  height: 2  },
  shadowColor: 'black',
  shadowOpacity: 1.0,
  },
  image: {
    width: Scales.deviceHeight * 0.08,
    height: Scales.deviceHeight * 0.08,
    //resizeMode: 'contain',
  },
  nameText: {
    fontSize: hp(1.7),
    color: Colors.GRAY,
    paddingTop: 2,
    fontFamily: AppStyles.customFonts.klavikaMedium,
    textAlign: 'center'
  },
});

export default ServiceTile;
