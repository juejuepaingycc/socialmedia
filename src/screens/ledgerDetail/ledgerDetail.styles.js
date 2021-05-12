import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
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
  card: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: '5%',
    backgroundColor: '#3494c7',
    flexDirection: 'row',
    borderRadius: 10,
    //marginHorizontal: 20,
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
  type: {
    fontSize: 20,
    color: '#707273',
    paddingVertical: 5
  },
  line: {
    width: Scales.deviceWidth * 0.9,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.3,
    alignSelf: 'center',
    marginVertical: 15
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
    marginTop: -15
  },
  error: {
    fontSize: 30,
    color: '#838487',
    fontWeight: 'bold'
  },
  title: {
    color: '#3e3e40',
    fontSize: 17,
    color: '#edf0f2'
  },
  date: {
    color: '#3e3e40',
    fontSize: 16,
    color: '#edf0f2'
  },
  amount: {
    color: '#3494c7',
    fontWeight: 'bold',
    fontSize: 25,
  },
  leftView: {
    marginTop: -6,
    paddingBottom: 10
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
  topView: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 7,
    backgroundColor: '#e6e9eb',
    width: Scales.deviceWidth * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginVertical: 20
  },
  row: {
    width: Scales.deviceWidth * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  row2: {
    width: Scales.deviceWidth * 0.85,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  phone: {
    fontSize: 16,
    color: 'gray'
  },
  label: {
    fontSize: 17,
    color: '#7f8182',
    //flex: 4
  },
  value: {
    fontSize: 17,
    color: '#303030',
    //flex: 5
  }
})