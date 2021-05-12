import React, { useState, useRef, useEffect } from 'react';
import { YellowBox, AppState } from 'react-native';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';
import configureStore from './redux/store';
import AppContainer from './screens/AppContainer';
import { AppCallWrapper } from './Core/chat/audioVideo/AppCallWrapper';
import * as FacebookAds from 'expo-ads-facebook';
import SocialNetworkConfig from './SocialNetworkConfig';
import { enableScreens } from 'react-native-screens';
import NavigationService from './routes/NavigationService';
import { fcmService } from './FCMService'
import { localNotificationService } from './LocalNotificationService';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import BGActions from '../BGActions';

if (SocialNetworkConfig.adsConfig) {
  FacebookAds.AdSettings.addTestDevice(
    FacebookAds.AdSettings.currentDeviceHash,
  );
  FacebookAds.AdSettings.setLogLevel('debug');
}

const MainNavigator = AppCallWrapper(AppContainer);

const store = configureStore();

const App = (props) => {
  const [colorScheme, setColorScheme] = useState('light');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(()=> {
    BGActions.startService()
 }, [])

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);


  const _handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    if(appState.current == 'active'){
      PushNotification.removeAllDeliveredNotifications();
    }
  };

  enableScreens();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token){
      //console.log("[App] onRegister: ", token);
    }

    function onNotification(notify){
      console.log("[App] onNotification: ", notify);
      const options = {
        soundName: 'default',
        playSound: true
      }
      localNotificationService.showNotification(
        '0',
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify){
      console.log("[App] onOpenNotification: ", notify);
    }
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    YellowBox.ignoreWarnings(['Remote Debugger']);
    console.disableYellowBox = true;
  }, []);

  return (
   <Provider store={store}>
        <MenuProvider>
          <MainNavigator screenProps={{ theme: colorScheme }}
                  ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }} />
        </MenuProvider>
    </Provider>  
  );
};

export default App;
