import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';
import AppStyles from '../../AppStyles';
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
    paddingBottom: 7,
  },
  kyat: {
    fontSize: 17
  },
  icon: {
    flex: 1,
    paddingTop: 6
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
    flex: 5
  },
  body2: {
    width: '100%',
    fontSize: hp(2),
    paddingHorizontal: 10,
    color: Colors.TRANSPARENT_BLACK8,
    overflow: 'hidden',
    //alignSelf: 'flex-start',
    //justifyContent: 'flex-start'
  },
  searchInput: {
    width: '100%',
    fontSize: 17,
    paddingHorizontal: 10,
    color: Colors.TRANSPARENT_BLACK8,
    overflow: 'hidden',
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
  disableInput: {
    width: '100%',
    fontSize: 17,
    paddingHorizontal: 10,
    color: '#585c5e',
    overflow: 'hidden',
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
  modalBackground3: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: 'rgba(150, 153, 153,0.6)',
    //alignItems: 'center'
    top: 0,
    position: 'absolute'
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 153, 153,0.6)',
    alignItems: 'center'

  },
  modalView: {
    width: Scales.deviceWidth * 0.9,
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: hp(4)
  },
  insertTitle: {
    fontFamily: AppStyles.customFonts.klavikaMedium,
    color: '#3494c7',
    width: Scales.deviceWidth * 0.7,
    fontSize: 18,
    marginVertical: 10,
  },
  modalView2: {
    width: Scales.deviceWidth * 0.8,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10
  },
  modalView4: {
    width: Scales.deviceWidth * 0.8,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10
  },
  modalView3: {
    width: Scales.deviceWidth,
    height: Scales.deviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10
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
  text: {
    color: 'gray',
    padding: 0,
    marginTop: -20
  },
  loginBtnSection: {
    width: Scales.deviceWidth,
    marginTop: Scales.deviceHeight * 0.03,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginBtnContainer: {
    width: Scales.deviceWidth * 0.8,
    backgroundColor: '#3494c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Scales.deviceHeight * 0.03,
    overflow: 'hidden',
    paddingVertical: Scales.moderateScale(6)
  },
  scroll: {
    width: '100%',
    alignSelf: 'center'
  },
  loginBtn: {
    flexDirection: 'row',
    width: Scales.deviceWidth * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
        //height: Scales.deviceHeight * 0.06,
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
   width: Scales.deviceWidth * 0.95,
   paddingTop: 4,
    paddingBottom: 3,
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  operatorView: {
    width: Scales.deviceWidth * 0.19,
    height: Scales.deviceHeight * 0.1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  operator: {
    width: Scales.deviceWidth * 0.18,
    height: Scales.deviceHeight * 0.08,
    resizeMode: 'contain'
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
    fontSize: Scales.moderateScale(18),
    fontFamily: AppStyles.customFonts.klavikaMedium,
    paddingTop: 3
        //paddingLeft: Scales.moderateScale(8),
  },

  card: {
    paddingTop: 4,
    paddingBottom: 15,
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
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
    color: '#3494c7',
    fontSize: 14,
    fontWeight: 'bold'
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
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.75,
    marginTop: 8
  },
  newBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.75,
    marginVertical: 13
  },
  sendBtnView: {
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.75
  },
  phoneInputContainer2: {
  width: Scales.deviceWidth * 0.8,
  borderWidth: 1,
  borderRadius: 8,
  marginTop: hp(3),
  borderColor: '#3494c7',
  height: hp(12)
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
newPhoneContainer: {
  width: Scales.deviceWidth * 0.7,
  borderWidth: 1,
  borderRadius: 8,
  marginBottom: 10,
  borderColor: '#3494c7',
},
searchContainer: {
  width: Scales.deviceWidth * 0.9,
  borderWidth: 1,
  borderRadius: 8,
  marginBottom: 10,
  borderColor: '#3494c7',
  justifyContent: 'center',
  alignSelf: 'center',
 // position: 'absolute',
  //top: 40
},
contacts: {
  width: Scales.deviceWidth * 0.8,
},
loadMoreBtn: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 15,
  paddingBottom: 10
},
btnText2: {
  color: '#3494c7',
  fontSize: 15,
  textAlign: 'center',
},
text2: {
  color: '#3494c7',
  textAlign: 'left',
  fontSize: 18,
  //paddingTop: 16,
  width: Scales.deviceWidth,
  paddingLeft: 16,
  paddingVertical : 15,
  fontFamily: AppStyles.customFonts.klavikaMedium,
  //position: 'absolute',
  //top: 15
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
  passwordBtn: {
    backgroundColor: '#3494c7',
    paddingVertical: 8,
    width: Scales.deviceWidth * 0.7,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    marginRight: 8,
    marginTop: 7
  },
  passwordText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  },
  sendText: {
    //fontWeight: 'bold',
    fontSize: hp(2.3),
    color: 'white',
    textAlign: 'center'
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
    fontSize: hp(2.3),
    color: '#3494c7',
    textAlign: 'center'
  },
  modalName: {
    paddingTop: 15,
    fontSize: 20,
    color: '#5c5d5e',
    fontWeight: 'bold'
  },
  modalPhone: {
    paddingTop: 4,
    fontSize: 16,
    color: '#5c5d5e'
  },
  modalAmt: {
    paddingTop: 10,
    fontSize: 30,
    color: '#3494c7',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    width: Scales.deviceWidth * 0.8,
    height: hp(3.2),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    paddingTop: 4,
    fontSize: hp(2.1),
    color: '#707273',
    flex: 1
  },
  value: {
    paddingTop: 4,
    fontSize: hp(2.1),
    color: '#464747',
    flex: 2
  },
  value2: {
    fontSize: hp(2.1),
    color: '#464747',
  },
  newerror: {
    fontSize: 14,
    color: 'red',
    alignSelf: 'center',
    paddingBottom: 5
  },
  error: {
    fontSize: 14,
    color: 'red',
    alignSelf: 'center',
    paddingVertical: 3
  },
  view1: {
    //height: 80
  },
  contactView: {
   flexDirection: 'row',
   marginLeft: 0,
   marginVertical: hp(0.6),
   width: '100%',
  },
  image: {
    borderRadius: 40,
    width: hp(6),
    height: hp(6)
  },
  nameView: {
    paddingLeft: hp(1.6)
  },
  contactName: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: '#484e52'
  },
  phoneNumber: {
    fontSize: hp(1.7),
    color: 'black',
    paddingTop: 0
  },
  recent: {
    fontSize: hp(2.2),
    color: '#595e61',
    width: '100%',
    //alignSelf: 'center',
    marginTop:hp(3),
    marginBottom: hp(1),
    marginLeft: wp(7),
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
  recentContactView: {
    flexDirection: 'row',
    paddingVertical: hp(1),
    width: '100%',
    borderBottomWidth: 0.3,
    borderBottomColor: '#bbbebf',
    marginLeft: wp(7)
   },
   recentImage: {
     //borderRadius: 40,
     width: hp(5.3),
     height: hp(5.3)
   },
   recentNameView: {
     paddingLeft: hp(2)
   },
   recentContactName: {
     fontSize: hp(2.1),
     //color: '#484e52'
   },
   recentPhoneNumber: {
     fontSize: hp(1.7),
     color: '#484e52',
     paddingTop: 0
   },


   imgcontainer: {
    height: 35,
    paddingRight: hp(0.6),
    borderRightWidth: 1,
    borderRightColor: AppStyles.colorSet['light'].grey3,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 1
  },
  countryImg: {
    width: hp(3.7),
    height: 18,
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
  countrymodalBackground: {
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
  countrymodalView: {
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
  countrycancelText: {
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
})