import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Scales, Colors} from '@common';

const IS_IOS = Platform.OS === 'ios';

function wp(percentage) {
  const value = (percentage * Scales.deviceWidth) / 100;
  return Math.round(value);
}

const slideHeight = Scales.deviceHeight * 0.8;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = Scales.deviceWidth;
export const itemWidth = Scales.deviceWidth;

const entryBorderRadius = 8;

export default StyleSheet.create({
  slideInnerContainer: {
    width: Scales.deviceWidth,
    height: Scales.deviceHeight * 1.12,
    //marginTop: Scales.deviceHeight * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
    backgroundColor: 'red',
  },
  imageContainer: {
    //paddingTop: Scales.deviceHeight * 0.3,
    width: Scales.deviceWidth,
    //justifyContent: 'center',
    alignItems: 'center',
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    // backgroundColor: 'white',
    //padding: 30,
    //backgroundColor: 'blue'
  },

  image: {
    height: Scales.deviceHeight * 0.3,
    width: Scales.deviceHeight * 0.3,
    resizeMode: 'contain',
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    // backgroundColor: 'white',
  },

  textContainer: {
    width: Scales.deviceWidth * 0.8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //width: Scales.deviceWidth * 0.7,
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    // backgroundColor: 'white',
  },

  title: {
    color: Colors.WHITE,
    fontSize: Scales.moderateScale(22),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 6,
    color: Colors.WHITE,
    fontSize: Scales.moderateScale(20),
    textAlign: 'center',
  },
});
