import IMUserReportingActionsConstants from './types';

export const setBannedUserIDs = (data) => ({
  type: IMUserReportingActionsConstants.SET_BANNED_USER_IDS,
  data,
});

export const setBannedUsers = (data) => ({
  type: IMUserReportingActionsConstants.SET_BANNED_USERS,
  data,
});
