import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
phoneInputContainer: {
    width: Scales.deviceWidth * 0.85,
    borderBottomWidth: 1,
    marginTop: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom : 10,
    paddingBottom: 7
  },
  title: {
    color: '#3494c7',
    textAlign: 'left',
    paddingVertical: hp(1),
    fontSize: hp(2)
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.75,
    marginTop: 8
  },
  cancelBtn: {
    backgroundColor: 'white',
    paddingVertical: 8,
    width: Scales.deviceWidth * 0.33,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#3494c7',
    marginLeft: 8
  },
  cancelText: {
    //fontWeight: 'bold',
    fontSize: 17,
    color: '#3494c7',
    textAlign: 'center'
  },
  sendBtn: {
    backgroundColor: '#3494c7',
    paddingVertical: 8,
    width: Scales.deviceWidth * 0.33,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    marginRight: 8
  },
  sendText: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center'
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 153, 153,0.6)',
    alignItems: 'center'

  },
  modalView2: {
    width: Scales.deviceWidth * 0.8,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10
  },
  passwordContainer: {
    width: Scales.deviceWidth * 0.7,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 17,
    marginBottom: 3,
    borderColor: '#3494c7',
    flexDirection: 'row'
  },
  passwordInput: {
    width: '80%',
    fontSize: 17,
    paddingHorizontal: 10,
    color: Colors.TRANSPARENT_BLACK8,
    overflow: 'hidden',
  },
  eyeView: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center' 
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.9,
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#3494c7',
    width: Scales.deviceWidth,
    paddingHorizontal: 16
  },
  midContainer: {
    width: Scales.deviceWidth,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
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
  loginBtnSection: {
    width: Scales.deviceWidth,
    marginTop: Scales.deviceHeight * 0.06,
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
  correctview: {
    width: Scales.deviceWidth * 0.95,
    paddingTop: 4,
     paddingBottom: 3,
     width: Scales.deviceWidth * 0.95,
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: -80,
    flexDirection:'row'
  },
  operators: {
   flexDirection: 'row' ,
   paddingTop: hp(1),
    paddingBottom: 3,
    width: Scales.deviceWidth,
    //alignItems: 'center',
    justifyContent: 'center',
    //marginTop: '5%',
  },
  operatorView: {
    width: Scales.deviceWidth * 0.18,
    height: Scales.deviceHeight * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  operator: {
    width: Scales.deviceWidth * 0.17,
    height: Scales.deviceHeight * 0.08,
    //resizeMode: 'contain'
    borderRadius: 15
  },
  checkBg: {
    width: Scales.deviceWidth * 0.15,
    height: Scales.deviceWidth * 0.15,
    backgroundColor: 'rgba(62, 68, 71,0.4)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  incorrect: {
    width: Scales.deviceWidth * 0.1,
    height: Scales.deviceHeight * 0.08,
  },
  correct: {
    width: Scales.deviceWidth * 0.12,
    height: Scales.deviceHeight * 0.06,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 60
  },
  checkicon: {
    position: 'absolute'
  },
  check: {
    width: Scales.deviceWidth * 0.13,
    height: Scales.deviceHeight * 0.05,
    resizeMode: 'contain',
    marginTop: 8
  },
  loginBtnText: {
    color: Colors.WHITE,
    fontSize: Scales.moderateScale(25),
    fontWeight: '700',
    paddingLeft: Scales.moderateScale(8),
  },
  balance: {
    fontSize: 19,
    color: 'white'
  },
  body: {
    height: 40,
    width: '100%',
    fontSize: 17,
    paddingLeft: 10,
    paddingRight: 20,
    color: 'white',
    overflow: 'hidden',
    flex: 4
  },
  icon: {
    flex: 1
  },
  inputView: {
    flexDirection: 'row',
    borderRadius: 7,
    borderWidth: 1,
    padding: 8,
    borderColor: 'white',
    paddingTop: 10,
    marginTop: 10,
    marginBottom: 5
  },
  label: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    marginTop: 0,
    paddingTop: 0
  },
  card2: {
    paddingTop: 4,
    paddingBottom: 15,
   // width: Scales.deviceWidth * 0.95,
    //alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginHorizontal: 16
  },
  div1: {
    flex: 1,
    paddingTop: 18
  },
  div2: {
    flex: 5
  },
  card: {
    paddingTop: 5,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
    backgroundColor: '#3494c7',
    flexDirection: 'row',
    borderRadius: 8,
    paddingBottom: 10
    //marginHorizontal: 20,
  },
  error: {
    fontSize: 14,
    color: 'red',
    alignSelf: 'center',
    paddingVertical: 3
  },
  btn: {
    backgroundColor: '#3494c7',
    paddingVertical: 14,
    width: Scales.deviceWidth * 0.9,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    position: 'absolute',
    bottom: 0
  },
  buyBtn: {
    backgroundColor: '#3494c7',
    paddingVertical: 7,
    width: wp(30),
    alignSelf: 'flex-end',
    right: 0,
    bottom:0
  },
  buyText: {
    fontSize: hp(2),
    color: 'white',
    textAlign: 'center'
  },
  history: {
    backgroundColor: '#cfac3c',
    width: Scales.deviceWidth,
    textAlign: 'right',
    paddingRight: 10,
    fontWeight: 'bold',
    paddingVertical: 6,
    fontSize: 16,
    marginBottom: 8
  },
  amtView: {
    width: Scales.deviceWidth * 0.3,
    borderWidth: 1,
    borderColor: '#3494c7',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    marginHorizontal: 4,
    borderRadius: 5
  },
  amount: {
    color: 'green',
    fontSize: 16,
   // fontWeight: 'bold'
  },
  type: {
    fontSize: 16,
  },
  amtViewSelect: {
    width: Scales.deviceWidth * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    marginHorizontal: 4,
    borderRadius: 5,
    backgroundColor: '#3494c7'
  },
  amountSelect: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  historyView: {
    width: Scales.deviceWidth * 0.9,
    borderWidth: 1,
    borderColor: '#bd2624',
    marginVertical: 7,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12
  },
  date: {
    fontWeight: 'bold',
    color: '#2e3ec9'
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.65,
    alignSelf: 'center',
    paddingTop: 6
  },
  text: {
    color: '#3494c7',
    textAlign: 'left',
    fontSize: 18
  },
  text2: {
    color: '#3494c7',
    textAlign: 'left',
    fontSize: 18,
    paddingTop: 16,
    width: Scales.deviceWidth,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3494c7',
    paddingBottom : 8
  },
  nameView: {
    width: wp(40),
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: hp(1),
    backgroundColor: '#3494c7',
    // shadowColor: 'black',
    // shadowOpacity: 0.26,
    // shadowOffset: {width: 0, height: 2},
    // shadowRadius: 8,
    // elevation: 5,
    marginTop: hp(0.1),
    // borderWidth: 1,
    // borderLeftWidth: 0,
    // borderColor: '#3494c7'
  },
  nameText: {
    fontWeight: 'bold',
    color: '#f0eded',
    fontSize: hp(2),
    paddingLeft: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  data: {
    fontWeight: 'bold',
    color: '#6632b3',
    fontSize: hp(2.4)
  },



  operators: {
    flexDirection: 'row' ,
    paddingTop: hp(1),
     paddingBottom: 3,
     width: Scales.deviceWidth * 0.9,
     justifyContent: 'space-between',
     alignSelf: 'center'
   },
  operatorView: {
    width: Scales.deviceWidth * 0.155,
    height: Scales.deviceWidth * 0.155,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: '#c2c8cc'
    //backgroundColor: '#d5dee3'
  },
  operator: {
    width: Scales.deviceWidth * 0.15,
    height: Scales.deviceWidth * 0.15,
    borderRadius: 100,
    resizeMode: 'cover'
  },
})