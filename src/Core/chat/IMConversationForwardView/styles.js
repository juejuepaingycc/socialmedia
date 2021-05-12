import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    chatItemContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    chatItemContent: {
      flex: 1,
      alignSelf: 'center',
      marginLeft: 10,
    },
    chatFriendName: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: hp(2.1),
      //fontWeight: '500',
      //fontFamily: appStyles.customFonts.klavikaMedium
    },
    sendBtn: {
      backgroundColor: '#3494c7',
      borderRadius: hp(0.5),
      paddingHorizontal: hp(2),
      //width: wp(30),
      paddingVertical: hp(1),
      alignSelf: 'center',
      position: 'absolute',
      right: hp(0.5)
    },
    disableBtn: {
      backgroundColor: 'gray',
      borderRadius: hp(0.5),
      paddingHorizontal: hp(2),
      //width: wp(30),
      paddingVertical: hp(1),
      alignSelf: 'center',
      position: 'absolute',
      right: hp(0.5)
    },
    sendText: {
      fontSize: hp(2),
      color: 'white',
      textAlign: 'center'
    },
    disableText: {
      fontSize: hp(2),
      color: '#cdd1d4',
      textAlign: 'center'
    }
  });
};

export default dynamicStyles;
