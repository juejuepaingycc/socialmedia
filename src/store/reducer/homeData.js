import {GET_RECENT_CONTACT} from '../action/homeData';
import {RecentCont, Service} from '../../../StaticData/slideImages';
import { SET_PAY_NOTICOUNT } from '../action/homeData';
import { SET_AGENT_INFO } from '../action/homeData';

const initialState = {
  recentContact: RecentCont,
  services: Service,
  payNotiCount: 0,
  agent_info: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_RECENT_CONTACT:
      return {
        RecentContact: RecentCont,
      };

    case GET_RECENT_CONTACT:
      return {
        AlbumDetail: action.AlbumDetail,
      };
    case SET_PAY_NOTICOUNT:
      return { ...state, payNotiCount: action.noti_count };
    case SET_AGENT_INFO:
      return { ...state, agent_info: action.agent_info };
  }

  return state;
};
