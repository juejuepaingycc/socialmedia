export const SET_PAY_NOTICOUNT = 'SET_PAY_NOTICOUNT';

export const setPayNotiCount = (noti_count) => {
  return dispatch => {
    dispatch({type: SET_PAY_NOTICOUNT, noti_count});
  };
};

