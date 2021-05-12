import { act } from 'react-test-renderer';
import IMFeedActionsConstants from './types';

const initialState = {
  mainFeedPosts: null,
  newFeeds: [],
  profileFeeds: null,
  otherProfileFeeds: null,
  discoverFeedPosts: null,
  feedPostReactions: null,
  currentUserFeedPosts: null,
  mainStories: null,
  editedProfileStatus: false,
  didSubscribeToMainFeed: false,
  profileEditedPost: null
};

export const feed = (state = initialState, action) => {
  switch (action.type) {
    case IMFeedActionsConstants.SET_MAIN_FEED_POSTS:
      return { ...state, mainFeedPosts: [...action.data] };
    case IMFeedActionsConstants.SET_NEWFEEDs:
      return { ...state, newFeeds: [...action.data] };
    case IMFeedActionsConstants.SET_PROFILE_FEEDS:
      return { ...state, profileFeeds: [...action.data] };
    case IMFeedActionsConstants.SET_OTHER_PROFILE_FEEDS:
      return { ...state, otherProfileFeeds: [...action.data] };
    case IMFeedActionsConstants.SET_PROFILE_EDITED_POST:
      return { ...state, profileEditedPost: {...action.data} };
    case IMFeedActionsConstants.EDIT_NEWFEEDS:
      return { ...state, newFeeds: state.newFeeds.map(
        (feed) => feed.id === action.data.id ? {...feed, ...action.data}
                                : feed
    ) };
    case IMFeedActionsConstants.EDIT_POST_REACTIONS:
      return { ...state, newFeeds: state.newFeeds.map(
        (feed) => feed.id === action.postID ? 
          {...feed, 
            postReactions: action.reactions, 
            postReactionsCount: action.count, 
            gaveReaction: action.gaveReaction, 
            iconSource: action.iconSource 
          }
          : feed
    ) };
    case IMFeedActionsConstants.EDIT_PROFILE_POST_REACTIONS:
      return { ...state, profileFeeds: state.profileFeeds.map(
        (feed) => feed.id === action.postID ? 
          {...feed, 
            postReactions: action.reactions, 
            postReactionsCount: action.count, 
            gaveReaction: action.gaveReaction, 
            iconSource: action.iconSource 
          }
          : feed
    ) };
    case IMFeedActionsConstants.EDIT_OTHER_PROFILE_POST_REACTIONS:
      return { ...state, otherProfileFeeds: state.otherProfileFeeds.map(
        (feed) => feed.id === action.postID ? 
          {...feed, 
            postReactions: action.reactions, 
            postReactionsCount: action.count, 
            gaveReaction: action.gaveReaction, 
            iconSource: action.iconSource 
          }
          : feed
    ) };
    case IMFeedActionsConstants.EDIT_PROFILE_FEEDS:
      return { ...state, profileFeeds: state.profileFeeds.map(
        (feed) => feed.id === action.data.id ? {...feed, ...action.data}
                                : feed
    ) };
    case IMFeedActionsConstants.REMOVE_POST:
      return { ...state, newFeeds: state.newFeeds.filter(
        (feed) => feed.id != action.postID) };
    case IMFeedActionsConstants.REMOVE_PROFILE_POST:
      return { ...state, profileFeeds: state.profileFeeds.filter(
        (feed) => feed.id != action.postID) };
    case IMFeedActionsConstants.SET_FIRST_POST:
      return { ...state, firstPost: action.post };
    case IMFeedActionsConstants.SET_CURRENT_USER_FEED_POSTS:
      return { ...state, currentUserFeedPosts: [...action.data] };
    case IMFeedActionsConstants.SET_DISCOVER_FEED_POSTS:
      return { ...state, discoverFeedPosts: [...action.data] };
    case IMFeedActionsConstants.SET_MAIN_FEED_POST_REACTIONS:
      return { ...state, feedPostReactions: [...action.data] };
    case IMFeedActionsConstants.SET_MAIN_STORIES:
      return { ...state, mainStories: [...action.data] };
    case IMFeedActionsConstants.INSERT_MAIN_FEED_POSTS:
      return { ...state, mainFeedPosts: [ action.data, ...state.mainFeedPosts ] };
    case IMFeedActionsConstants.INSERT_NEWFEEDS:
      return { ...state, newFeeds: [ action.data, ...state.newFeeds ] };
    case IMFeedActionsConstants.INSERT_PROFILE_FEEDS:
      return { ...state, profileFeeds: [ action.data, ...state.profileFeeds ] };
      case IMFeedActionsConstants.INSERT_MORE_MAIN_FEED_POSTS:
      return { ...state, mainFeedPosts: [ ...state.mainFeedPosts, ...action.data ] };
    case IMFeedActionsConstants.INSERT_MORE_NEWFEEDS:
      return { ...state, newFeeds: [ ...state.newFeeds, ...action.data ] };
    case IMFeedActionsConstants.DID_SUBSCRIBE:
      return { ...state, didSubscribeToMainFeed: true };
    case IMFeedActionsConstants.SET_STATUS:
      return { ...state, status: action.status };
    case IMFeedActionsConstants.SET_EDITED_PROFILE_STATUS:
      return { ...state, editedProfileStatus: action.status };
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};
