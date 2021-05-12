import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
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
  eyeView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  midContainer: {
    width: Scales.deviceWidth,
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth,
    alignItems: 'center',
    marginTop: Scales.deviceHeight * 0.05,
  },

  bottomImage: {
    width: Scales.deviceHeight * 0.18,
    height: Scales.deviceHeight * 0.15,
  },
  topImage: {
    width: Scales.deviceHeight * 0.18,
    height: Scales.deviceHeight * 0.15,
  },

  textContainer: {
    height: '10%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: Scales.moderateScale(16),
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
    paddingTop: 15,
    paddingBottom: 15,
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    marginTop: Scales.deviceHeight * 0.1
    //justifyContent: 'center',
    //marginTop: '5%',
  },
  phoneInputContainer: {
    width: Scales.deviceWidth * 0.85,
    borderBottomWidth: 1,
    marginTop: 5,
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
    width: '90%',
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

  newPassTextContainer: {
    marginTop: 15,
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
    justifyContent: 'flex-end',
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
});
