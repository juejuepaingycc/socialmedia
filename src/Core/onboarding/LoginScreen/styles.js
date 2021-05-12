import { I18nManager } from 'react-native';
import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    orTextStyle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      marginTop: 40,
      marginBottom: 10,
      alignSelf: 'center',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(150, 153, 153,0.8)',
      alignItems: 'center'
  
    },
    modalView: {
      width: '100%',
      height: Scales.deviceHeight * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15
    },
    title: {
      fontSize: 23,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 45,
      marginBottom: 20,
      alignSelf: 'stretch',
      textAlign: 'center',
      marginLeft: 30,
    },
    title2: {
      fontSize: 23,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      alignSelf: 'stretch',
      textAlign: 'center',
    },
    loginContainer: {
      width: '70%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    resetContainer: {
      width: '48%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 20,
      padding: 10,
      marginTop: 20,
      alignSelf: 'center',
    },
    cancelContainer: {
      width: '48%',
      //backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 20,
      padding: 10,
      marginTop: 20,
      alignSelf: 'center',
    },
    loginText: {
      color: '#ffffff',
    },
    placeholder: {
      color: 'red',
    },
    InputContainer: {
      height: 42,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      paddingLeft: 20,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      //alignSelf: 'center',
      marginTop: 15,
      alignItems: 'center',
      borderRadius: 25,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      marginLeft: Scales.deviceHeight * 0.04,
    },
    row: {
      flexDirection: 'row',
      height: 42,
    },
    eyeView: {
      paddingTop: 22,
      paddingLeft: 4
    },
    facebookContainer: {
      width: '70%',
      backgroundColor: '#4267B2',
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    facebookText: {
      color: '#ffffff',
    },
    phoneNumberContainer: {
      marginTop: 20,
    },
    doubleNavIcon: {
      flexDirection: 'row',
      marginTop: 20,
      alignItems: 'center'
    },
    paymentContainer: {
      width: '70%',
      backgroundColor: '#19469b',
      borderRadius: 25,
      marginTop: 30,
      alignSelf: 'center',
      padding: 10,
    },
    paymentText:{
      color: '#ffffff',
      fontFamily: appStyles.customFonts.klavikaMedium
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
    selectImg: {
      width: 40,
      height: 25,
      resizeMode: 'cover',
      borderRadius: 3
    },
  });
};

export default dynamicStyles;
