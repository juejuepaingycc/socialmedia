import { StyleSheet } from 'react-native';
import AppStyles from '../../../AppStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const commentItemHeight = 80;
const commentBodyPaddingLeft = 8;

const reactionIconSize = Math.floor(AppStyles.WINDOW_WIDTH * 0.09);

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    detailPostContainer: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    commentItemContainer: {
      //alignSelf: 'center',
      flexDirection: 'row',
      marginVertical: 1,
    },
    left: {
      marginLeft: hp(4)
    },
    commentItemImageContainer: {
      //flex: 1,
      alignItems: 'center',
    },
    commentItemImage: {
      height: hp(4.5),
      width: hp(4.5),
      borderRadius: 50,
      marginVertical: 5,
      marginHorizontal: hp(1.4)
    },
    replyItemImage: {
      height: hp(3.5),
      width: hp(3.5),
      borderRadius: 18,
      marginVertical: 5,
      marginLeft: 5,
    },
    commentItemBodyContainer: {
     // flex: 5.5,
    },
    replyItemBodyContainer: {
      flex: 4,
    },
    commentButtonsContainer: {
      flexDirection: 'row', 
      marginTop: 3,
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.71),
    },
    replyButtonsContainer: {
      flexDirection: 'row', 
      marginTop: 3,
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.62),
    },
    commentItemBodyRadiusContainer: {
      width: wp(70),
      padding: hp(1),
      borderRadius: hp(1),
      margin: hp(0.7),
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    replyItemBodyRadiusContainer: {
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.62),
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
    Image: {
      width: hp(1.6),
      height: hp(1.6),
      //margin: 6,
    },
    commentItemBodySubtitle: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      paddingLeft: commentBodyPaddingLeft,
    },
    replyItemBodySubtitle: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
    },
    row: {
      flexDirection: 'row',
      paddingLeft: commentBodyPaddingLeft,
    },
    commentItemReplyName: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      //
      fontWeight: 'bold'
    },
    inputContainer: {
      height: hp(10)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    },
    commentInputContainer: {
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
      flexDirection: 'row',
      width: '100%',
      height: hp(6),
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
      fontSize: 13,
    },
    reply2: {
      color: '#3494c7',
      fontSize: 13,
      marginTop: -2
    },
    replyBtn: {
      marginHorizontal: 10,
      flexDirection: 'row',
    },
    commentTime: {
      marginLeft: 14,
      color: AppStyles.colorSet['light'].mainSubtextColor,
      color: '#6e7173',
      fontSize: 11,
      alignSelf: 'center'
    },
    reactionBtn: {
      flexDirection: 'row',
      position: 'absolute',
      right: 0,
      alignItems: 'center',
      padding: 1
      //marginLeft: 40
    },
    replyreactionContainer:  {
      flexDirection: 'row',
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      position: 'absolute',
      bottom: 30,
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.68),
      height: 48,
      borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.07),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
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
    bottomModal: {
      height: 70,
      //alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      justifyContent: 'center'
      //backgroundColor: 'rgba(150, 153, 153,0.6)'
    },
    removeIcon: {
      right: 10,
      position: 'absolute',
      top: -10
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
    }
  });
};

export default dynamicStyles;
