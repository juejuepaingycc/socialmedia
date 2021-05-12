import {StyleSheet} from 'react-native';
import {Scales, Colors} from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },

  Imagecontainer: {
    width: Scales.deviceHeight * 0.2,
    height: Scales.deviceHeight * 0.2,
    resizeMode: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },

  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //height: Scales.deviceHeight * 0.12,
    width: Scales.deviceWidth * 0.95,
    //alignSelf: 'center',
    paddingHorizontal: 10,
  },

  loading: {
    marginTop: Scales.deviceHeight * 0.6,
  },

  contactText: {
    fontSize: Scales.moderateScale(22),
    color: Colors.TRANSPARENT_BLACK8,
    fontFamily: 'Roboto-Reguler',
  },

  helpCard: {
    height: Scales.deviceHeight * 0.3,
    width: Scales.deviceWidth * 0.95,
    marginTop: Scales.deviceWidth * 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    padding: Scales.moderateScale(25),
  },

  helpText: {
    fontSize: Scales.moderateScale(20),
    color: Colors.TRANSPARENT_BLACK8,
    fontFamily: 'Roboto-Medium',
  },

  btnText: {
    fontSize: Scales.moderateScale(30),
    color: Colors.WHITE,
    fontFamily: 'Roboto-Bold',
  },

  helpBtn: {
    height: Scales.deviceHeight * 0.1,
    width: Scales.deviceWidth * 0.8,
    borderRadius: 200,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Scales.deviceHeight * 0.05,
  },
});
