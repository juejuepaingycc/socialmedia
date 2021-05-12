import { StyleSheet } from 'react-native';
import { I18nManager } from 'react-native';
import { Scales } from '@common';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    modalBackground2: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(100, 102, 102,0.7)',
      alignItems: 'center'
    },
    modalBackgroundCancel: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(100, 102, 102,0.7)',
      alignItems: 'center'
    },
    modalView: {
      width: Scales.deviceWidth * 0.7,
      height: 270,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
    },
    modalCancelView: {
      width: Scales.deviceWidth * 0.8,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10
    },
    title: {
      fontSize: 23,
      //fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 30,
      paddingTop: 5,
      marginBottom: 50,
      alignSelf: 'stretch',
      textAlign: 'center',
      marginLeft: 35,
      fontFamily: appStyles.customFonts.klavikaMedium
    },
    phoneNumberContainer: {
      marginTop: 20,
    },
    sendContainer: {
      width: '70%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    sendText: {
      color: '#ffffff',
      fontFamily: appStyles.customFonts.klavikaMedium
    },
    InputContainer: {
      height: 42,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      paddingLeft: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
    },
    InputContainer2: {
      height: 42,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      paddingLeft: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
    },
    input1: {
      height: hp(5.5),
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      paddingLeft: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
      flexDirection: 'row'
    },
    flagStyle: {
      width: 35,
      height: 25,
      borderColor: appStyles.colorSet[colorScheme].mainTextColor,
      borderBottomLeftRadius: 25,
      borderTopLeftRadius: 25,
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    phoneInputTextStyle: {
      borderLeftWidth: I18nManager.isRTL ? 0 : 1,
      borderRightWidth: I18nManager.isRTL ? 1 : 0,
      borderLeftWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      height: 42,
      fontSize: 15,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      borderBottomRightRadius: I18nManager.isRTL ? 0 : 25,
      borderTopRightRadius: 25,
      borderTopRightRadius: I18nManager.isRTL ? 0 : 25,
      borderBottomLeftRadius: I18nManager.isRTL ? 25 : 0,
      borderTopLeftRadius: I18nManager.isRTL ? 25 : 0,
      paddingLeft: 10,
    },
    input: {
      flex: 1,
      borderLeftWidth: 1,
      borderRadius: 3,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      fontWeight: '700',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    codeFieldContainer: {
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      width: '80%',
      height: 42,
      marginTop: 30,
      alignSelf: 'center',
      borderRadius: 25,
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    orTextStyle: {
      marginTop: 40,
      marginBottom: 10,
      alignSelf: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    facebookContainer: {
      width: '70%',
      backgroundColor: '#4267b2',
      borderRadius: 25,
      marginTop: 30,
      alignSelf: 'center',
      padding: 10,
    },
    paymentContainer: {
      width: '70%',
      backgroundColor: '#19469b',
      borderRadius: 25,
      marginTop: 30,
      alignSelf: 'center',
      padding: 10,
    },
    facebookText: {
      color: '#ffffff',
      fontFamily: appStyles.customFonts.klavikaMedium
    },
    paymentText:{
      color: '#ffffff',
      fontFamily: appStyles.customFonts.klavikaMedium
    },
    signWithEmailContainer: {
      marginTop: 20,
    },
    tos: {
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
    },
    doubleNavIcon: {
      flexDirection: 'row',
      marginTop: 20,
      alignItems: 'center'
    },
    pickerView: {
      position: 'absolute',
      top: 20,
      right: 14
    },
    navIconMenuOptions: {
      flexDirection: 'row',
      width: null,
      padding: 6,
      borderRadius: 3,
    },
    selectView: {
      flexDirection: 'row'
    },
    imgcontainer: {
      height: hp(5),
      paddingRight: hp(0.6),
      borderRightWidth: 1,
      borderRightColor: appStyles.colorSet[colorScheme].grey3,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    countryImg: {
      width: hp(4),
      height: hp(2.7),
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10
    },
    code: {
      fontSize: hp(1.7),
      paddingLeft: hp(0.6)
    },
    selectImg: {
      width: hp(3.6),
      height: hp(3),
      resizeMode: 'cover',
      borderRadius: 3
    },
    countries: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: Scales.deviceWidth * 0.7,
      paddingHorizontal: 13,
      paddingVertical: 11,
      borderBottomWidth: 0.2,
      borderBottomColor: '#bbbdbd'
    },
    cancelText: {
      alignSelf: 'center',
      color: 'white'
    },
    cancel: {
      justifyContent: 'center',
      alignItems:'center',
      width: Scales.deviceWidth * 0.4,
      paddingHorizontal: 13,
      paddingVertical: 9,
      backgroundColor: '#3494c7',
      borderRadius: 9,
      marginVertical: 8
    }
  });
};

export default dynamicStyles;
