import { firebase } from '../../firebase/config';
import { notifications } from '../redux';

export const notificationsRef = firebase
  .firestore()
  .collection('notifications');
const db = firebase.firestore();

export const getNotifications = async (userId, callback) => {

    const snapshot = await notificationsRef
    .where('toUserID', '==', userId)
    //.where('type', '==', 'chat_message')
    .orderBy('createdAt', 'desc')
    .get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      callback(null)
    }  
    const notifications = [];
    snapshot.forEach(notificationDoc => {
      const notification = notificationDoc.data();
      notification.id = notificationDoc.id;
      notifications.push(notification);
    });
    callback(notifications);
};

export const subscribeNotifications = async (userId, callback) => {
  const batch = db.batch();
  return notificationsRef
    .where('toUserID', '==', userId)
    .orderBy('createdAt', 'desc')
    //.limit(100)
    .onSnapshot(
      (notificationSnapshot) => {
        const notifications = [];
        notificationSnapshot.forEach((notificationDoc) => {
          const notification = notificationDoc.data();
          notification.id = notificationDoc.id;
          notifications.push(notification);
        });
        callback(notifications);
      },
      (error) => {
        console.log(error);
        alert(error);
      },
    );
};

export const resetChatNotification = async (notifications) => {

  const batch = db.batch();

  notifications.forEach((notification) => {
    if(!notification.checkedCount){
      //console.log("Update......")
      const ref = notificationsRef.doc(notification.id)
      batch.set(ref, { ...notification, checkedCount: true });
    }
  });
  await batch.commit();
};

export const checkecdCountNotifications = async (notifications, callback) => {

  const batch = db.batch();

  notifications.forEach((notification) => {
    if(!notification.checkedCount){
      //console.log("Update......")
      const ref = notificationsRef.doc(notification.id)
      batch.set(ref, { ...notification, checkedCount: true });
    }
  });
  await batch.commit();
  callback(true);
};


// const ref = notificationsRef.doc(notificationDoc.id)
// batch.set(ref, { ...notificationDoc.data(), checkedCount: true });
// await batch.commit();

export const updateNotification = async (notification) => {
  try {
    await notificationsRef.doc(notification.id).update({ ...notification });

    return { success: true };


  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};

export const deleteNotification = async (id) => {
  try {
    await notificationsRef.doc(id).delete();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};
