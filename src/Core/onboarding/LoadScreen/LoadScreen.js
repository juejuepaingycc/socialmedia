import React, { useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import deviceStorage from '../utils/AuthDeviceStorage';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { setI18nConfig } from '../../../Core/localization/IMLocalization';
import { setLanguage } from '../../../actions';
const LoadScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const appStyles =
    navigation.state.params.appStyles || props.navigation.getParam('appStyles');
  const appConfig =
    navigation.state.params.appConfig || props.navigation.getParam('appConfig');

  useEffect(() => {
    setAppState();
  }, []);

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("languageAsync").then((value) => {
        if(value == null){
          setI18nConfig('EN');
          dispatch(setLanguage('EN'))
        }
        else{
          setI18nConfig(value);
          dispatch(setLanguage(value))
        }  
  });

    })();
  }, []);

 

  const setAppState = async () => {
    const shouldShowOnboardingFlow = await deviceStorage.getShouldShowOnboardingFlow();
    if (!shouldShowOnboardingFlow) {
      navigation.navigate('LoginStack', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    } else {
      navigation.navigate('Walkthrough', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    }
  };

  return <View />;
};

LoadScreen.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

LoadScreen.navigationOptions = {
  header: null,
};

export default LoadScreen;
