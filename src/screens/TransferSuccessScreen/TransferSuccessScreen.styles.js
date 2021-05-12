import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';
import AppStyles from '../../AppStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    marginTop: 40
  },
  desc: {
    color: '#3494c7',
    fontSize: 17,
  },
  transfer: {
    paddingTop: 50,
    paddingBottom: 10,
    color: '#4e5152',
    fontSize: 18
  },
  amount: {
    fontSize: 23,
    color: '#4e5152',
    fontWeight: 'bold'
  },
  btn: {
    position: 'absolute',
    bottom: 30,
    width: Scales.deviceWidth * 0.6,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#3494c7'
  },
  btnText: {
    color: 'white',
    fontSize: 16
  }
})