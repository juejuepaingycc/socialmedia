import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';
import AppStyles from '../../AppStyles';

export default StyleSheet.create({
  mainImg: {
    width: Scales.deviceWidth,
    height: 170,
    resizeMode: 'cover'
  },
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
  contacts: {
    //width: Scales.deviceWidth * 0.8,
    padding: 16
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
  text: {
    fontSize: 19,
    paddingLeft: 16,
    alignSelf: 'center'
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
   paddingTop: 4,
    paddingBottom: 3,
    width: Scales.deviceWidth,
    //alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
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
  card2: {
    paddingTop: 4,
    paddingBottom: 15,
    width: Scales.deviceWidth * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
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
    justifyContent: 'space-between',
    borderRadius: 20
    //marginHorizontal: 20,
  },
  btnView: {
    paddingBottom: 6,
    //paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: 'white',
    paddingVertical: 15,
    width: Scales.deviceWidth,
    marginVertical: 6,
    paddingLeft: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  right: {
    alignSelf: 'flex-end',
    paddingRight: 15
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16
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
  contacts: {
    width: Scales.deviceWidth,
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
   // top: 15
  },
  contactView: {
    //marginHorizontal: 16,
   // paddingVertical: 16
   height: 80,
   alignItems: 'center',
   flexDirection: 'row',
   marginLeft: 18,
   width: Scales.deviceWidth * 0.9,
  },
  image: {
    borderRadius: 40,
    width: 50, 
    height: 50
  },
  nameView: {
    paddingLeft: 20
  },
  contactName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#484e52'
  },
  phoneNumber: {
    fontSize: 16,
    color: 'black',
    paddingTop: 5
  },
  inviteView: {
    //alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#3494c7',
    borderRadius: 8,
    position: 'absolute',
    right: 10
   // alignSelf: 'flex-end'
  },
  invite: {
    color: 'white',
    fontSize: 17
  }
})