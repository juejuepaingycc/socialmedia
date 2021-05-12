import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';
import { Colors, Scales } from '@common';

const reactionIconSize = Math.floor(AppStyles.WINDOW_WIDTH * 0.09);

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      width: Math.floor(AppStyles.WINDOW_WIDTH),
      alignSelf: 'center',
      marginVertical: 6,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    headerContainer: {
      flexDirection: 'row',
    },
    userImageContainer: {
      borderWidth: 0,
      overflow: 'hidden',
    },
    titleContainer: {
      flex: 6,
      justifyContent: 'center',
    },
    title: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 15,
      fontWeight: '600',
      fontFamily: AppStyles.customFonts.klavikaMedium
    },
    mainSubtitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 3,
    },
    subtitleContainer: {
     // flex: 1.3,
    },
    subtitle: {
      color: AppStyles.colorSet[colorScheme].mainSubtextColor,
      fontSize: 10,
    },
    loc: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainSubtextColor,
    },
    moreIconContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    moreIcon: {
      height: 18,
      width: 18,
      tintColor: AppStyles.colorSet[colorScheme].mainSubtextColor,
      margin: 0,
    },
    bodyTitleContainer: {
      marginHorizontal: 8,
    },
    body: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 13,
      lineHeight: 18,
      paddingBottom: 15,
      paddingHorizontal: 12,
      fontFamily: AppStyles.customFonts.robotoRegular
    },
    moreText: {
      color: AppStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 13,
      lineHeight: 18,
      paddingBottom: 15,
      paddingHorizontal: 12,
    },
    bodyImageContainer: {
     //height: AppStyles.WINDOW_HEIGHT * 0.3
     height: 350
    },
    bodyImage: {
      height: '100%',
      width: '100%',
    },
    inactiveDot: {
      backgroundColor: 'rgba(255,255,255,.3)',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: '#fff',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    reactionContainer: {
      flexDirection: 'row',
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      position: 'absolute',
      bottom: 55,
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.68),
      height: 48,
      borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.07),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
      zIndex: 2
    },
    reactionIconContainer: {
      margin: 3,
      padding: 0,
      backgroundColor: 'powderblue',
      width: reactionIconSize,
      height: reactionIconSize,
      borderRadius: reactionIconSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reactionIcon: {
      width: reactionIconSize,
      height: reactionIconSize,
      margin: 0,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    footerContainer: {
      backgroundColor: '#f0f2f5',
      width: '100%'
    },
    countRow: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomWidth: 0.3,
      borderBottomColor: 'lightgray',
      marginHorizontal: 16,
      marginVertical: 0,
      paddingVertical: 0,
    },
    twocard: {
      flexDirection: 'row'
    },  
    footerIconContainer2: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      marginVertical: 4,
      
    },
    footerIconContainer3: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      marginVertical: 4,
      
    },
    footerIconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    footerIcon: {
      margin: 3,
      height: 18,
      width: 18,
      marginLeft: 5
    },
    mediaVideoLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    centerItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundIconContainer: {
      position: 'absolute',
      backgroundColor: 'transparent',
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundIcon: {
      tintColor: 'black',
      width: 19,
      height: 19,
    },
    topRow: {
      flexDirection: 'row'
    },
    at: {
      color: 'gray',
      fontSize: 14
    },
    tintColor: { tintColor: AppStyles.colorSet[colorScheme].mainTextColor },
  });
};

export default dynamicStyles;
