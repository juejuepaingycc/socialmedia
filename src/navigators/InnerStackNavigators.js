import { createStackNavigator } from 'react-navigation-stack';
import {
  FeedScreen,
  ViewReactionScreen,
  DetailPostScreen,
  CreatePostScreen,
  ProfileScreen,
  ProfileQR,
  ChatScreen,
  GroupChatScreen,
  AlbumScreen,
  NearbyScreen,
  AppSettingScreen
 
} from '../screens';
import { IMCreateGroupScreen, IMChatScreen } from '../Core/chat';
import {
  IMFriendsScreen,
  IMFriendsChatScreen,
  IMAllFriendsScreen,
} from '../Core/socialgraph/friendships';
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
  IMProfileSettingsScreen,
} from '../Core/profile';
import CallScreen from '../screens/CallScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';
import { IMNotificationScreen } from '../Core/notifications';
import AppStyles from '../AppStyles';
import SocialNetworkConfig from '../SocialNetworkConfig';
import { IMLocalized } from '../Core/localization/IMLocalization';
import { Platform } from 'react-native';
import App from '../../App';
import Language from '../../Language';
import ImageSwiper from '../screens/ImageSwiper/ImageSwiper';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import BlockedUsersScreen from '../screens/BlockedUsersScreen/BlockedUsersScreen';
import SignInScreen from '../screens/signIn/signIn';
import ContactsScreen from '../screens/contacts/contacts';
import CommentReplyScreen from '../screens/commentReply/commentReply';
import ReactionListScreen from '../screens/reactionList/reactionList';
var lan = '';

const InnerFriendsNavigator = createStackNavigator(
  {
    Friends: { screen: IMFriendsScreen },
    FriendsProfile: { screen: ProfileScreen },
    FriendsAllFriends: { screen: IMAllFriendsScreen },
  },
  {
    initialRouteName: 'Friends',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
      followEnabled: false,
      friendsScreenTitle: lan,
      showDrawerMenuButton: Platform.OS == 'android',
    },
    headerMode: 'float',
  },
);

const InnerFriendsChatNavigator = createStackNavigator(
  {
    FriendsChat: { screen: IMFriendsChatScreen },
    PersonalFriendsChat: { screen: IMChatScreen },

  },
  {
    initialRouteName: 'FriendsChat',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
      followEnabled: false,
      friendsScreenTitle: lan,
      showDrawerMenuButton: Platform.OS == 'android',
    },
    headerMode: 'float',
  },
);


const InnerGroupChatNavigator = createStackNavigator(
  {
    CreateGroup: { screen: IMCreateGroupScreen },
    GroupChat: { screen: GroupChatScreen }
  },
  {
    initialRouteName: 'GroupChat',
    headerMode: 'float',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
    },
  },
);

const InnerDiscoverNavigator = createStackNavigator(
  {
    DiscoverDetailPost: { screen: DetailPostScreen },
    DiscoverProfile: { screen: ProfileScreen },
    DiscoverNotification: { screen: IMNotificationScreen },
    DiscoverProfileSettings: { screen: IMProfileSettingsScreen },
    DiscoverEditProfile: { screen: IMEditProfileScreen },
    DiscoverAppSettings: { screen: IMUserSettingsScreen },
    DiscoverContactUs: { screen: IMContactUsScreen },
    DiscoverAllFriends: { screen: IMAllFriendsScreen },
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'float',
  },
);
// working
const InnerProfileNavigator = createStackNavigator(
  {
    Profile: { screen: ProfileScreen },
    ProfileNotification: { screen: IMNotificationScreen },
    ProfileProfileSettings: { screen: IMProfileSettingsScreen },
    ProfileEditProfile: { screen: IMEditProfileScreen },
    ProfileAppSettings: { screen: IMUserSettingsScreen },
    ProfileContactUs: { screen: IMContactUsScreen },
    ProfileAllFriends: { screen: IMAllFriendsScreen },
    ProfilePostDetails: { screen: DetailPostScreen },
    ReactionList: { screen: ReactionListScreen },
    Reaction: { screen: ViewReactionScreen },
    ProfileCreatePost: { screen: CreatePostScreen },
    ChangePassword: { screen: ChangePasswordScreen },
    BlockedUsers: { screen: BlockedUsersScreen },
    Language: { screen: Language},
    ProfileMediaSwiper: { screen: ImageSwiper, 
      navigationOptions: {
      headerShown: false
    } },
    //
    // FeedDetailPost: {screen: DetailPostScreen},
    // NotificationDetailPostProfile: {screen: ProfileScreen},
    ProfileDetailPostProfile: { screen: ProfileScreen },
    ProfileQR: { screen: ProfileQR },
    Album: { screen: AlbumScreen },
    Nearby: { screen: NearbyScreen },
    AppSettings: { screen: AppSettingScreen },
    Payment: {screen: App,
      navigationOptions: {
      headerShown: false
    }
   },
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'float',

  },
);

const InnerProfile2Navigator = createStackNavigator(
  {
    Profile: { screen: ProfileScreen },
    ProfileNotification: { screen: IMNotificationScreen },
    ProfileProfileSettings: { screen: IMProfileSettingsScreen },
    ProfileEditProfile: { screen: IMEditProfileScreen },
    ProfileAppSettings: { screen: IMUserSettingsScreen },
    ProfileContactUs: { screen: IMContactUsScreen },
    ProfileAllFriends: { screen: IMAllFriendsScreen },
    ProfilePostDetails: { screen: DetailPostScreen },
    ReactionList: { screen: ReactionListScreen },
    Reaction: { screen: ViewReactionScreen },
    ProfileCreatePost: { screen: CreatePostScreen },
    ChangePassword: { screen: ChangePasswordScreen },
    BlockedUsers: { screen: BlockedUsersScreen },
    Language: { screen: Language},
    ProfileMediaSwiper: { screen: ImageSwiper, 
      navigationOptions: {
      headerShown: false
    } },
    //
    // FeedDetailPost: {screen: DetailPostScreen},
    // NotificationDetailPostProfile: {screen: ProfileScreen},
    ProfileDetailPostProfile: { screen: ProfileScreen },
    ProfileQR: { screen: ProfileQR },
    Album: { screen: AlbumScreen },
    Nearby: { screen: NearbyScreen },
    AppSettings: { screen: AppSettingScreen },
    Payment: {screen: App,
      navigationOptions: {
      headerShown: false
    }
   },
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'float',

  },
);


const InnerChatNavigator = createStackNavigator(
  {
    Chat: { screen: ChatScreen },
    CreateGroup: { screen: IMCreateGroupScreen },
    ChatNotification: { screen: IMNotificationScreen },
    ChatPeopleStack: { screen: InnerFriendsNavigator,
      navigationOptions: {
        headerShown: false
      } },
    FriendsChatPeopleStack: { screen: InnerFriendsChatNavigator,
        navigationOptions: {
          headerShown: false
        } },
    GroupChat: { screen: InnerGroupChatNavigator,
        navigationOptions: {
          headerShown: false
        } },
    //ChatProfile: { screen: ProfileScreen },
    ChatProfile: { screen: InnerProfile2Navigator,
      navigationOptions: {
        headerShown: false
      }},
    ChatMediaSwiper: { screen: ImageSwiper, 
      navigationOptions: {
      headerShown: false
    } },
    Contacts: { screen: ContactsScreen,
      navigationOptions: {
        headerShown: false
      } },
  },
  {
    initialRouteName: 'Chat',
    headerMode: 'float',
  },
);


const InnerCallNavigator = createStackNavigator(
  {
    PersonalChat: { screen: IMChatScreen },
    Call: { screen: CallScreen,
      navigationOptions: {
        headerShown: false
        
      } },
    IncomingCall: { screen: IncomingCallScreen,
      navigationOptions: {
        headerShown: false
      } }
  },
  {
     initialRouteName: 'PersonalChat',
    // headerMode: 'none',
  }
)

const InnerFeedNavigator = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
    Feed: { screen: FeedScreen },
    FeedGroupChat: { screen: GroupChatScreen },
    Reaction: { screen: ViewReactionScreen },
    FeedDetailPost: { screen: DetailPostScreen },
    ReactionList: { screen: ReactionListScreen },
    FeedCommentReply: { screen: CommentReplyScreen },
    CreatePost: { screen: CreatePostScreen },
    FeedProfile: { screen: ProfileScreen },
    FeedProfileStack: { screen: InnerProfile2Navigator,
      navigationOptions: {
        headerShown: false
      }},
    FeedNotification: { screen: IMNotificationScreen },
    FeedProfileSettings: { screen: IMProfileSettingsScreen },
    FeedEditProfile: { screen: IMEditProfileScreen },
    FeedAppSettings: { screen: IMUserSettingsScreen },
    FeedContactUs: { screen: IMContactUsScreen },
    FeedAllFriends: { screen: IMAllFriendsScreen },
    MediaSwiper: { screen: ImageSwiper, 
      navigationOptions: {
      headerShown: false
    } },
    SPayment: { screen: App,
      navigationOptions: {
      headerShown: false
    }
   },

    /* FeedProfileStack: { screen: InnerProfileNavigator,
      navigationOptions: {
        headerShown: false
      }},
      FeedExploreStack: InnerDiscoverNavigator,
    FeedMessageStack: { screen: InnerChatNavigator,
      navigationOptions: {
        headerShown: false
      }},
    FeedPeopleStack: { screen: InnerFriendsNavigator,
      navigationOptions: {
        headerShown: false
      }}, */
  },
  {
    initialRouteName: 'Feed',
    headerMode: 'float',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
    },
  },
);
export {
  InnerFeedNavigator,
  InnerChatNavigator,
  InnerFriendsNavigator,
  InnerDiscoverNavigator,
  InnerProfileNavigator,
  InnerProfile2Navigator,
  InnerCallNavigator,
  InnerGroupChatNavigator
};
