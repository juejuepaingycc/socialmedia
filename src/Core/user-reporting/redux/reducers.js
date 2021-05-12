import IMUserReportingActionsConstants from './types';

const initialState = {
  bannedUserIDs: null,
  bannedUsers: []
};

export const userReports = (state = initialState, action) => {
  switch (action.type) {
    case IMUserReportingActionsConstants.SET_BANNED_USER_IDS:
      return { ...state, bannedUserIDs: [...action.data] };
    case IMUserReportingActionsConstants.SET_BANNED_USERS:
      return { ...state, bannedUsers: [...action.data] };
    default:
      return state;
  }
};
