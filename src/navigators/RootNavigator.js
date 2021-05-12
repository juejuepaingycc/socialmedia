import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import AppStyles from '../AppStyles';
import { LoadScreen, WalkthroughScreen } from '../Core/onboarding';
import MainStackNavigator from './MainStackNavigator';
import LoginStack from './AuthStackNavigator';
import SocialNetworkConfig from '../SocialNetworkConfig';
import { createStackNavigator } from 'react-navigation-stack';
import NavigationService from '../routes/NavigationService';

const Main = () => {
  return <MainStackNavigator
  ref={navigatorRef => {
    NavigationService.setTopLevelNavigator(navigatorRef);
  }}
/>;
} 

export const RootNavigator = createStackNavigator(
  {
    LoadScreen: {screen: LoadScreen},
    Walkthrough: {screen: WalkthroughScreen},
    LoginStack: {screen: LoginStack},
    MainStack: Main
  },
  {
    initialRouteName: 'LoadScreen',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
    },
    headerMode: 'none',
  },

);

export default RootNavigator;
