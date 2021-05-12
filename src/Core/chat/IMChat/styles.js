import { StyleSheet, Dimensions } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { size } from '../../helpers/devices';
import { Scales } from '@common';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const WINDOW_WIDTH = Dimensions.get('window').width;

const dynamicStyles = (appStyles, colorScheme, outBound) => {
  const chatBackgroundColor =
    appStyles.colorSet[colorScheme].mainThemeBackgroundColor;
  const audioPlayPauseContainerSize = 24;
  const audioPlayIconSize = 15;

  return StyleSheet.create({
    safeAreaViewContainer: {
      backgroundColor: chatBackgroundColor,

      flex: 1,
      ...ifIphoneX(
        {
          marginBottom: 25,
        },
        {
          marginBottom: 5,
        },
      ),
    },
    personalChatContainer: {
      backgroundColor: chatBackgroundColor,
      flex: 1,
    },
    //Bottom Input
    bottomContentContainer: {
      backgroundColor: chatBackgroundColor,
      ...ifIphoneX(
        {
          paddingBottom: 19,
        },
        {
          paddingBottom: 5,
        },
      ),
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
    modalBackground: {
      flex: 1,
      //alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      //backgroundColor: '#00000040'
      backgroundColor: 'rgba(150, 153, 153,0.6)'
    },
    titleBox: {
      backgroundColor: 'pink'
    },
    titleText: {
     // fontSize: 16,
      //color: '#000'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#cdcfd4',
      borderBottomWidth: 0.2,
      
    },
    row2: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0
    },
    menu: {
      alignItems: 'center',
      marginVertical: 5,
      paddingVertical: 10,
      //width: '33%',
      borderRightColor: '#cdcfd4',
      borderRightWidth: 0.2,
      borderBottomColor: '#cdcfd4',
      borderBottomWidth: 0.2,
      width: Scales.deviceWidth * 0.33,
    },
    menu2: {
      alignItems: 'center',
      marginVertical: 5,
      paddingVertical: 10,
      //width: '33%',
      borderRightColor: '#cdcfd4',
      borderRightWidth: 0.2,
      // borderBottomColor: '#cdcfd4',
      // borderBottomWidth: 0.2,
      width: Scales.deviceWidth * 0.33,
    },
    menuTitle: {
      fontSize: 15,
      color: 'gray'
    },
    inputContainer: {
      flex: 8,
      borderRadius: 20,
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      paddingLeft: 6
    },
    micIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      backgroundColor: 'transparent',
      marginHorizontal: 4
    },
    inputBar: {
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: appStyles.colorSet[colorScheme].hairlineColor,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flexDirection: 'row',
    },
    progressBar: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      height: 3,
      shadowColor: '#000',
      width: 0,
    },
    inputIconContainer: {
      margin: 10,
      flex: 0.7,
    },
    inputIcon: {
      tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      width: 25,
      height: 25,
    },
    micIcon: {
      tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      width: 17,
      height: 17,
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
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    editToView: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopWidth: 1,
      borderTopColor: appStyles.colorSet[colorScheme].hairlineColor,
      padding: 8,
      flex: 1,
      flexDirection: 'column',
      marginBottom: 17
    },
    inReplyToView: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopWidth: 1,
      borderTopColor: appStyles.colorSet[colorScheme].hairlineColor,
      padding: 8,
      flex: 1,
      flexDirection: 'column',
      marginBottom: 30
    },
    editHeaderText: {
      fontSize: 13,
      color: 'gray',
      marginBottom: 4,
    },
    replyingToHeaderText: {
      fontSize: 13,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      marginBottom: 4,
    },
    replyingToNameText: {
      fontWeight: 'bold',
    },
    replyingToContentText: {
      fontSize: 12,
      color: appStyles.colorSet[colorScheme].grey9,
    },
    replyingToCloseButton: {
      position: 'absolute',
      right: 0,
      top: 2,
    },
    replyingToCloseIcon: {
      width: 25,
      height: 25,
      tintColor: appStyles.colorSet[colorScheme].grey9,
    },
    // Message Thread
    messageThreadContainer: {
      margin: 6,
    },
    top1: {
      marginTop: 30
    },
    // Thread Item
    sendItemContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexDirection: 'row',
      marginBottom: 10,
    },
    postUser: {
      paddingLeft: 19,
      paddingBottom: 3,
      fontSize: 10,
      color: 'gray'
    },
    itemContent: {
      padding: hp(1),
      backgroundColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderRadius: 10,
    },
    sendItemContent: {
      marginRight: hp(0.4),
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    sendImgContent: {
      marginRight: hp(0.4),
      //padding: hp(1),
    },
    receiveImgContent: {
      marginLeft: hp(0.4),
      //padding: hp(1),
    },
    mediaMessage: {
      width: size(300),
      height: size(250),
      borderRadius: 10,
      overflow: 'hidden'
    },
    boederImgSend: {
      position: 'absolute',
      width: size(300),
      height: size(250),
      resizeMode: 'stretch',
      tintColor: chatBackgroundColor,
    },
    textBoederImgSend: {
      position: 'absolute',
      right: -5,
      bottom: 0,
      width: 20,
      height: 8,
      resizeMode: 'stretch',
      tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    sendTextMessage: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    sendTextMessage3: {
      fontSize: 16,
      color: 'black',
    },
    sendTextMessage2: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      textDecorationLine: 'underline',
      paddingBottom: hp(0.3)
    },
    userIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
    receiveItemContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      flexDirection: 'row',
      marginBottom: 10,
    },
    receiveItemContent: {
      marginLeft: hp(0.4),
    },
    boederImgReceive: {
      position: 'absolute',
      width: size(300),
      height: size(250),
      resizeMode: 'stretch',
      tintColor: chatBackgroundColor,
    },
    receiveTextMessage: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 16,
      textDecorationLine: 'underline',
      paddingBottom: hp(0.3)
    },
    missedCallMessage: {
      color: 'black',
      fontSize: 14,
      fontWeight: 'bold',
    },
    durationView: {
      flexDirection: 'row',
      //justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 3
    },
    duration: {
      color: '#a5abad',
      fontSize: 12,
      paddingLeft: 6
    },
    textBoederImgReceive: {
      position: 'absolute',
      left: -5,
      bottom: 0,
      width: 20,
      height: 8,
      resizeMode: 'stretch',
      tintColor: appStyles.colorSet[colorScheme].hairlineColor,
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
    playButton: {
      position: 'absolute',
      top: '40%',
      alignSelf: 'center',
      width: 38,
      height: 38,
      overflow: 'hidden',
    },
    myMessageBubbleContainerView: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexDirection: 'column',
      maxWidth: '70%',
    },
    theirMessageBubbleContainerView: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      maxWidth: '70%',
    },
    inReplyToItemContainerView: {
      overflow: 'hidden',
      flex: 1,
      marginBottom: -20,
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    inReplyToTheirItemContainerView: {
      overflow: 'hidden',
      flex: 1,
      marginBottom: -20,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    inReplyToItemHeaderView: {
      flexDirection: 'row',
      marginTop: 15,
      marginRight: 10,
    },
    inReplyToIcon: {
      width: 12,
      height: 12,
      marginRight: 5,
      tintColor: appStyles.colorSet[colorScheme].grey9,
      marginTop: 1,
      marginLeft: 10,
    },
    inReplyToHeaderText: {
      fontSize: 12,
      color: appStyles.colorSet[colorScheme].grey9,
      marginBottom: 5,
    },
    inReplyToItemBubbleView: {
      borderRadius: 15,
      backgroundColor: appStyles.colorSet[colorScheme].grey3,
      paddingBottom: 30,
      paddingLeft: 15,
      paddingRight: 10,
      paddingTop: 5,
      overflow: 'hidden',
      flex: 1,
    },
    inReplyToItemBubbleText: {
      color: appStyles.colorSet[colorScheme].grey9,
      fontSize: 14,
    },
    // Bottom Audio Recorder
    recorderContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      //flex: 1,
     // backgroundColor: 'red',
      height: hp(20)
    },
    counterContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      height: hp(10),
      //backgroundColor: 'green'
    },
    counterText: {
      fontSize: 14,
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    recorderButtonsContainer: {
      //flex: 1.8,
      paddingHorizontal: 5,
      //paddingBottom: 40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: hp(10),
    },
    recorderButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: hp(8),
      //backgroundColor: 'pink'
    },
    recorderControlButton: {
      width: '96%',
      //height: '90%',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9272a',
      paddingVertical: hp(1)
    },
    butonAlternateColor: {
      backgroundColor: '#f9272a',
      paddingVertical: hp(1)
    },
    recoderControlText: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].whiteSmoke,
    },
    // Audio media thread item
    audioMediaThreadItemContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'center',
      width: Math.floor(WINDOW_WIDTH * 0.5),
      padding: 9,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 10
    },
    theiraudioMediaThreadItemContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'center',
      width: Math.floor(WINDOW_WIDTH * 0.5),
      padding: 9,
      borderRadius: 10
    },
    audioPlayPauseIconContainer: {
      flex: 2,
      justifyContent: 'center',
      zIndex: 9,
    },
    playPauseIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: outBound
        ? appStyles.colorSet[colorScheme].hairlineColor
        : appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      height: audioPlayPauseContainerSize,
      width: audioPlayPauseContainerSize,
      borderRadius: Math.floor(audioPlayPauseContainerSize / 2),
    },
    audioMeterContainer: {
      flex: 6.5,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    audioMeter: {
      width: '95%',
      height: 6,
      paddingLeft: 7,
    },
    audioMeterThumb: {
      width: 9,
      height: 9,
    },
    audioTimerContainer: {
      //flex: 2.5,
      //justifyContent: 'center',
      //alignItems: 'center',
    },
    audioPlayIcon: {
      width: audioPlayIconSize,
      height: audioPlayIconSize,
      tintColor: outBound
        ? appStyles.colorSet[colorScheme].hairlineColor
        : appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      // marginLeft: 2,
    },
    audioTimerCount: {
      color: outBound
        ? appStyles.colorSet[colorScheme].hairlineColor
        : appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 12,
    },
    // maximumAudioTrackTintColor: {
    //   color: appStyles.colorSet[colorScheme].hairlineColor,
    // },
    minimumAudioTrackTintColor: {
      color: outBound
        ? appStyles.colorSet[colorScheme].hairlineColor
        : appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    audioThumbTintColor: {
      color: outBound
        ? appStyles.colorSet[colorScheme].hairlineColor
        : appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    block: {
      flexDirection: 'row',
      padding: 8,
      width: Scales.deviceWidth * 0.9,
      alignSelf: 'center',
      //justifyContent: 'center',
      alignItems: 'center'
    },
    img: {
      width: Scales.deviceWidth * 0.12,
      height: Scales.deviceWidth * 0.12,
      borderRadius: 50,
      marginRight: 13
    },
    removeView: {
      position: 'absolute',
      right: 10,
      justifyContent: 'center'
    },
    name: {
      fontWeight: 'bold',
      fontSize: 16,
      //paddingBottom: 6
    },
    modalTitle: {
      //paddingVertical: 18,

      height: 60, 
      flexDirection: 'row', 
      alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        marginBottom: 13

    },
    headerText: {
      fontFamily: appStyles.customFonts.klavikaMedium,
      fontSize: 18,
      paddingLeft : 20
    },
    myTime: {
      color: '#cdd0d4',
      textAlign: 'right',
      fontSize: 12
    },
    myDate: {
      color: '#cdd0d4',
      textAlign: 'right',
      fontSize: 12
    },
    theirTime: {
        color: '#7a7c7d',
        fontSize: 12
    },
    theirDate: {
      color: '#7a7c7d',
      fontSize: 12
    },
    dateView: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    imgdateView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(0.3)
    },
    mm: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 10
    },
    nn: {
      backgroundColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderRadius: 10
    },
    audioDateView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      marginTop: -4,
      marginHorizontal: 8,
    },
    myImgTime: {
      color: '#88898a',
      textAlign: 'right',
      fontSize: 12,
      marginRight: 10,
      marginTop: -4
    },
    myImgDate: {
      color: '#88898a',
      textAlign: 'left',
      fontSize: 12,
      marginLeft: 10,
      marginTop: -4
    },
    otherImgTime: {
      color: '#7a7c7d',
      fontSize: 12,
      marginRight: 10,
      marginTop: -4,
      //textAlign: 'left'
    },
    otherImgDate: {
      color: '#7a7c7d',
      fontSize: 12,
      marginLeft: 20,
      marginTop: -4,
      textAlign: 'left'
    },
    myAudioTime: {
      color: '#cdd0d4',
      textAlign: 'right',
      fontSize: 12,
      marginBottom: 6,
      marginTop: -7,
      marginRight: 9
    },
    otherAudioTime: {
      color: '#7a7c7d',
      fontSize: 12,
      marginBottom: 6,
      marginTop: -7,
      marginLeft: 9
    },
    at: {
      color: outBound
      ? appStyles.colorSet[colorScheme].hairlineColor
      : appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    fontSize: 12,
    },
    bottom: {
      flexDirection: 'row',
          justifyContent: 'space-between',
          width: Math.floor(WINDOW_WIDTH * 0.46),
          paddingHorizontal: 10,
          marginTop: -8,
          marginBottom: 8
    },
    bottom2: {
      flexDirection: 'row',
          justifyContent: 'space-between',
          width: Math.floor(WINDOW_WIDTH * 0.48),
          paddingHorizontal: 10,
          marginTop: -8,
          marginBottom: 8
    },
    removeIcon: {
      right: 10,
      position: 'absolute',
      top: -10
    },
    onlyCount: {
      width: 30
    },
    otherOnlyCount: {
      width: 30,
    },
    otherReaction: {
      right: 0,
      left: -6
    },
    reactionImgContainer: {
      //backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      backgroundColor: '#f0f3f5',
      //position: 'absolute',
      //top: -20,
      height: 26,
      width: 44,
      borderRadius: 10,
      //alignSelf: 'center',
      alignItems: 'center',
      right: -10,
      justifyContent: 'center',
      zIndex: 1,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'white'
    },
    reactionCount: {
      color: '#8f9294'
    },
    reactionImg: {
      width: 18,
      height: 18,
      marginHorizontal: 3
      //alignSelf: 'flex-start'
    },
    unfilledImg: {
      width: 15,
      height: 15,
      marginHorizontal: 3
      //alignSelf: 'flex-start'
    },
    reactionContainer: {
      flexDirection: 'row',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      position: 'absolute',
      bottom: -20,
      width: Math.floor(appStyles.WINDOW_WIDTH * 0.8),
      height: 48,
      borderRadius: Math.floor(appStyles.WINDOW_WIDTH * 0.07),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
      right: 40,
      zIndex: 3
    },
    reactionIconContainer: {
    },
    bottomBtn: {
      marginVertical: hp(1),
      width: wp(100),
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 1
    },
    tt: {
      color: 'gray',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    unblockBtn: {
      width: wp(80),
      backgroundColor: '#a64c46',
      alignSelf: 'center',
      borderRadius: hp(1),
      paddingVertical: hp(1.4),
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: hp(1.2)
    },
    unblockText: {
      color: 'white',
      fontSize: hp(2),
    
    },
    blockview: {
      marginBottom: hp(1.4)
    },
    blockText: {
      textAlign: 'center',
      color: 'gray',
      //fontSize: hp(2),
      fontWeight: 'bold'
    },
    shareImage: {
      width: wp(69.5),
      height: hp(14)
    },
    shareView: {
      backgroundColor: '#3494c7',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#3494c7',
      width: wp(70),
      marginRight: hp(0.6)
    },
    shareName: {
      paddingVertical: hp(1.2),
      fontSize: hp(2),
      color: '#3494c7',
      paddingLeft: hp(0.6),
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'white',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    shareContent: {
      paddingVertical: hp(1.2),
      fontSize: hp(1.8),
      color: 'white',
      paddingHorizontal: hp(0.6),
    },
    sharefromContent: {
      paddingVertical: hp(1.2),
      fontSize: hp(1.8),
      color: 'whitesmoke',
      paddingHorizontal: hp(0.6),
      fontStyle: 'italic'
    },

    othershareImage: {
      width: wp(69.5),
      height: hp(14)
    },
    othershareView: {
      backgroundColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].hairlineColor,
      width: wp(70),
      marginLeft: hp(0.6)
    },
    othershareName: {
      paddingVertical: hp(1.2),
      fontSize: hp(2),
      paddingLeft: hp(0.6),
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'white',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    othershareContent: {
      paddingVertical: hp(1.2),
      fontSize: hp(1.8),
      paddingHorizontal: hp(1),
    },
    othersharefromContent: {
      paddingVertical: hp(1.2),
      fontSize: hp(1.8),
      paddingHorizontal: hp(0.6),
      fontStyle: 'italic'
    },
  });
};

export default dynamicStyles;
