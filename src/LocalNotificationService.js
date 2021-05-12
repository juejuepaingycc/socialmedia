import { Platform, AppState } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';

class LocalNotificationService{

  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        //console.log("[LocalNotificationService] onRegister:", token);
        AsyncStorage.setItem('pushToken', token.token);
      },
      onNotification: function (notification) {
        //console.log("[LocalNotificationService] onNotification:", notification);
        if(!notification?.data){
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(Platform.OS === 'ios' ? notification.data.item: notification.data)
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      //senderID: "1070316237675",
      popInitialNotification: true,
      requestPermissions: true
    }) 
  }

  unRegister = () => {
    PushNotification.unregister();
  }

  showNotification = (id, title, message, data = {}, options = {}) => {
    AsyncStorage.getItem('AppKilled').then((value) => {
      if(value == 'true'){
        console.log("Don't show notification...");
      }
      else{
        if(AppState.currentState == 'active' && message.substring(0,9) == 'Call from' &&
          !title.includes('Payment successful') && !title.includes(' transferred bill.')
        ){
          console.log("Don't show notification...");
        }
        else{
          console.log("Showing Local Notification...")
          PushNotification.localNotification({
            ...this.buildAndroidNotification(id, title, message, data, options),
            ...this.buildIOSNotification(id, title, message, data, options),
            title: title || '',
            message: message || '',
            playSound: true,
            //soundName: 'default',
            userInteraction: true,
            invokeApp: true
          })
        }
      }
            });
  }

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    if(message.substring(0,9) == 'Call from')
      return{
        channelId: 'ninechat_channel',
        id: id,
        autoCancel: true,
        largeIcon: options.largeIcon || 'ic_launcher',
        smallIcon: options.smallIcon || 'ic_notification',
        bigText: message || '',
        subText: title || '',
        vibrate: options.vibrate || true,
        vibration: options.vibration || 300,
        priority: options.priority || 'high',
        importance: options.importance || 'high',
        data: data
      }
    else
      return{
        id: id,
        autoCancel: true,
        largeIcon: options.largeIcon || 'ic_launcher',
        smallIcon: options.smallIcon || 'ic_notification',
        bigText: message || '',
        subText: title || '',
        vibrate: options.vibrate || true,
        vibration: options.vibration || 300,
        priority: options.priority || 'high',
        importance: options.importance || 'high',
        data: data
      }
  }

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return{
     alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data
      }
    }
  }

  cancelAllLocalNotifications = () => {
    if(Platform.OS === 'ios'){
      //
    }
    else{
      PushNotification.cancelAllLocalNotifications();
    }
  }

  removeDeliveredNotificationByID = (notificationId) => {
    //console.log("[LocalNotificationService] removeDeliveredNotificationByID:", notificationId);
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` })
  }
}

export const localNotificationService = new LocalNotificationService();