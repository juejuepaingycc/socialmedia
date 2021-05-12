'use strict';
import LoginManager from './LoginManager';
import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
//import { Notification } from 'react-native-firebase';
//import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification'
import { fcmService } from '../FCMService'
import { localNotificationService } from '../LocalNotificationService';
import authManager from '../Core/onboarding/utils/authManager';
import SocialNetworkConfig from '../SocialNetworkConfig';
import AsyncStorage from '@react-native-community/async-storage';

class PushManager {
    pushToken = null;
    username = '';

    constructor() { }

    init() {
        try {
       // console.log("push init")

            firebase.messaging().onTokenRefresh((token) => {
                console.log('Refresh token: ' + token);
            });
            firebase.messaging().onMessage(async (message) => {
                //console.log('PushManager: FCM: notification: ' + message.data);
                LoginManager.getInstance().pushNotificationReceived(message.data);
            });

            firebase.messaging().getToken()
                .then(token => {
                    this.pushToken = token;
                })
                .catch(() => {
                    console.warn('PushManager android: failed to get FCM token');
                });
              
        } catch (e) {
            console.warn('Push Init Error >>'+ JSON.stringify(e));
        }
    }

    getPushToken() {
        //console.log("[PushManager] getPushToken>>" + this.pushToken)
        return this.pushToken;
    }

    showLocalNotification = async () => {
        const options = {
            soundName: 'incallmanager_ringtone.mp3',
            playSound: true
        }
        console.log("[PUSH] NOTI...")
        localNotificationService.showNotification(
            0,
            "Nine Chat",
            "Incoming Call",
            {},
            options
        )
    }

    removeDeliveredNotification() {
        try {
            notifications().removeDeliveredNotification();
        } catch (e) {
            console.warn('3 removeDeliveredNotification error');
        }
    }
}

const pushManager = new PushManager();
export default pushManager;
