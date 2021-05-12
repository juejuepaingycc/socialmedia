import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  firstView: {
    flexDirection: 'row',
    width: Scales.deviceWidth,
    flex: 1
  },
  bodyImage: {
    
  },
  firstImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  firstBlog:{
    height: 300,
    flex: 1
  },
  blog2: {
    flex: 1
  },
  secondBlog: {
    height: 150,
  },
  thirdBlog: {
    height: 150,
  },
  secondImage: {

  },
  blog: {
    height: 150,
    width: Scales.deviceWidth * 0.33,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyImage: {
    height: '100%',
    width: '100%',
  },
  soundIcon: {
    tintColor: 'black',
    width: 19,
    height: 19,
  },
  soundIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})