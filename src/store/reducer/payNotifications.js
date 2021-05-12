import { SET_PAY_NOTICOUNT } from '../action/payNotifications';

const initialState = {
  payNotiCount: 100
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PAY_NOTICOUNT:
      return { ...state, payNotiCount: action.noti_count };
  }

  return state;
};
