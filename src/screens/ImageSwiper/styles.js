import { StyleSheet, Dimensions } from 'react-native';
import { Scales, Colors } from '@common';

const { width, height } = Dimensions.get('window');
const closeButtonSize = Math.floor(height * 0.032);
const calcImgHeight = Math.floor(height * 0.6);

export default StyleSheet.create({
  container: {
      flex: 1,
     // backgroundColor: 'rgba(217, 221, 222,0.9)',
      justifyContent: 'center',
      alignItems: 'center'
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'flex-end',
    padding: 16
  },
  slideContainer: {
    height: Scales.deviceHeight * 0.8,
    marginHorizontal: 20,
    borderRadius: 13,
    width: Scales.deviceWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },

  img: {
    width: '20%', 
    height: '100%',
    borderRadius: 13,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  dButton: {
    //height: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 3),
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
    alignItems: 'flex-end'
  },
})