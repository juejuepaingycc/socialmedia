/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-community/async-storage';
import LoginManager from './src/manager/LoginManager';
import Pusher from 'pusher-js/react-native';
import { localNotificationService } from './src/LocalNotificationService';
import CallManager from './src/manager/CallManager';

var pusher = new Pusher('5e6a6fa8d478bd9697d8', {
  cluster: 'ap1'
});

var channel = pusher.subscribe('noti-channel');
channel.bind('noti-created', function(data) {
  console.log("Pusher event>>", data);
  AsyncStorage.getItem('voximplantUserID').then((value) => {
    if(value == data.user_id){
      AsyncStorage.getItem('AppKilled').then((state) => {
        if(state == 'true'){
          setTimeout(()=> {
            CallManager.getInstance().killCall();
          }, 6000)
        }
      })
      const options = {
        soundName: 'default',
        playSound: true
      }
      localNotificationService.showNotification(
        '0',
        data.title,
        data.body,
        data,
        options
      )
      LoginManager.getInstance().loginWithPassword(value + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
    }
  });
});

  presentIncomingCall = async (remoteMessage) => {
    if (Platform.OS != 'android') {
      return;
    }
  };

  const MyHeadlessTask = async () => {
    //console.log('Receiving Background actions!!');
  };
  
  AppRegistry.registerHeadlessTask('BGActions', () => MyHeadlessTask);
  AppRegistry.registerComponent(appName, () => App);
