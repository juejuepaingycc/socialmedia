import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  ImageBackground,
  Image,
  ActivityIndicator, ß
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import { Colors, Scales } from '@common';
import styles from './loading.styles';
import deviceStorage from '../../Core/onboarding/utils/AuthDeviceStorage';

const LoadingScreen = props => {
  useEffect(() => {
    //setTimeout(() => {
      //props.navigation.navigate('Intro');


      setAppState();

  //  }, 1000);

    return;
  });

  const setAppState = async () => {
    const shouldShowOnboardingFlow2 = await deviceStorage.getShouldShowOnboardingFlow2();
    if (!shouldShowOnboardingFlow2) {
      props.navigation.navigate('Auth');
    } else {
      setTimeout(() => {
        props.navigation.navigate('Intro');
         }, 1000);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.loading}>
          <ActivityIndicator size="large" color={'#3494c7'} />
        </View>
      <Image
        source={require('../../assets/img/logo_only.png')}
        style={styles.Imagecontainer}>
      </Image>

    </View>
  );
};

export default LoadingScreen;
