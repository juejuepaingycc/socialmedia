import {StyleSheet} from 'react-native';
import {Scales, Colors} from '@common';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: hp(55),
    width: wp(90),
    alignSelf: 'center',
    alignItems: 'center'
  },
  logoView: {
    width: hp(40),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoqr: {
    width: hp(7),
    height: hp(7),
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'white'
  },
  card2: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: hp(60),
    width: wp(90),
    alignSelf: 'center',
    alignItems: 'center'
  },
  logo: {
    height: hp(11),
    width: hp(11),
    alignSelf: 'center'
  },
  profile: {
    width: hp(8),
    height: hp(8),
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: hp(-5)
  },
  name: {
    fontSize: hp(2.1),
    textAlign: 'center',
    marginTop: hp(5),
    color: '#646769'
  },
  name2: {
    fontSize: hp(2.3),
    textAlign: 'center',
    marginTop: hp(5),
  },
  description: {
    fontSize: hp(2),
    textAlign: 'center',
    color: 'gray',
  },
  description2: {
    fontSize: hp(2.4),
    textAlign: 'center',
    color: '#51565e',
  },
  amtView: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingTop: hp(1),
    justifyContent: 'center',
  },
  amount: {
    fontSize: hp(4),
  },
  amount2: {
    fontSize: hp(2),
    color: '#4d5254',
  },
  Conatainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  phoneText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.BLACK,
    //textAlign: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.BLACK,
  },
  qrImage: {
    width: hp(40),
    height: hp(40),
  },
  qrContainer: {
    //alignItems: 'center',
    //padding: 1,
   // borderWidth: 1,
  //  borderColor: 'gray'
  },
  bottomBtnContainer: {
    flexDirection: 'row',
    width: Scales.deviceWidth,
    bottom: 0,
    position: 'absolute',
  },
  bottomBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopWidth: 1,
    borderColor: Colors.TRANSPARENT_BLACK2,
    width: Scales.deviceWidth / 2,
    height: 50,
  },
  btnText: {
    fontSize: Scales.moderateScale(17),
    color: Colors.BLUE,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 153, 153,0.6)',
    alignItems: 'center'

  },
  modalView: {
    width: Scales.deviceWidth * 0.8,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10
  },
  amountContainer: {
    width: Scales.deviceWidth * 0.7,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 17,
    marginBottom: 3,
    borderColor: '#3494c7',
  },
  amountInput: {
    width: '100%',
    fontSize: 17,
    paddingHorizontal: 10,
    color: Colors.TRANSPARENT_BLACK8,
    overflow: 'hidden',
  },
  modalBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.75,
    marginTop: 8
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Scales.deviceWidth * 0.8,
    marginTop: hp(3)
  },
  btn: {
    backgroundColor: '#3494c7',
    borderRadius: hp(1),
    width: wp(38),
    paddingVertical: hp(1.3),

    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: hp(2)
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
  sendBtn: {
    backgroundColor: '#3494c7',
    paddingVertical: 8,
    width: Scales.deviceWidth * 0.33,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    marginRight: 8
  },
});
