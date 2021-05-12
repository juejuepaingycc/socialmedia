import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StatusBar,
  ImageBackground,
  ActivityIndicator, ß
} from 'react-native';
import { Colors, Scales } from '@common';
import styles from './loading.styles';
//import requestPromise from 'request-promise-native';

const MainLoadingScreen = props => {

  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');

  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Welcome', { appStyles, appConfig });
    }, 2000);

    return;
  });

  return (
    <View style={styles.container}>
      {/* <StatusBar
        translucent={true}
        backgroundColor={Colors.WHITE}
        barStyle={'dark-content'}
        animated={true}
      /> */}
      <ImageBackground
        source={require('../../assets/img/insta_splash_dark.jpg')}
        style={styles.Imagecontainer}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'#3494c7'} />
        </View>
      </ImageBackground>
    </View>
  );
};

export default MainLoadingScreen;
