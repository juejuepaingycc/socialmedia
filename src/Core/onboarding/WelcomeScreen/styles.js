import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container2: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    indicatorContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: 'rgba(52, 52, 52, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    logo: {
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: -100,
    },
    logoImage: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      //tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    title: {
      fontSize: 30,
      //fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: appStyles.customFonts.klavikaMedium
    },
    caption: {
      fontSize: 16,
      paddingHorizontal: 50,
      marginBottom: 20,
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    loginContainer: {
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      marginTop: 30,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      fontFamily: appStyles.customFonts.klavikaMedium
    },
    signupContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderRadius: appStyles.sizeSet.radius,
      borderWidth: Platform.OS === 'ios' ? 0.5 : 1.0,
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 20,
      height: 45,
    },
    signupText: {
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
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
