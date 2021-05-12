import React, {useState, useRef} from 'react';
import {Text, View, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import * as Animatable from 'react-native-animatable';

import Swiper from '../../components/carousel/carousel';
import {Colors, Scales} from '@common';
import styles from './intro.styles';

const IntroScreen = (props) => {
  const [ActiveSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        animated={true}
      /> */}
      <View
        style={{
          ...styles.slideContainer,
          backgroundColor:
            ActiveSlide === 0
              ? '#FF7E57'
              : ActiveSlide === 1
              ? '#FFAC22'
              : ActiveSlide === 2
              ? '#4365FF'
              : '#FFF',
        }}>
        <Swiper
          ActiveSlide={ActiveSlide}
          setActiveSlide={setActiveSlide}
          carouselRef={carouselRef}
          onStartPress={() => props.navigation.navigate('Auth')}
          onNextPress={() => {
            goForward();
          }}
        />
        <SafeAreaView />
      </View>
    </View>
  );
};

export default IntroScreen;
