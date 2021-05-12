import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Scales, Colors } from '@common';
import AppStyles from '../../AppStyles';

const InnerHeader = (props) => {
  let Touch = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    Touch = TouchableNativeFeedback;
  }

  return (
    <View style={styles.HeaderBody}>
      <View style={styles.HeaderSideSection}>
        <Touch useForeground onPress={props.onLeftIconPress}>
          <View style={styles.menuButton}>
            <Icon
              name={props.iconLeft}
              color={Colors.WHITE}
              size={Scales.moderateScale(30)}
            />
          </View>
        </Touch>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{props.title}</Text>
      </View>
      <View style={styles.HeaderSideSection}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderBody: {
    width: Scales.deviceWidth,
    //height: Scales.deviceHeight * 0.13,
    height: 60,
    // paddingTop: Scales.deviceHeight * 0.04,
    backgroundColor: '#3494c7',
    borderBottomWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },

  HeaderSideSection: {
    borderBottomWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 75,
    width: Scales.deviceWidth * 0.1,
  },

  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
    overflow: 'hidden',
    marginLeft: 10,
    height: Scales.moderateScale(40),
    width: Scales.moderateScale(40),
  },

  titleContainer: {
    width: Scales.deviceWidth * 0.8,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  titleText: {
    fontSize: Scales.moderateScale(20),
    //fontWeight: 'bold',
    color: Colors.WHITE,
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
});

export default InnerHeader;
