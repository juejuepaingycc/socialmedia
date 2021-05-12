import { firebase } from '../../firebase/config';
import axios from 'axios';

const notificationsRef = firebase.firestore().collection('notifications');

const usersRef = firebase.firestore().collection('users');

const fcmURL = 'https://fcm.googleapis.com/fcm/send';
const firebaseServerKey =
  'AAAA-TPRs2s:APA91bE6SOO4P0FwjKd8R8AoGy4YH03Cz9RKiWMD0Hp1RPQkQmevHGGMaC7obYIG9sE-qjqAhDyEsfvfzJlbKJFMQl0-EnZKnTCyqUEmJ1_1_c2G2zAjYZGs7SVgJWXxiSdIf29QHtuU';

const sendPayNotification = (user, title, body, type, token) => {
  let pushNotification;
  if(user != null){
    pushNotification = {
      to: user.push_token,
      notification: {
        title,
        body
      },
      data: { type, toUserID: user.ID },
    };
  }
  else{
    pushNotification = {
      to: token,
      notification: {
        title,
        body
      },
      data: { type },
    };
  }
  //console.log("NinePay Notification>>" + JSON.stringify(pushNotification));
  fetch(fcmURL, {
    method: 'post',
    headers: new Headers({
      Authorization: 'key=' + firebaseServerKey,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  })
  .then(res => {
    console.log("PayNoti Send>>"+ JSON.stringify(res))
  })
  .catch(err => {
    console.log("PayNoti err>>"+ JSON.stringify(err))
  })
}
  
const sendPushNotification = async (
  toUser,
  title,
  body,
  type,
  metadata = {},
  postId,
  channelId
) => {
  if (metadata && metadata.outBound && toUser.id == metadata.outBound.id) {
    return;
  }
  //console.log("Send to user>>" + JSON.stringify(toUser));
  const notification = {
    toUserID: toUser.id,
    title,
    body,
    metadata,
    toUser,
    type,
    seen: false,
    postId,
    channelId
  };

 // if(type != 'incoming_call'){
    const ref = await notificationsRef.add({
      ...notification,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    notificationsRef.doc(ref.id).update({ id: ref.id });
 // }

  if (!toUser.pushToken) {
    return;
  }

  const userDoc = await usersRef
  .where('id', '==', toUser.id)
  .get();

    const docs = userDoc.docs;
    if (docs.length > 0) {
      if(docs[0].data().push_notifications_enabled){
        let pushNotification;
        if(body.substring(0,9) == 'Call from'){
          console.log("Call noti.. Do nothing...");
          // pushNotification = {
          //   to: docs[0].data().pushToken,
          //   notification: {
          //     title: title,
          //     body: body,
          //     sound: 'incallmanager_ringtone.mp3',
          //     android_channel_id: "ninechat_channel"
          //   },    
          //   data: { ...metadata, type, toUserID: toUser.id },
          // };
        }
        else{
          console.log("Not Call noti..")
          pushNotification = {
            to: docs[0].data().pushToken,
            notification: {
              title: title,
              body: body,
              android_channel_id: "message_channel"
            },    
            data: { ...metadata, type, toUserID: toUser.id },
          };
        }
         
        fetch(fcmURL, {
          method: 'post',
          headers: new Headers({
            Authorization: 'key=' + firebaseServerKey,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(pushNotification),
        })
        .then(res => {
          console.log("Noti sent...")
        })
        .catch(err => {
          console.log("Catch err>>"+ JSON.stringify(err))
        })
      }
      else{
        console.log("Don't send notification...");
      }
    }
};

const sendPusher = (user_id, title, body) => {
  let url = "http://103.55.3.27/api/push/notification";
  let formData = new FormData();

  formData.append('user_id', user_id);
  formData.append('title', title);
  formData.append('body', body);
      
      axios.post(url, formData)
      .then(response => {
        console.log("sendPusher response>>"+ JSON.stringify(response));
     })
     .catch(err => {
      console.log("sendPusher error>>"+ JSON.stringify(err));
    });
}

//////////////////

const sendCallNotification = async (
  sender,
  recipient,
  channelID,
  callType,
  callID,
) => {
  if (!recipient.pushToken) {
    return;
  }

  const pushNotification = {
    to: recipient.pushToken,
    priority: 'high',
    data: {
      channelID,
      recipientID: recipient.id,
      senderID: sender.id,
      callType,
      callID,
      callerName: sender.firstName,
      priority: 'high',
      contentAvailable: true,
    },
  };

  try {
    const response = await fetch(fcmURL, {
      method: 'post',
      headers: new Headers({
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(pushNotification),
    });
    console.log('jjj push notif ' + JSON.stringify(pushNotification));
    console.log(JSON.stringify(response));
  } catch (error) {
    console.log(error);
  }
};

export const notificationManager = {
  sendPushNotification,
  sendCallNotification,
  sendPayNotification,
  sendPusher
};
