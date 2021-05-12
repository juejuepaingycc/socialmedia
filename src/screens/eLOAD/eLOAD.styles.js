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
  checkicon: {
    position: 'absolute'
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
    height: Scales.deviceHeight * 0.05,
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
  titleView: {
    alignItems: 'flex-start', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#3494c7',
    width: Scales.deviceWidth,
  },
  operators: {
   flexDirection: 'row' ,
   paddingTop: 4,
    paddingBottom: 3,
    width: Scales.deviceWidth,
    //alignItems: 'center',
    justifyContent: 'center',
    //marginTop: '5%',
    //paddingBottom: 20
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
  incorrect: {
    width: Scales.deviceWidth * 0.18,
    height: Scales.deviceHeight * 0.08,
  },
  correct: {
    width: Scales.deviceWidth * 0.12,
    height: Scales.deviceHeight * 0.06,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 60
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
    height: 35,
    width: '100%',
    fontSize: 17,
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 7,
    color: 'white',
    overflow: 'hidden',
    flex: 4,
    justifyContent : 'center',
    alignItems : 'center'
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
   // paddingTop: 10,
    marginTop: 10
  },
  label: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    marginTop: -6
  },
  card2: {
    paddingTop: 4,
    paddingBottom: 15,
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  div1: {
    flex: 1,
    paddingTop: 18
  },
  div2: {
    flex: 5
  },
  card1: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
    backgroundColor: '#3494c7',
    flexDirection: 'row',
    borderRadius: 20,
    //marginHorizontal: 20,
    marginTop: 40
  },
  card: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    backgroundColor: '#3494c7',
    flexDirection: 'row',
    borderRadius: 20
    //marginHorizontal: 20,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.75,
    marginTop: 8
  },
  btn: {
    backgroundColor: '#3494c7',
    paddingVertical: hp(1.2),
    width: Scales.deviceWidth * 0.6,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    position: 'absolute',
    bottom: 16
  },
  btnText: {
    //fontWeight: 'bold',
    fontSize: hp(2.1),
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
    paddingLeft: 16,
    fontSize: 16,
  },
  title: {
    color: '#3494c7',
    textAlign: 'left',
    paddingVertical: hp(1),
    fontSize: hp(2)
  },
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#4591ed',
    color:'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 20
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: (Platform.OS === "android") ? undefined: 15,
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
  error: {
    fontSize: 14,
    color: 'red',
    alignSelf: 'center',
    paddingVertical: 3
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
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: hp(1.8),
  paddingHorizontal: hp(0.2)
},
amt: {
  color: 'white',
  fontSize: hp(2)
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
  card1: {
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
})