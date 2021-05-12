import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  midContainer: {
    width: Scales.deviceWidth,
    alignItems: 'center',
    marginBottom: 170
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    //alignItems: 'center',
    //justifyContent: 'center',
    //marginTop: '5%',
    backgroundColor: '#3494c7',
    //flexDirection: 'row',
    borderRadius: 10,
    //marginHorizontal: 20,
  },
  row: {
    width: Scales.deviceWidth * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row2: {
    width: Scales.deviceWidth * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 6
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
    backgroundColor: '#b8dbd4',
    paddingVertical: 15,
    //paddingHorizontal: 20
    width: Scales.deviceWidth * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#bd9a2a'
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
  amount: {
    color: 'green',
    fontSize: 16,
   // fontWeight: 'bold'
  },
  dateLabel: {
    textAlign: 'center',
    flex: 0.1
  },
  datePick: {
    flex: 0.4,
  //  backgroundColor: 'green'
  },
  dateView: {
    flexDirection: 'row',
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center'
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
  errorView: {
    height: Scales.deviceHeight,
    paddingTop: 0,
    justifyContent: 'center',

  },
  rightView: {
    marginTop: 0
  },
  error: {
    fontSize: 30,
    color: '#838487',
    fontWeight: 'bold'
  },
  title: {
    color: '#5b6369',
    fontSize: 16,
    paddingLeft: 7
  },
  date: {
    color: '#5b6369',
    fontSize: 15,
    paddingLeft: 7
  },
  amount: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    // padding: 10,
    // backgroundColor: '#800000',
    // borderRadius: 4,
    // flexDirection: 'row',
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
})