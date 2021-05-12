import { StyleSheet } from 'react-native';

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
    chatItemContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    unseenIcon: {
      width: 10,
      height: 10,
      backgroundColor: '#3484c7',
      borderRadius: 10,
      marginRight: 10,
      alignSelf: 'center'
    },
    chatItemContent: {
      flex: 1,
      alignSelf: 'center',
      marginLeft: 10,
    },
    chatFriendName: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      //fontWeight: '500',
      //fontFamily: appStyles.customFonts.klavikaMedium
    },
    chatFriendName2: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      fontWeight: 'bold',
      //fontFamily: appStyles.customFonts.klavikaMedium
    },
    content: {
      flexDirection: 'row',
      marginTop: 5,
    },
    message: {
      flex: 2,
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      
    },
    unseenMessage: {
      flex: 2,
      fontWeight: 'bold',
      color:'black'
    }
  });
};

export default dynamicStyles;
