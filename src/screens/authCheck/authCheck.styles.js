import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth,
    alignItems: 'center',
    marginBottom: Scales.deviceHeight * 0.05,
    // backgroundColor: 'red',
  },

  midContainer: {
    width: Scales.deviceWidth,
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth,
    alignItems: 'center',
    marginTop: Scales.deviceHeight * 0.05,
  },

  topImage: {
    width: Scales.deviceHeight * 0.18,
    height: Scales.deviceHeight * 0.15,
  },
  bottomImage: {
    width: Scales.deviceHeight * 0.18,
    height: Scales.deviceHeight * 0.15,
  },

  textContainer: {
    height: '10%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: Scales.moderateScale(18),
    fontWeight: 'bold',
    color: '#3494c7',
  },
  loginText: {
    fontSize: Scales.moderateScale(30),
    fontWeight: '700',
    paddingLeft: 10,
    paddingRight: 10,
    // marginBottom: 10,
    color: Colors.TRANSPARENT_BLACK5,
  },

  loginLineText: {
    fontSize: Scales.moderateScale(17),
    color: Colors.TRANSPARENT_BLACK5,
  },

  card: {
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    elevation: 15,
    justifyContent: 'center',
    marginTop: '5%',
  },

  passLineText: {
    fontSize: Scales.moderateScale(13),
    paddingTop: 5,
    color: Colors.TRANSPARENT_BLACK5,
  },
  phoneNumberContainer: {
    width: Scales.deviceWidth * 0.85,
    borderWidth: 0.5,
    borderColor: '#3494c7',
    marginTop: Scales.deviceHeight * 0.04,
    overflow: 'hidden',
    alignItems: 'center',
    borderRadius: 10,
    //marginTop: Scales.deviceHeight * 0.1,
    //marginBottom: Scales.deviceHeight * 0.1,
  },

  phoneText: {
    fontSize: Scales.moderateScale(22),
    color: Colors.TRANSPARENT_BLACK5,
  },

  placeholderText: {
    fontSize: Scales.moderateScale(15),
    color: Colors.TRANSPARENT_BLACK5,
  },

  body: {
    height: Scales.deviceHeight * 0.05,
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
    borderTopLeftRadius: Scales.deviceHeight * 0.06,
    borderBottomLeftRadius: Scales.deviceHeight * 0.06,
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
    fontSize: Scales.moderateScale(25),
    fontWeight: '700',
    paddingLeft: Scales.moderateScale(8),
  },

  forgotContainer: {
    alignItems: 'center',
    width: Scales.deviceWidth * 0.45,
    // paddingTop: Scales.deviceHeight * 0.04,
    // alignSelf: 'flex-end',
  },

  registerContainer: {
    alignItems: 'center',
    width: Scales.deviceWidth * 0.45,
  },

  forgotText: {
    fontSize: Scales.moderateScale(16),
    color: '#3494c7',
    fontWeight: '700',
  },

  registerText: {
    fontSize: Scales.moderateScale(9),
    color: Colors.TRANSPARENT_BLACK5,
  },

  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // avtarImg: {
  //   height: Scales.deviceHeight * 0.2,
  //   width: Scales.deviceHeight * 0.2,
  //   borderRadius: Scales.deviceHeight * 0.1,
  // },

  // textContainer: {
  //   height: Scales.deviceHeight * 0.1,
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },

  // welcomeText: {
  //   fontSize: Scales.moderateScale(22),
  //   fontWeight: 'bold',
  //   color: Colors.BLUE,
  // },

  // loginText: {
  //   fontSize: Scales.moderateScale(20),
  //   color: Colors.TRANSPARENT_BLACK5,
  // },

  // phoneInputContainer: {
  //   width: Scales.deviceWidth * 0.85,
  //   borderBottomWidth: 2,
  //   borderBottomColor: '#3494c7',
  //   marginTop: Scales.deviceHeight * 0.05,
  //   overflow: 'hidden',
  // },
  // placeholderText: {
  //   fontSize: Scales.moderateScale(15),
  //   color: Colors.TRANSPARENT_BLACK5,
  // },

  // body: {
  //   height: Scales.deviceHeight * 0.05,
  //   fontSize: 17,
  //   paddingLeft: 10,
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

  // otpTextInput: {},

  // focusInput: {
  //   borderBottomWidth: 2,
  //   borderBottomColor: '#3494c7',
  //   marginTop: 30,
  //   //overflow: 'hidden',
  // },
  // inputContainerStyles: {
  //   borderBottomWidth: 2,
  //   borderBottomColor: Colors.GRAY,
  //   marginTop: 30,
  //   //overflow: 'hidden',
  // },

  // passInput: {
  //   height: Scales.deviceHeight * 0.1,
  //   marginTop: Scales.deviceHeight * 0.0,
  //   //borderBottomWidth: 2,
  //   //borderBottomColor: '#3494c7',
  //   //marginTop: 30,
  //   //overflow: 'hidden',
  // },

  // underlineStyleBase: {
  //   width: Scales.deviceWidth * 0.16,
  //   //height: Scales.deviceHeight * 0.05,
  //   borderWidth: 2,
  //   borderRadius: 0,
  //   borderBottomWidth: 2,
  //   borderColor: Colors.GRAY,
  // },

  // underlineStyleHighLighted: {
  //   borderColor: '#3494c7',
  // },

  // loginBtnContainer: {
  //   width: Scales.deviceWidth * 0.45,
  //   height: Scales.deviceHeight * 0.06,
  //   backgroundColor: '#3494c7',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 10,
  //   marginTop: Scales.deviceHeight * 0.05,
  //   overflow: 'hidden',
  // },

  // loginBtn: {
  //   flexDirection: 'row',
  //   width: Scales.deviceWidth * 0.45,
  //   height: Scales.deviceHeight * 0.06,

  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // loginBtnText: {
  //   color: Colors.WHITE,
  //   fontSize: Scales.moderateScale(25),
  //   fontWeight: '700',
  //   paddingLeft: Scales.moderateScale(8),
  // },

  // forgotContainer: {
  //   alignItems: 'center',
  //   width: Scales.deviceWidth * 0.8,
  //   paddingTop: Scales.deviceHeight * 0.04,
  //   paddingBottom: Scales.deviceHeight * 0.01,
  //   borderBottomWidth: 0.5,
  // },

  // registerContainer: {
  //   alignItems: 'center',
  //   width: Scales.deviceWidth * 0.8,
  //   paddingTop: Scales.deviceHeight * 0.04,
  //   paddingBottom: Scales.deviceHeight * 0.03,
  // },

  // forgotText: {
  //   fontSize: Scales.moderateScale(16),
  //   color: '#3494c7',
  //   fontWeight: '700',
  // },

  // registerText: {},
});
