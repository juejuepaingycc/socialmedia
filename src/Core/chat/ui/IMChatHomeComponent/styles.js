import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    userImageContainer: {
      borderWidth: 0,
    },
    chatsChannelContainer: {
      // flex: 1,
      padding: 10,
    },
    qrcontainer: {
      flex: 1,
      flexDirection: 'column',
    },
    content: {
      flexDirection: 'row',
    },
    message: {
      flex: 2,
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
    },

    layerTop: {
      height: hp(27.5),
      backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    scan: {
      backgroundColor: 'rgba(0, 0, 0, .6)',
      textAlign: 'center',
      color: '#cdd0d4',
      height: hp(5),
    },
    leftBorder: {
      width: wp(0.4),
      backgroundColor: 'rgba(0, 0, 0, .6)',
      //paddingHorizontal: wp(7),
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 2
    },
    leftBorder1: {
      height: wp(8),
      width: wp(0.4),
      backgroundColor: '#3494c7',
    },
    leftBorder2: {
      height: wp(8),
      width: wp(0.4),
      backgroundColor: '#3494c7',
    },
    topBorder: {
      height: wp(0.4),
      flexDirection: 'row',
      alignSelf: 'center',
      width: wp(100),
      backgroundColor: 'rgba(0, 0, 0, .6)',
      paddingHorizontal: wp(9.6),
      //justifyContent: 'space-between',
    },
    topBorder1: {
      height: wp(0.4),
      width: wp(8),
      backgroundColor: '#3494c7',
    },
    topBorder2: {
      height: wp(0.4),
      width: wp(8),
      backgroundColor: '#3494c7',
      position: 'absolute',
      right: wp(8.8)
    },
    bottomBorder: {
      height: wp(0.4),
      flexDirection: 'row',
      alignSelf: 'center',
      width: wp(100),
      backgroundColor: 'rgba(0, 0, 0, .6)',
      paddingHorizontal: wp(9.6),
      justifyContent: 'space-between',
    },
    bottomBorder1: {
      height: wp(0.4),
      width: wp(8),
      backgroundColor: '#3494c7',
    },
    bottomBorder2: {
      height: wp(0.4),
      width: wp(8),
      backgroundColor: '#3494c7',
    },
    layerCenter: {
      height: hp(40),
      flexDirection: 'row'
    },
    layerLeft: {
      width: wp(9.6),
      backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    focused: {
      width: wp(80.8),
      //borderWidth: 1,
      //borderColor: '#3494c7'
    },
    layerRight: {
      width: wp(9.6),
      backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    layerBottom: {
      height: hp(27.5),
      backgroundColor: 'rgba(0, 0, 0, .6)'
    },
  });
};

export default dynamicStyles;
