import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

const commentItemHeight = 80;
const commentBodyPaddingLeft = 8;

const styles = () => {
  return new StyleSheet.create({
    detailPostContainer: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    commentItemContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
      marginVertical: 2,
    },
    commentItemImage: {
      height: 36,
      width: 36,
      borderRadius: 18,
      marginVertical: 5,
      marginLeft: 5,
    },
    replyItemImage: {
      height: 25,
      width: 25,
      borderRadius: 18,
      marginVertical: 5,
      marginLeft: 5,
    },
    commentItemBodyContainer: {
      flex: 5,
    },
    commentItemBodyRadiusContainer: {
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.71),
      padding: 7,
      borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.03),
      margin: 5,
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    commentItemBodyTitle: {
      fontSize: 12,
      fontWeight: '500',
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      paddingLeft: commentBodyPaddingLeft,
      lineHeight: 12,
    },
    commentItemBodySubtitle: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      paddingLeft: 8,
    },
    row: {
      flexDirection: 'row',
      paddingLeft: 18,
    },
    commentItemReplyName: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      //
      fontWeight: 'bold'
    },
    commentInputContainer: {
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
      flexDirection: 'row',
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    commentTextInputContainer: {
      flex: 6,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      height: '90%',
      width: '90%',
      marginLeft: 8,
      justifyContent: 'center',
    },
    commentTextInput: {
      padding: 8,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    commentInputIconContainer: {
      flex: 0.7,
      justifyContent: 'center',
      marginLeft: 8,
    },
    commentInputIcon: {
      height: 22,
      width: 22,
      tintColor: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    placeholderTextColor: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    reply: {
      color: '#3494c7',
      fontSize: 13
    },
    replyBtn: {
      marginLeft: 19,
      marginTop: -3,
      flexDirection: 'row'
    },

    bottomModal: {
      height: 70,
      //alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      justifyContent: 'center',
      //backgroundColor: 'rgba(150, 153, 153,0.6)'
    },
    removeIcon: {
      width: 30,
      right: 10,
      position: 'absolute',
      top: -10,
      alignSelf: 'flex-end',
      backgroundColor: 'red'
    },
    editedText: {
      fontSize: 11,
      color: '#677c85',
      paddingLeft: commentBodyPaddingLeft,
      paddingBottom: 1,
      paddingTop: 3
    },
    replyingView: {
      flexDirection: 'row',
      paddingLeft: hp(1.6),
      paddingVertical: hp(0.8)
    },
    cancelBtn: {
      paddingLeft: hp(1.4)
    },
    cancelText: {
      fontSize: hp(1.7),
      fontWeight: 'bold',
      color: '#3494c7'
    },
    replyingText: {
      fontSize: hp(1.6),
    },
    modalBackground2: {
      flex: 1,
      //backgroundColor: 'rgba(150, 153, 153,0.6)',
      width: Scales.deviceWidth,
      height: Scales.deviceHeight,
      backgroundColor: 'red'
      //alignItems: 'center',
    },
    modalView: {
      alignItems: 'center',
      backgroundColor: 'red',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      width: Scales.deviceWidth,
      height: Scales.deviceHeight,
    },
    header: {
      flexDirection: 'row',
      paddingVertical: 13,
      borderBottomWidth: 0.3,
      borderBottomColor: 'gray',
      width: Scales.deviceWidth,
      justifyContent: 'space-between',
    },
    headerText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    commentItemImageContainer: {
      flex: 1,
      alignItems: 'center',
    },
    commentItemBodyContainer: {
      flex: 5,
    },
    body: {
      marginTop: 16
    },
    inputContainer: {
      borderRadius: 8,
      backgroundColor: '#c3c7c9',
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      paddingLeft: 6,
      backgroundColor: AppStyles.colorSet['light'].whiteSmoke,
      marginRight: 16
    },
    input: {
      alignSelf: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 3,
      paddingRight: 20,
      width: '93%',
      fontSize: 16,
      lineHeight: 22,
      color: AppStyles.colorSet['light'].mainTextColor,
    },
    btnView: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      marginRight: 16,
      marginTop: 10
    },
    cancelBtn: {
      borderRadius: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderWidth: 1,
      borderColor: '#c3c7c9',
      marginRight: 10
    },
    updateBtn: {
      borderRadius: 5,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: 'black'
    },
    cancelText: {
      fontSize: 14
    },
    updateText: {
      fontSize: 14,
      color: 'white'
    }
  });
};

export default styles;
