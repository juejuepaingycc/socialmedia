import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Scales, Colors} from '@common';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    tabBarContainer: {
      ...ifIphoneX(
        {
          height: 80,
        },
        {
          height: Scales.deviceHeight * 0.07,
        },
      ),
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: appStyles.colorSet[colorScheme].hairlineColor,
    },
    tabContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    focusicon: {
      color: '#000',
      marginTop: 7
    },
    unfocusicon: {
      color: '#3494c7',
      marginTop: 7
    },
    tabIcon: {
      ...ifIphoneX(
        {
          width: 25,
          height: 25,
        },
        {
          width: 22,
          height: 22,
        },
      ),
      marginTop: 3
    },
    focusTintColor: {
      tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    unFocusTintColor: {
      tintColor: appStyles.colorSet[colorScheme].bottomTintColor,
    },
    notiCount: {
      backgroundColor: 'green',
      width: 30,
      height: 22,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#216a91',
      position: 'absolute',
      top: 0,
      zIndex: 2
    },
  });
};

export default dynamicStyles;
