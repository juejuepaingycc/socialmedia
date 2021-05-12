import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import AppStyles from '../../../AppStyles';
import { Scales } from '@common';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    menu: {
      flexDirection: 'row',
      paddingLeft: 16,
      paddingVertical: 13,
      borderBottomWidth: 0.3,
      borderBottomColor: '#7db4d1'
    },
    icon: {
      paddingRight: 10,
      size: 20
    },
    menuText: {
      fontSize: 16,
      paddingLeft: 10,
      fontFamily: AppStyles.customFonts.klavikaMedium
    },
    container: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    headerContainer: {
      flexDirection: 'row',
      marginBottom: 20
      //flex: 1,
    },
    postInputContainer: {
      //alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: 16
      //flex: 3.5,
     // backgroundColor: 'red'
    },
    // titleContainer: {
    //   marginTop: 20,
    // },
    // title: {
    //   color: AppStyles.colorSet[colorScheme].mainTextColor,
    //   fontSize: 17,
    //   fontWeight: '600',
    //   fontFamily: AppStyles.customFonts.klavikaMedium
    // },
    titleContainer: {
      marginTop: 12,
    },
    title: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      fontWeight: '600',
      fontFamily: AppStyles.customFonts.klavikaMedium
    },
    subtitle: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 13,
      flex: 0.8
    },
    closeBtn: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040'
    },
    modalBackground2: {
    //  flex: 1,
      //alignItems: 'center',
    //  flexDirection: 'column',
    //  justifyContent: 'flex-end',
      //backgroundColor: '#00000040'
    //  backgroundColor: 'rgba(150, 153, 153,0.6)'
    ///position: 'absolute',
    //bottom: 0,
   // flex: 1
    },
    activityIndicatorWrapper: {
      backgroundColor: '#f5efed',
      height: 100,
      width: 230,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 16
    },
    btn: {
      //borderTopWidth: 0.4,
      width: 80,
     // borderTopColor: '#7db4d1',
      justifyContent: 'center',
      borderWidth: 0.8,
      borderColor: '#3494c7',
      borderRadius: 3,
    },
    btnText: {
      fontSize: 16,
      textAlign: 'center',
      padding: 3
    },
    text: {
      fontSize: 16
    },
    postInput: {
     // height: '90%',
      width: '90%',
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      fontFamily: AppStyles.customFonts.robotoRegular
    },
    topContainer: {
      flex: 0.35,
    },
    bottomContainer: {
     //flex: 1,
     position: 'absolute',
     bottom: 0,
     width: '100%'
    },
    blankBottom: {
      // ...ifIphoneX(
      //   {
      //     flex: 1.1,
      //   },
      //   {
      //     flex: 1.4,
      //   },
      // ),
      borderTopWidth: 0.3,
      borderTopColor: '#7db4d1'
    },
    postImageAndLocationContainer: {
      width: '100%',
     // backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    imagesContainer: {
      width: '100%',
      marginBottom: 0,
     // marginTop: 10,
      paddingLeft: 10
    },
    imageItemcontainer: {
      width: 65,
      height: 65,
      margin: 3,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      overflow: 'hidden',
    },
    imageItem: {
      width: '100%',
      height: '100%',
    },
    addImageIcon: {
      width: '50%',
      height: '50%',
    },
    location: {
      flexDirection: 'row',
      //height: 40,
      alignItems: 'center',
      flex: 1
    },
    addTitleAndlocationIconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      //height: 20,
     // backgroundColor: 'white'
    },
    addTitleContainer: {
     //flex: 5,
      justifyContent: 'center',
      //backgroundColor: 'white'
    },
    addTitle: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 13,
      padding: 8,
      marginBottom: 15
    },
    iconsContainer: {
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconContainer: {
      marginHorizontal: 2,
      flex: 0.1
    },
    icon: {
      height: 23,
      width: 23,
    },
    imageBackground: {
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    cameraFocusTintColor: {
      tintColor: AppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    cameraUnfocusTintColor: {
      tintColor: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    pinpointTintColor: {
      tintColor: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    privacyBtn: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: 5,
      borderColor: '#bec0c2',
      justifyContent: 'center',
      marginTop: 3,
      borderWidth: 1
    },
    privacy: {
      fontSize: 13,
      color: '#8f9294'
    },
    privacyIcon: {
      paddingHorizontal: 4
    },
    down: {
      paddingLeft: 7,
    },
    HeaderBody: {
      width: Scales.deviceWidth,
      //height: Scales.deviceHeight * 0.13,
      height: 54,
      // paddingTop: Scales.deviceHeight * 0.04,
      backgroundColor: 'white',
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
  
    headerTitleContainer: {
      width: Scales.deviceWidth * 0.8,
      height: 35,
      //alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      paddingLeft: 40
    },
    
    titleText: {
      fontSize: Scales.moderateScale(19),
      fontFamily: AppStyles.customFonts.klavikaMedium
    },
    whocansee: {
      fontWeight: 'bold',
      fontSize: 16
    },
    privacyDesc: {
      fontSize: 16,
      color: '#696a6b',
      paddingVertical: 6,
      marginBottom: 8
    },
    privacyOption: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingTop: 13,
      borderBottomColor: '#8f9294',
      borderBottomWidth: 0.2,
      alignItems: 'center',
      width: Scales.deviceWidth,
      paddingLeft: 10,
      paddingBottom: 13
    },
    option: {
      fontSize: 16,
      color: '#5c5b5b'
    },
    optionDesc: {
      fontSize: 12,
      color: '#7f8182'
    },
    picon: {
      paddingHorizontal: 9,

    },
    emptyCircle: {
      width: 18, 
      height: 18, 
      borderRadius: 10, 
      borderWidth: 1,
      borderColor: 'gray'
    }
  });
};

export default dynamicStyles;
