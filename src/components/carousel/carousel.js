import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {sliderWidth, itemWidth} from './slide/SliderEntry.style';
import SliderEntry from './slide/SliderEntry';
import styles from './carousel.style';
import {Scales, Colors} from '@common';
import * as Animatable from 'react-native-animatable';

const Swiper = props => {
  const SlideData = useSelector(state => state.SlideImages.introImages);

  const SLIDER_1_FIRST_ITEM = 0;

  const _renderItem = ({item}) => {
    return <SliderEntry data={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        <Carousel
          ref={props.carouselRef}
          data={SlideData}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          firstItem={SLIDER_1_FIRST_ITEM}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={false}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => props.setActiveSlide(index)}
        />
      </View>
      <View style={styles.dotContainer}>
        <Pagination
          dotsLength={SlideData.length}
          activeDotIndex={props.ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={Colors.WHITE}
          dotStyle={styles.paginationDot}
          inactiveDotColor={Colors.TRANSPARENT_WHITE8}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={props.carouselRef}
          tappableDots={!!props.carouselRef}
        />
        {props.ActiveSlide === 2 ? (
          <TouchableOpacity activeOpacity={0.5} onPress={props.onStartPress}>
            <Animatable.Text
              animation="bounceIn"
              easing="ease-out"
              iterationCount={1}
              style={styles.navBtnText}>
              GET STARTED
            </Animatable.Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.5} onPress={props.onNextPress}>
            <Text style={styles.navBtnText}>NEXT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default Swiper;
