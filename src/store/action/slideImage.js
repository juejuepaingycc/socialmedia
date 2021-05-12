export const GET_INTRO_IMAGES = 'GET_INTRO_IMAGES';
export const GET_HOME_SLIDE_IMAGES = 'GET_HOME_SLIDE_IMAGES';

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
