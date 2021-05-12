/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Scales, Colors } from '@common';
import { FeedSliderBox } from './slider/dist/FeedSliderBox';

const FeedImageSlider = props => {
  const images = props.items;
  return (
    <View style={{  width: '100%', alignItems: 'center', height: '100%' }}>
      <FeedSliderBox
        images={images}
        width={Scales.deviceWidth}
        dotColor={'#3494c7'}
        inactiveDotColor={'gray'}
        paginationBoxVerticalPadding={20}
        paginationBoxStyle={{
          position: 'absolute',
          bottom: 0,
          padding: 0,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          marginHorizontal: 10,

        }}
        dotStyle={{
          width: 10,
          height: 10,
       //   borderRadius: 5,
          marginHorizontal: 0,
          padding: 0,
          margin: 0,
         // backgroundColor: 'rgba(128, 128, 128, 0.92)',
        }}
        
        
        ImageComponentStyle={{  
           width: '100%', 
           marginTop: 0, 
           height: '80%',
           resizeMode: 'contain'
        }}
        imageLoadingColor={'#3494c7'}
      />
    </View>
  );
};

export default FeedImageSlider;
