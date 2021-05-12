import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';
import AppStyles from '../../AppStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  //  alignItems: 'center',
    //justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth,
    alignItems: 'center',
    marginBottom: Scales.deviceHeight * 0.05,
    // backgroundColor: 'red',
  },
  otpdescView: {
    paddingTop: 16,
    width: '90%',
    alignItems: 'center',
    paddingBottom: 5
  },
  resendView: {
    paddingVertical: 5,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  phone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f484d'
  },
  otpdesc: {
    fontSize: 17,
    color: '#3f484d',
  },
  resenddesc: {
    fontSize: 16,
    color: '#545e63',
  },
  resend: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3494c7'
  },
  midContainer: {
    width: Scales.deviceWidth,
    alignItems: 'center',
    
  },
  topContainer: {
    justifyContent: 'center',
    width: Scales.deviceWidth,
    alignItems: 'center',
    marginTop: Scales.deviceHeight * 0.05,
    marginBottom: Scales.deviceHeight * 0.05
  },
  topImage: {
    width: Scales.deviceHeight * 0.16,
    height: Scales.deviceHeight * 0.12,
  },
  textContainer: {
    //height: '10%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 25
  },
  welcomeText2: {
    fontSize: 35,
    color: '#3494c7',
    fontFamily: AppStyles.customFonts.klavikaMedium,
    textAlign: 'center',
    paddingTop: 0
  },
  welcomeText: {
    fontSize: Scales.moderateScale(18),
    //fontWeight: 'bold',
    color: '#3494c7',
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
  loginText: {
    fontSize: Scales.moderateScale(22),
    //fontWeight: '700',
    paddingLeft: 10,
    paddingRight: 10,
    // marginBottom: 10,
    color: Colors.TRANSPARENT_BLACK5,
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
  loginLineText: {
    fontSize: Scales.moderateScale(17),
    color: Colors.TRANSPARENT_BLACK5,
  },

  card: {
    //paddingTop: 25,
    paddingBottom: 15,
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
  //  marginTop: '5%',
  },
  bottomImage: {
    width: Scales.deviceHeight * 0.18,
    height: Scales.deviceHeight * 0.15,
  },
  nrcc: {
    width: Scales.deviceHeight * 0.18,
    height: Scales.deviceHeight * 0.3,
    position: 'absolute',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  text: {
    color: 'gray',
    padding: 0,
    marginTop: -20
  },
  activityIndicatorWrapper: {
    backgroundColor: '#f5efed',
    height: 100,
    width: 120,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  input: {
    flex: 1,
    borderLeftWidth: 1,
    borderRadius: 3,
    borderColor: AppStyles.colorSet['light'].grey3,
    color: AppStyles.colorSet['light'].mainTextColor,
    fontSize: 17,
    fontWeight: '700',
    backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
  },
  codeFieldContainer: {
    borderWidth: 1,
    borderColor: AppStyles.colorSet['light'].grey3,
    width: '80%',
    height: 42,
    marginTop: 30,
    alignSelf: 'center',
    borderRadius: 25,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
    marginBottom: 20
  },
  nrcText: {
   // position: 'absolute',
    paddingTop: 40,
    paddingLeft: 40,
    fontSize : 15,
    color: '#5e6063',
    fontWeight: "700"
    //backgroundColor: 'rgba(255,255,255,0.6)',
  },
  nrcView: {

  },
  picture: {
    width: Scales.deviceWidth * 0.9,
    paddingTop: 23
  },
  label: {
    color: 'gray',
    paddingLeft: 15
  },
  phoneInputContainer: {
    width: Scales.deviceWidth * 0.85,
    borderBottomWidth: 1,
    marginTop: Scales.deviceHeight * 0.035,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  placeholderText: {
    fontSize: Scales.moderateScale(15),
    color: Colors.TRANSPARENT_BLACK5,
  },

  body: {
    height: 35,
    width: '100%',
    fontSize: 17,
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 0,
    color: Colors.TRANSPARENT_BLACK8,
    overflow: 'hidden',
  },

  passInputContainer: {
    width: Scales.deviceWidth * 0.8,
    height: 50,
    alignItems: 'center',
    //borderBottomWidth: 2,
    //borderBottomColor: '#3494c7',
    marginTop: Scales.deviceHeight * 0.01,
    marginBottom: Scales.deviceHeight * 0.05,
    //overflow: 'hidden',
  },

  passInputWraper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // height: 50,
  },
  inputIconWraper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderColor: '#3494c7',
    borderBottomWidth: 1,
    height: 50,
    marginTop: Scales.deviceHeight * 0.01,
    marginBottom: Scales.deviceHeight * 0.05,
    marginRight: 2,
  },

  passInput: {
    width: Scales.deviceWidth * 0.85,
    // height: Scales.deviceHeight * 0.06,
    //borderBottomWidth: 2,
    //borderBottomColor: '#3494c7',
    //marginTop: 30,
    //overflow: 'hidden',
  },

  underlineStyleBase: {
    width: Scales.deviceWidth * 0.16,
    //height: Scales.deviceHeight * 0.05,
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: Colors.GRAY,
  },

  underlineStyleHighLighted: {
    borderColor: '#3494c7',
  },

  loginBtnSection: {
    width: Scales.deviceWidth,
    marginTop: Scales.deviceHeight * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loginBtnContainer: {
    width: Scales.deviceWidth * 0.45,
    height: Scales.deviceHeight * 0.06,
    backgroundColor: '#3494c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: Scales.deviceHeight * 0.06,
    borderBottomRightRadius: Scales.deviceHeight * 0.06,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },

  loginBtn: {
    flexDirection: 'row',
    width: Scales.deviceWidth * 0.45,
    height: Scales.deviceHeight * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginBtnText: {
    color: Colors.WHITE,
    fontSize: Scales.moderateScale(20),
    //fontWeight: '700',
    paddingLeft: Scales.moderateScale(8),
    fontFamily: AppStyles.customFonts.klavikaMedium
  },

  forgotContainer: {
    alignItems: 'center',
    width: Scales.deviceWidth * 0.45,
    // paddingTop: Scales.deviceHeight * 0.04,
    // alignSelf: 'flex-end',
  },
  registerContainer: {
    alignItems: 'flex-start',
    //flexDirection: 'row'
   width: Scales.deviceWidth,
   paddingLeft: 10,
   marginBottom: 20
  },

  forgotText: {
    fontSize: Scales.moderateScale(16),
    color: '#3494c7',
    fontWeight: '700',
  },

  registerText: {
    fontSize: Scales.moderateScale(11),
    color: Colors.TRANSPARENT_BLACK5,
    paddingTop: 10
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Scales.deviceWidth * 0.9,
    paddingTop: Scales.deviceHeight * 0.01,
    //paddingBottom: Scales.deviceHeight * 0.03,
  },

  termsBtnText: {
    fontSize: Scales.moderateScale(10),
    color: '#3494c7',
    fontWeight: '700',
  },

  termsText: {
    fontSize: Scales.moderateScale(10),
  },

  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  timerContainer: {
    width: '22%',
  },

  resendButton: {
    height: 20,
    // width: 70,
  },

  InputWraper: {
    width: '78%',
  },

  timerBox: {
    backgroundColor: 'transparent',
    height: 20,
  },
  timerText: {
    fontSize: 14,
    color: Colors.BLUE,
  },

  resendText: {
    color: Colors.BLUE,
  },

  // placeholderText: {
  //   fontSize: Scales.moderateScale(11),
  //   color: Colors.TRANSPARENT_BLACK5,
  // },

  // body: {
  //   height: Scales.deviceHeight * 0.05,
  //   fontSize: 17,
  //   paddingLeft: 5,
  //   paddingRight: 20,
  //   paddingBottom: 0,
  //   color: Colors.TRANSPARENT_BLACK8,
  //   overflow: 'hidden',
  // },

  // passInputContainer: {
  //   width: Scales.deviceWidth * 0.85,
  //   //borderBottomWidth: 2,
  //   //borderBottomColor: '#3494c7',
  //   marginTop: Scales.deviceHeight * 0.01,
  //   //overflow: 'hidden',
  // },

  // passInput: {
  //   width: Scales.deviceWidth * 0.85,
  //   height: Scales.deviceHeight * 0.06,
  //   //borderBottomWidth: 2,
  //   //borderBottomColor: '#3494c7',
  //   //marginTop: 30,
  //   //overflow: 'hidden',
  // },

  // underlineStyleBase: {
  //   width: Scales.deviceWidth * 0.16,
  //   //height: Scales.deviceHeight * 0.05,
  //   borderWidth: 0,
  //   borderRadius: 0,
  //   borderBottomWidth: 2,
  //   borderColor: Colors.GRAY,
  // },

  // underlineStyleHighLighted: {
  //   borderColor: '#3494c7',
  // },

  // proceedBtnContainer: {
  //   width: Scales.deviceWidth * 0.65,
  //   height: Scales.deviceHeight * 0.06,
  //   backgroundColor: '#3494c7',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 10,
  //   marginTop: Scales.deviceHeight * 0.05,
  //   overflow: 'hidden',
  // },

  // proceedBtn: {
  //   flexDirection: 'row',
  //   width: Scales.deviceWidth * 0.65,
  //   height: Scales.deviceHeight * 0.06,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // proceedBtnText: {
  //   color: Colors.WHITE,
  //   fontSize: Scales.moderateScale(25),
  //   fontWeight: '700',
  //   paddingLeft: Scales.moderateScale(8),
  // },

  // loginContainer: {
  //   height: Scales.deviceHeight * 0.2,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'flex-end',
  //   width: Scales.deviceWidth * 0.8,
  //   //paddingTop: Scales.deviceHeight * 0.2,
  //   paddingBottom: Scales.deviceHeight * 0.01,
  //   //position: 'absolute',
  //   //bottom: 0,
  // },

  // loginText: {
  //   fontSize: Scales.moderateScale(18),
  // },

  // loginBtnText: {
  //   fontSize: Scales.moderateScale(18),
  //   color: '#3494c7',
  //   fontWeight: '700',
  // },
 
  imgcontainer: {
    //height: 35,
    paddingRight: hp(0.6),
    borderRightWidth: 1,
    borderRightColor: AppStyles.colorSet['light'].grey3,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  paddingBottom: 1
  },
  countryImg: {
    width: hp(3.7),
    height: 18,
  },
  eye: {
    paddingBottom: 3
  },
  code: {
    fontSize: 17,
    paddingLeft: hp(0.6),
  },
  selectImg: {
    width: hp(3.6),
    height: hp(3),
    resizeMode: 'cover',
    borderRadius: 3
  },
  countries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.7,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderBottomWidth: 0.3,
    borderBottomColor: '#bbbdbd'
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 102, 102,0.7)',
    alignItems: 'center'
  },
  modalBackgroundCancel: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 102, 102,0.7)',
    alignItems: 'center'
  },
  modalView: {
    width: Scales.deviceWidth * 0.7,
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalCancelView: {
    width: Scales.deviceWidth * 0.8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10
  },
  cancelText: {
    alignSelf: 'center',
    color: 'white'
  },
  cancel: {
    justifyContent: 'center',
    alignItems:'center',
    width: Scales.deviceWidth * 0.4,
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: '#3494c7',
    borderRadius: 9,
    marginTop: hp(3)
  }
});
