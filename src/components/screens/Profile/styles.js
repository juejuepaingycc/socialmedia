import { StyleSheet } from 'react-native';
import AppStyles from '../../../AppStyles';

// const imageContainerWidth = 66;
const imageWidth = 110;

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    progressBar: {
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeForegroundColor,
      height: 3,
      shadowColor: '#000',
      width: 0,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '92%'
    },
    subContainer: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
      alignItems: 'center',
    },
    userImage: {
      width: imageWidth,
      height: imageWidth,
      borderRadius: Math.floor(imageWidth / 2),
      borderWidth: 0,
    },
    userImageContainer: {
      width: imageWidth,
      height: imageWidth,
      borderWidth: 0,
      marginTop: 10,
      marginBottom: 7
    },
    userImageMainContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    userName: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: '600',
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingTop: 0,
      fontFamily: AppStyles.customFonts.klavikaMedium
    },
    half: {
      width: '49%'
    },
    profileSettingsButtonContainer: {
      width: '92%',
      height: 40,
      borderRadius: 8,
      backgroundColor: AppStyles.colorSet[colorScheme].mainButtonColor,
      marginVertical: 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileSettingsTitle: {
      color: AppStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 13,
      fontWeight: '600',
    },
    FriendsTitle: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 20,
      fontWeight: '600',
      alignSelf: 'flex-start',
      padding: 10,
      fontFamily: AppStyles.customFonts.klavikaMedium,
      paddingTop: 0
    },
    qrscan: {
      width: 60, height: 60, 
      borderRadius: 8, 
      overflow: 'hidden',
      borderColor: '#cad2de',
      //borderWidth: 1
    },
    FriendsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '98%',
    },
    friendCardContainer: {
      height: Math.floor(AppStyles.WINDOW_HEIGHT * 0.18),
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.292),
      borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.013),
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      justifyContent: 'flex-start',
      overflow: 'hidden',
      margin: 5,
    },
    friendCardImage: {
      height: '75%',
      width: '100%',
    },
    friendCardTitle: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 13,
      padding: 4,
      fontFamily: AppStyles.customFonts.klavikaMedium
    },
    subButtonColor: {
      backgroundColor: AppStyles.colorSet[colorScheme].subButtonColor,
    },
    titleStyleColor: { color: AppStyles.colorSet[colorScheme].mainTextColor },
    moreBtn: {
      alignItems: 'center',
      paddingBottom: 7,
      paddingTop: 0
    },
    moreIcon: {

    },
    loadmore: {
      color: 'gray',
      fontSize: 12,
      margin: 0
    },
    loadmoreBtn: {
      alignItems: 'center',
      paddingVertical: 4,
      width: 130,
      alignSelf: 'center',
      borderRadius: 6,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 8,

      backgroundColor: '#3494c7',
      //borderWidth: 1,
      //borderColor: '#3494c7'
    },
    loadmoreText: {
      fontSize: 15,
      paddingRight: 5,

      color: 'white',
    },
    nomore: {
      color: 'gray',
      fontSize: 13,
      marginBottom: 10,
      textAlign: 'center'
    }
  });
};

export default dynamicStyles;
