import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  container: {
      padding: 16
  },
  card: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    width: Scales.deviceWidth * 0.9,
    justifyContent: 'center',
    marginTop: '4%',
    borderRadius: 8,
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Scales.deviceWidth * 0.007,
    marginVertical: 5
  },
  image: {
    width: Scales.deviceWidth * 0.12, 
    height: Scales.deviceWidth * 0.12, 
    borderRadius: 25,
  },
  text: {
      color: '#24526b',
      fontSize: 15,
      paddingLeft: 16,
      fontWeight: 'bold'
  }
})