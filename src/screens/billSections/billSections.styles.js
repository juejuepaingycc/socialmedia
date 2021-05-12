import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  container: {
  },
  card: {
    paddingVertical: 13,
    paddingLeft: 20,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: '5%',
    //backgroundColor: '#3494c7',
    borderRadius: 8,
    alignSelf: 'center',
    height: 55,
    //flexDirection: 'row',
    //justifyContent: 'space-between'
    //marginHorizontal: 20,
  },
  text: {
    color: '#24526b',
    fontSize: 16,
    fontWeight: 'bold'
  },
  btn: {
    marginTop: -6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
})