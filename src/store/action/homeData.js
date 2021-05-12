export const GET_RECENT_CONTACT = 'GET_RECENT_CONTACT';
export const SET_PAY_NOTICOUNT = 'SET_PAY_NOTICOUNT';
export const SET_AGENT_INFO = 'SET_AGENT_INFO';

export const setAgentInfo = (agent_info) => {
  return dispatch => {
    dispatch({type: SET_AGENT_INFO, agent_info});
  };
};

export const setPayNotiCount = (noti_count) => {
  return dispatch => {
    dispatch({type: SET_PAY_NOTICOUNT, noti_count});
  };
};

export const fetchPlaces = () => {
  return async dispatch => {
    const response = await fetch(
      'http://splendidone.website/public/index.php/api/popular-video',
      {
        method: 'POST',
      },
    );

    const responseData = await response.json();

    dispatch({type: GET_PLACE, placeList: responseData});
  };
};

export const fetchAlbumDetail = id => {
  return async dispatch => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/photos?albumId=${id}`,
    );

    const responseData = await response.json();

    dispatch({type: SET_ALBUM_DETAIL, AlbumDetail: responseData});
  };
};
