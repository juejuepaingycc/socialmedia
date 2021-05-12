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
    marginTop: '5%',
    backgroundColor: '#3494c7',
    borderRadius: 20
    //marginHorizontal: 20,
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
    //paddingTop: 6,
    marginVertical: 8
  },
  image: {
      width: 50,
      height: 50
  },
  text: {
      color: 'white',
      fontSize: 18,
      paddingLeft: 10
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //paddingTop: Scales.deviceWidth * 0.007,
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