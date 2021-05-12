import IMNotificationActionsConstants from './types';

const initialState = {
  notifications: null,
  chatNotifications: [],
  notiCount: 0,
  chatNotiCount: 0,
  friendNotifications: [],
  friendNotiCount: 0
};

export const notifications = (state = initialState, action) => {
  switch (action.type) {
    case IMNotificationActionsConstants.SET_NOTIFICATIONS:
      return { ...state, notifications: [...action.data] };
    case IMNotificationActionsConstants.DID_SUBSCRIBE:
      return { ...state, didSubscribeToNotifications: true };
    case IMNotificationActionsConstants.SET_NOTICOUNT:
      return { ...state, notiCount: action.notiCount };
    case IMNotificationActionsConstants.SET_CHAT_NOTICOUNT:
      return { ...state, chatNotiCount: action.chatNotiCount };
    case IMNotificationActionsConstants.SET_FRIEND_NOTICOUNT:
      return { ...state, friendNotiCount: action.friendNotiCount };
    case IMNotificationActionsConstants.SET_CHAT_NOTIFICATIONS:
      return { ...state, chatNotifications: [...action.data] };
    case IMNotificationActionsConstants.SET_FRIEND_NOTIFICATIONS:
      return { ...state, friendNotifications: [...action.data] };
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};
