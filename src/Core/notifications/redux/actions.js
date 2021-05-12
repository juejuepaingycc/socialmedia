import IMNotificationActionsConstants from './types';

export const setNotifications = (data) => ({
  type: IMNotificationActionsConstants.SET_NOTIFICATIONS,
  data,
});

export const setChatNotifications = (data) => ({
  type: IMNotificationActionsConstants.SET_CHAT_NOTIFICATIONS,
  data,
});

export const setFriendNotifications = (data) => ({
  type: IMNotificationActionsConstants.SET_FRIEND_NOTIFICATIONS,
  data,
});

export const setNotiCount = (notiCount) => ({
  type: IMNotificationActionsConstants.SET_NOTICOUNT,
  notiCount,
});

export const setChatNotiCount = (chatNotiCount) => ({
  type: IMNotificationActionsConstants.SET_CHAT_NOTICOUNT,
  chatNotiCount,
});

export const setFriendNotiCount = (friedNotiCount) => ({
  type: IMNotificationActionsConstants.SET_FRIEND_NOTICOUNT,
  friedNotiCount,
});

export const setNotificationListenerDidSubscribe = () => ({
  type: IMNotificationActionsConstants.DID_SUBSCRIBE,
});
