import { StyleSheet } from 'react-native';
import { Scales } from '@common';

const imageSize = 40;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      //flexDirection: 'row',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    userImageMainContainer: {
      flex: 1,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 7,
    },
    con: {
      //width: Scales.deviceWidth,
     // backgroundColor: 'transparent',
    },
    indicatorContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: 'rgba(52, 52, 52, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      marginTop: 150,
      marginLeft: (Scales.deviceWidth - 100)/2
    },
    userImageContainer: {
      width: imageSize,
      height: imageSize,
      borderWidth: 0,
      alignItems: 'flex-end',
    },
    userImage: {
      width: imageSize,
      height: imageSize,
    },
    notificationItemBackground: {
      flex: 1,
    },
    notificationItemContainer: {
      flexDirection: 'row',
      width: '95%',
      height: 70,
      alignSelf: 'center',
      borderBottomColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderBottomWidth: 0.3,
    },
    notificationLabelContainer: {
      flex: 5.4,
      justifyContent: 'center',
    },
    description: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 12,
      paddingVertical: 3,
    },
    name: {
      fontWeight: '700',
    },
    moment: {
      fontSize: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 12,
      paddingVertical: 3,
    },
    seenNotificationBackground: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    unseenNotificationBackground: {
      backgroundColor: appStyles.colorSet[colorScheme].mainButtonColor,
    },
  });
};

export default dynamicStyles;
