import IMFeedActionsConstants from './types';

export const setMainFeedPosts = (data) => ({
  type: IMFeedActionsConstants.SET_MAIN_FEED_POSTS,
  data,
});

export const setNewFeeds = (data) => ({
  type: IMFeedActionsConstants.SET_NEWFEEDs,
  data,
});

export const setProfileFeeds = (data) => ({
  type: IMFeedActionsConstants.SET_PROFILE_FEEDS,
  data,
});

export const setOtherProfileFeeds = (data) => ({
  type: IMFeedActionsConstants.SET_OTHER_PROFILE_FEEDS,
  data,
});

export const removePost = (postID) => ({
  type: IMFeedActionsConstants.REMOVE_POST,
  postID,
});

export const removeProfilePost = (postID) => ({
  type: IMFeedActionsConstants.REMOVE_PROFILE_POST,
  postID,
});

export const insertMainFeedPosts = (data) => ({
  type: IMFeedActionsConstants.INSERT_MAIN_FEED_POSTS,
  data,
});

export const insertNewFeeds = (data) => ({
  type: IMFeedActionsConstants.INSERT_NEWFEEDS,
  data,
});

export const insertProfileFeeds = (data) => ({
  type: IMFeedActionsConstants.INSERT_PROFILE_FEEDS,
  data,
});

export const editPostReactions = (postID, reactions, count, gaveReaction, iconSource) => ({
  type: IMFeedActionsConstants.EDIT_POST_REACTIONS,
  postID, reactions, count, gaveReaction, iconSource
});

export const editProfilePostReactions = (postID, reactions, count, gaveReaction, iconSource) => ({
  type: IMFeedActionsConstants.EDIT_PROFILE_POST_REACTIONS,
  postID, reactions, count, gaveReaction, iconSource
});

export const editOtherProfilePostReactions = (postID, reactions, count, gaveReaction, iconSource) => ({
  type: IMFeedActionsConstants.EDIT_OTHER_PROFILE_POST_REACTIONS,
  postID, reactions, count, gaveReaction, iconSource
});

export const editNewFeeds = (data) => ({
  type: IMFeedActionsConstants.EDIT_NEWFEEDS,
  data,
});

export const editProfileFeeds = (data) => ({
  type: IMFeedActionsConstants.EDIT_PROFILE_FEEDS,
  data,
});

export const insertMoreNewFeeds = (data) => ({
  type: IMFeedActionsConstants.INSERT_MORE_NEWFEEDS,
  data,
});

export const insertMoreMainFeedPosts = (data) => ({
  type: IMFeedActionsConstants.INSERT_MORE_MAIN_FEED_POSTS,
  data,
});

export const setCurrentUserFeedPosts = (data) => ({
  type: IMFeedActionsConstants.SET_CURRENT_USER_FEED_POSTS,
  data,
});

export const setDiscoverFeedPosts = (data) => ({
  type: IMFeedActionsConstants.SET_DISCOVER_FEED_POSTS,
  data,
});

export const setFeedPostReactions = (data) => ({
  type: IMFeedActionsConstants.SET_MAIN_FEED_POST_REACTIONS,
  data,
});

export const setFeedFirstPost = (post) => ({
  type: IMFeedActionsConstants.SET_FIRST_POST,
  post,
});

export const setProfileEditedPost = (data) => ({
  type: IMFeedActionsConstants.SET_PROFILE_EDITED_POST,
  data,
});

export const setNewPostStatus = (status) => ({
  type: IMFeedActionsConstants.SET_STATUS,
  status,
});

export const setEditedProfileStatus = (status) => ({
  type: IMFeedActionsConstants.SET_EDITED_PROFILE_STATUS,
  status,
});

export const setMainStories = (data) => ({
  type: IMFeedActionsConstants.SET_MAIN_STORIES,
  data,
});

export const setFeedListenerDidSubscribe = () => ({
  type: IMFeedActionsConstants.DID_SUBSCRIBE,
});
