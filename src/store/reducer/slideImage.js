import {GET_INTRO_IMAGES, GET_HOME_SLIDE_IMAGES} from '../action/slideImage';
import {IntroImages, HomeSlideImages} from '../../../StaticData/slideImages';

const initialState = {
  introImages: IntroImages,
  homeSlideImages: HomeSlideImages,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_INTRO_IMAGES:
      return {
        VideoList: action.videos,
      };

    case GET_HOME_SLIDE_IMAGES:
      return {
        AlbumDetail: action.AlbumDetail,
      };
  }

  return state;
};
