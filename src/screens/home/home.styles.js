import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';
import AppStyles from '../../AppStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  btnView: {
      height: Scales.deviceHeight * 0.15,
      flexDirection: 'row',
      backgroundColor: '#3494c7',
      width: '100%',
      alignItems: 'center',
  },
  scan: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    textAlign: 'center',
    color: '#cdd0d4',
    height: hp(5),
  },
  menuImg: {
    width: Scales.deviceWidth * 0.12,
    height: Scales.deviceWidth * 0.12,
    borderRadius: 10,
  },
  btn: {
    width: Scales.deviceWidth * 0.33,
    marginRight: 9,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
color: 'white',
textAlign: 'center',
fontSize: 16,
paddingTop: 6,
fontFamily: AppStyles.customFonts.klavikaMedium
  },
  collapsedCard: {
    width: Scales.deviceWidth,
    alignItems: 'center',
  },

  slideContainer: {
    height: Scales.deviceHeight * 0.32,
    width: Scales.deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain'
  },

  slideImage: {
    width: Scales.deviceWidth,
    height: Scales.deviceHeight * 0.25,
    resizeMode: 'cover',
  },

  loginText: {
    fontSize: Scales.moderateScale(20),
    color: Colors.TRANSPARENT_BLACK5,
  },
  promoInnerCard: {
    width: Scales.deviceWidth * 0.98,
    height: Scales.deviceHeight * 0.2,
    backgroundColor: '#c1d9e6',
  },
  promoImage: {
    width: Scales.deviceWidth * 0.17,
    height: Scales.deviceWidth * 0.17,
  },
  menuView: {
    height: Scales.deviceHeight * 0.28, 
    width: '100%',
    //marginTop: Scales.deviceHeight * 0.02
    // alignSelf: 'center'
  },
  promoContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    //alignItems: 'center',
  },
  promoMiddleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.33%',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D1CFCF',
  },
  promoSideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.33%',
  },

  promoItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  promoText: {
    fontSize: Scales.moderateScale(12),
    fontWeight: '600',
    color: Colors.GRAY,
  },
  passInput: {
    width: Scales.deviceWidth * 0.85,
    height: Scales.deviceHeight * 0.06,
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

  loginBtnText: {
    color: Colors.WHITE,
    fontSize: Scales.moderateScale(25),
    fontWeight: '700',
    paddingLeft: Scales.moderateScale(8),
  },

  forgotContainer: {
    alignItems: 'center',
    width: Scales.deviceWidth * 0.8,
    paddingTop: Scales.deviceHeight * 0.04,
    paddingBottom: Scales.deviceHeight * 0.01,
    borderBottomWidth: 0.5,
  },

  registerContainer: {
    alignItems: 'center',
    width: Scales.deviceWidth * 0.8,
    paddingTop: Scales.deviceHeight * 0.04,
    paddingBottom: Scales.deviceHeight * 0.03,
  },

  forgotText: {
    fontSize: Scales.moderateScale(16),
    color: '#3494c7',
    fontWeight: '700',
  },

  registerText: {},
  qrcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  layerTop: {
    height: hp(27.5),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  leftBorder: {
    width: wp(0.4),
    backgroundColor: 'rgba(0, 0, 0, .6)',
    //paddingHorizontal: wp(7),
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 2
  },
  leftBorder1: {
    height: wp(8),
    width: wp(0.4),
    backgroundColor: '#3494c7',
  },
  leftBorder2: {
    height: wp(8),
    width: wp(0.4),
    backgroundColor: '#3494c7',
  },
  topBorder: {
    height: wp(0.4),
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp(100),
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingHorizontal: wp(9.6),
    //justifyContent: 'space-between',
  },
  topBorder1: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
  },
  topBorder2: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
    position: 'absolute',
    right: wp(8.8)
  },
  bottomBorder: {
    height: wp(0.4),
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp(100),
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingHorizontal: wp(9.6),
    justifyContent: 'space-between',
  },
  bottomBorder1: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
  },
  bottomBorder2: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
  },
  layerCenter: {
    height: hp(40),
    flexDirection: 'row'
  },
  layerLeft: {
    width: wp(9.6),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  focused: {
    width: wp(80.8),
    //borderWidth: 1,
    //borderColor: '#3494c7'
  },
  layerRight: {
    width: wp(9.6),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  layerBottom: {
    height: hp(27.5),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
});
