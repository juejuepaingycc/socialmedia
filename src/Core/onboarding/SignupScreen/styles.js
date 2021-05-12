import { StyleSheet, Dimensions, I18nManager } from 'react-native';
import { Scales, Colors } from '@common';

const { height } = Dimensions.get('window');
const imageSize = height * 0.232;
const photoIconSize = imageSize * 0.27;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    keyView: {
      flex: 1, width: '100%'
    },
    row: {
      flexDirection: 'row',
      height: 42,
    },
    eyeView: {
      paddingTop: 28,
      paddingLeft: 4
    },
    title: {
      fontSize: 23,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 25,
      marginBottom: 30,
      alignSelf: 'stretch',
      textAlign: 'center',
      marginLeft: 35,
    },

    content: {
      paddingLeft: 50,
      paddingRight: 50,
      textAlign: 'center',
      fontSize: appStyles.fontSet.middle,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    loginContainer: {
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      padding: 10,
      marginTop: 30,
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
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
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      marginLeft: Scales.deviceHeight * 0.04,
    },

    signupContainer: {
      alignSelf: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      padding: 10,
      marginTop: 50,
    },
    signupText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageBlock: {
      flex: 2,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      height: imageSize,
      width: imageSize,
      borderRadius: imageSize,
      shadowColor: '#006',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      overflow: 'hidden',
    },
    formContainer: {
      width: '100%',
      flex: 4,
      alignItems: 'center',
    },
    photo: {
      marginTop: imageSize * 0.77,
      marginLeft: -imageSize * 0.29,
      width: photoIconSize,
      height: photoIconSize,
      borderRadius: photoIconSize,
    },

    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d9d9d9',
      opacity: 0.8,
      zIndex: 2,
    },
    orTextStyle: {
      color: 'black',
      marginTop: 20,
      marginBottom: 10,
      alignSelf: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    phoneNumberContainer: {
      paddingTop: 20,
    },
    smsText: {
      color: '#4267b2',
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
