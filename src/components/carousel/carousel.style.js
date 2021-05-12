import {StyleSheet} from 'react-native';
import {Scales, Colors} from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end',
    // backgroundColor: Colors.WHITE,
  },
  swiperContainer: {
    height: '100%',
    // justifyContent: 'flex-end',
    //marginTop: Scales.deviceHeight * 0.075,
    //backgroundColor: 'red'
  },
  scrollview: {
    // justifyContent: 'flex-end',
  },

  slider: {
    marginTop: 0,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    //paddingVertical: 10 // for custom animation
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '90%',
  },
  // paginationContainer: {
  //   alignItems: 'flex-end',
  //   //height: Scales.deviceHeight * 0.05,
  //   //width: Scales.deviceWidth,
  //   //paddingVertical: 4
  // },
  paginationDot: {
    width: Scales.moderateScale(8),
    height: Scales.moderateScale(8),
    borderRadius: Scales.moderateScale(4),
    marginHorizontal: Scales.moderateScale(0),
  },
  navBtnText: {
    color: Colors.WHITE,
  },
});
