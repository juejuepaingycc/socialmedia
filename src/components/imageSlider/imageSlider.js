/* eslint-disable */
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Scales, Colors } from '@common';
import { SliderBox } from './slider/dist/SliderBox';

const ImageSlider = props => {
  const images = useSelector(state => state.SlideImages.homeSlideImages);
  return (
    <View style={{  width: Scales.deviceWidth, alignItems: 'center' }}>
      <SliderBox
        images={images}
        sliderBoxHeight={Scales.deviceHeight * 0.35}
        width={Scales.deviceWidth}
        //onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
        //currentImageEmitter={index => console.warn(`image ${index} pressed`)}
        dotColor={'#3494c7'}
        inactiveDotColor={Colors.GRAY}
        paginationBoxVerticalPadding={20}
        paginationBoxStyle={{
          position: 'absolute',
          bottom: 0,
          padding: 0,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          //marginHorizontal: 10,

        }}
        dotStyle={{
          width: 10,
          height: 10,
       //   borderRadius: 5,
          marginHorizontal: 0,
          padding: 0,
          margin: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.92)',
        }}
        autoplay
        circleLoop
        ImageComponentStyle={{  resizeMode: 'contain', width: '100%', marginTop: 0,
   //  marginHorizontal: 20 
        }}
        imageLoadingColor={'#3494c7'}
      />
    </View>
  );
};

export default ImageSlider;
