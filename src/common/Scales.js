/* eslint-disable comma-dangle */
/* eslint-disable quotes */

import {Dimensions} from 'react-native';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (viewportWidth / guidelineBaseWidth) * size;
const verticalScale = size => (viewportHeight / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const deviceWidth = viewportWidth;
const deviceHeight = viewportHeight;

export default {
  moderateScale,
  deviceWidth,
  deviceHeight,
};
